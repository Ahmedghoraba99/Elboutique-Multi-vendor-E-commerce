import { Component, OnInit ,ViewChild ,ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule ,NgIf} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { PaymentService } from '../service/payment.service';
import Swal from 'sweetalert2';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { UserProfileService } from '../service/user-profile.service';
import { ProfileUser } from '../_model/customer';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ordercomponent',
  standalone: true,
  imports: [FontAwesomeModule ,CommonModule,NgIf, RouterLink,ReactiveFormsModule],
  templateUrl: './ordercomponent.component.html',
  styleUrl: './ordercomponent.component.css'
})
export class OrdercomponentComponent implements OnInit{
  faLocationDot=faLocationDot;
  faMoneyBill=faMoneyBill;
  customerCart: any[] = [];
  getCartSub: Subscription | null = null;
  clearCartSub: Subscription | null = null;
  paybalSub: Subscription | null = null;
  isAuthObservableSub!: Subscription;
  paymentForm: FormGroup;
  addOrderSub: Subscription | null = null;
  addProductsToOrderSub: Subscription | null = null;
  user!:ProfileUser;
  isEditable = false;
  profileImage: string | ArrayBuffer | null = 'https://i.pravatar.cc/300';

  constructor(    
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private http: HttpClient,
    private authService:AuthService ,
    private profileService: UserProfileService
  ){ this.paymentForm = this.fb.group({
    cardNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9 ]{19}$')],
    ], // Adjust the pattern to include spaces
    cardHolder: ['', [Validators.required]],
    expDate: [
      '',
      [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$'),
      ],
    ],
    ccv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
    paymentType: ['', Validators.required],
  })}

  ngOnInit(): void {
    this.getCartSub = this.cartService.getCustomerCart().subscribe((cart) => {
      if (cart) {
        this.customerCart = cart;
        console.log(cart)
      }
    })
    this.authService.getUserDataObservable().subscribe(
      (data) => {
        this.user = data;
        this.profileImage = this.user?.data?.image_url;
        console.log(this.user);

      
    });
}
getOrderTotalPrice() {
  return this.customerCart.reduce((total: any, product: any) => {
    return total + product.price * product.cart_table.quantity;
  }, 0);
}
getShippingPrice() {
  return Math.floor(this.getOrderTotalPrice() * 0.2);
}
getDiscountedAmount() {
  let afterDiscount = 0;
  this.customerCart.forEach((cartItem: any) => {
    if (cartItem.sale) {
      let dicPercent = cartItem.sale / 100;
      afterDiscount +=
        cartItem.price * dicPercent * cartItem.cart_table.quantity;
    }
  });
  return afterDiscount;
}
CreateOrder(paymentType: HTMLButtonElement) {
  const sentBody: any = {
    total:
      this.getOrderTotalPrice() +
      this.getShippingPrice() -
      this.getDiscountedAmount(),
  };
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to Make this Order !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#270949',
    cancelButtonColor: '#f95b3d',
    confirmButtonText: 'Yes, Make it!',
    cancelButtonText: 'No, cancel!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.addOrderSub = this.orderService.createOrder(sentBody).subscribe({
        next: (res: any) => {
          const { id } = res.order;
          this.addProducts(id);
          this.clearCart();
          this.cartService.clearCart();

          if (paymentType.innerText === 'CKECKOUT') {
            this.successOrderCreatedAlert();
            this.customerCart = [];
          } else if (paymentType.innerText.includes('PAYPAL')) {
            this.paypalPayment(id, sentBody.total);
          } else if (paymentType.innerText.includes('CREDIT')) {
            this.payMobPayment(id, sentBody.total);
          }
        },
        error: (error) => {
          console.error('Error making order:', error);
          Swal.fire(
            'Error!',
            'There was an error making the order.',
            'error'
          );
        },
      });
    }
  });
}
addProducts(id: number) {
  const orderProductBody: any = {
    products: {},
  };
  this.customerCart.forEach((product: any) => {
    orderProductBody.products[`${product.id}`] = product.cart_table.quantity;
  });
  this.addProductsToOrderSub = this.orderService
    .addProductToOrder(orderProductBody, id)
    .subscribe((res) => {
      // console.log(res);
    });
}
clearCart() {
  this.cartService.clearCart();
}
successOrderCreatedAlert() {
  Swal.fire({
    title: 'Good job!',
    text: 'Your Order is Made Successfully',
    icon: 'success',
  });
}
paypalPayment(order_id: number, total: number) {
  this.paybalSub = this.paymentService
    .payByPayPal({ total, order_id })
    .subscribe((res) => {
      const paymentUrl = res.paypal_link;
      const windowFeatures = `width=600,height=600,left=${
        window.screenLeft + (window.innerWidth - 600) / 2
      },top=${window.screenTop + (window.innerHeight - 600) / 2}`;
      const paymentWindow = window.open(paymentUrl, '_blank', windowFeatures);
      if (!paymentWindow) {
        // Handle the case where the popup was blocked by the browser
        alert(
          'Payment window was blocked by the browser. Please allow popups and try again.'
        );
      } else {
        this.closePaymentWindow(paymentWindow);
      }
    });
}

payMobPayment(order_id: number, total: number) {
  this.paybalSub = this.paymentService
    .payByPayMob({ order_id, total })
    .subscribe((res) => {
      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/853869?payment_token=${res.token}`;
      const windowFeatures = `width=600,height=600,left=${
        window.screenLeft + (window.innerWidth - 600) / 2
      },top=${window.screenTop + (window.innerHeight - 600) / 2}`;
      const paymentWindow = window.open(paymentUrl, '_blank', windowFeatures);
      if (!paymentWindow) {
        // Handle the case where the popup was blocked by the browser
        alert(
          'Payment window was blocked by the browser. Please allow popups and try again.'
        );
      } else {
        this.closePaymentWindow(paymentWindow);
      }
    });
}

closePaymentWindow(paymentWindow: any) {
  const interval = setInterval(() => {
    if (paymentWindow.closed) {
      clearInterval(interval);
      this.clearCart();
      this.customerCart = [];
    }
  }, 500);
}
}

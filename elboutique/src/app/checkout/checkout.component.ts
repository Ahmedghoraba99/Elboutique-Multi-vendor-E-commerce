import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart.service';
import { WishlistService } from '../service/wishlist.service';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { PaymentService } from '../service/payment.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  faHeart = faHeart;
  faTrashCan = faTrashCan;
  faShoppingBasket = faShoppingBasket;
  customerCart: any[] = [];
  addtoWishlistSub: Subscription | null = null;
  getCartSub: Subscription | null = null;
  updateInCart: Subscription | null = null;
  removeFromCartSub: Subscription | null = null;
  addOrderSub: Subscription | null = null;
  addProductsToOrderSub: Subscription | null = null;
  clearCartSub: Subscription | null = null;
  paybalSub: Subscription | null = null;
  isAuthObservableSub!: Subscription;
  paymentForm: FormGroup;
  isAuthenticated: boolean = false;

  constructor(
    private Toaster: ToastrService,
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.paymentForm = this.fb.group({
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
    });
  }
  ngOnDestroy(): void {
    this.getCartSub?.unsubscribe();
    this.addtoWishlistSub?.unsubscribe();
    this.removeFromCartSub?.unsubscribe();
    this.updateInCart?.unsubscribe();
    this.addOrderSub?.unsubscribe();
    this.addProductsToOrderSub?.unsubscribe();
    this.clearCartSub?.unsubscribe();
    this.paybalSub?.unsubscribe();
    this.isAuthObservableSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.isAuthObservableSub = this.authService
      .isAuthObservable()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
    this.getCartSub = this.cartService.getCustomerCart().subscribe((cart) => {
      if (cart) {
        this.customerCart = cart;
      }
    });
  }
  getOrderTotalPrice() {
    return this.customerCart.reduce((total: any, product: any) => {
      return total + product.price * product.cart_table.quantity;
    }, 0);
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

  getOrderTotalQuantities() {
    return this.customerCart.reduce((total: any, product: any) => {
      return total + product.cart_table.quantity;
    }, 0);
  }
  getstock(stock: number) {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }
  update(product: any, quantity: number) {
    const sentBody = {
      products: {
        [`${product.id}`]: quantity,
      },
    };
    this.customerCart.forEach((toChangeProduct: any) => {
      if (toChangeProduct.name === product.name) {
        toChangeProduct.cart_table.quantity = quantity;
      }
    });
    this.cartService.addItemToCart(sentBody);
  }

  addToast() {
    this.Toaster.success('Product added to Wishlist', 'Added');
  }
  deleteToast() {
    this.Toaster.error('Product Removed From Cart', 'Remove');
  }

  // for services
  addToWishlist(id: number) {
    const sentBody: Object = {
      products: [id],
    };
    this.wishlistService.addItemToWishlist(sentBody);
  }
  DeleteFromCart(sentProduct: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this product from your wishlist !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#270949',
      cancelButtonColor: '#f95b3d',
      confirmButtonText: 'Yes, Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const sentBody = {
          products: sentProduct.id,
        };
        this.removeFromCartSub = this.cartService
          .deleteItemFromCart(sentBody)
          .subscribe(() => {
            this.customerCart = this.customerCart.filter(
              (product: any) => product.id != sentProduct.id
            );
          });
      }
    });
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
  getShippingPrice() {
    return Math.floor(this.getOrderTotalPrice() * 0.2);
  }
}

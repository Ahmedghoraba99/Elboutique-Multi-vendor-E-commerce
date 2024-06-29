import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SummaryOrderComponent } from './summary-order/summary-order.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';
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
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SummaryOrderComponent,
    FontAwesomeModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  faHeart = faHeart;
  faTrashCan = faTrashCan;
  faShoppingBasket = faShoppingBasket;
  customerCart: any = [];
  cartPriceAndQuantity: any = [];
  addtoWishlistSub: Subscription | null = null;
  getCartSub: Subscription | null = null;
  updateInCart: Subscription | null = null;
  removeFromCartSub: Subscription | null = null;
  addOrderSub: Subscription | null = null;
  addProductsToOrderSub: Subscription | null = null;
  clearCartSub: Subscription | null = null;
  paymentForm: FormGroup;

  constructor(
    private Toaster: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private fb: FormBuilder
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
  }
  ngOnInit(): void {
    this.getCartSub = this.cartService.getCustomerCart().subscribe((cart) => {
      this.customerCart = cart;
      this.customerCart.forEach((product: any) => {
        this.cartPriceAndQuantity.push({
          [`${product.name}`]: {
            price: product.price,
            quantity: product.cart_table.quantity,
          },
        });
      });
    });
  }
  getOrderTotalPrice() {
    return this.cartPriceAndQuantity.reduce((total: any, product: any) => {
      const key = Object.keys(product)[0];
      return total + product[key].price * product[key].quantity;
    }, 0);
  }
  getOrderTotalQuantities() {
    return this.cartPriceAndQuantity.reduce((total: any, product: any) => {
      const key = Object.keys(product)[0];
      return total + product[key].quantity;
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
    this.cartPriceAndQuantity.map((toChangeProduct: any) => {
      const key = Object.keys(toChangeProduct)[0];
      if (key === product.name) {
        toChangeProduct[key].quantity = quantity;
      }
    });
    this.updateInCart = this.cartService
      .addToCustomerCart(sentBody)
      .subscribe((res) => {
        console.log(res);
      });
  }

  addToast() {
    this.Toaster.success('Product added to Wishlist', 'Added');
  }
  deleteToast() {
    this.Toaster.error('Product Removed From Cart', 'Remove');
  }

  // for services
  AddToWishlist(id: number) {
    const sentBody: Object = {
      products: [id],
    };
    this.addtoWishlistSub = this.wishlistService
      .addToUserWishlist(sentBody)
      .subscribe((res) => {
        console.log(res);
        this.addToast();
      });
  }
  DeleteFromCart(id: number) {
    const sentBody = {
      products: id,
    };
    this.removeFromCartSub = this.cartService
      .deleteFromCustomerCart(sentBody)
      .subscribe((res) => {
        console.log(res);
        this.customerCart = this.customerCart.filter(
          (product: any) => product.id != id
        );
        this.deleteToast();
      });
  }
  CreateOrder() {
    const sentBody = {
      status: 'midway',
      total: this.getOrderTotalPrice() + this.getOrderTotalPrice() * 0.2,
    };

    this.addOrderSub = this.orderService
      .createOrder(sentBody)
      .subscribe((res) => {
        console.log(res);
        const { id } = res.order;
        this.successOrderCreatedAlert();
        this.addProducts(id);
        this.clearCart();
        this.customerCart = [];
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
        console.log(res);
      });
  }
  clearCart() {
    this.clearCartSub = this.cartService
      .clearCustomerCart()
      .subscribe((res) => {
        console.log(res);
      });
  }
  successOrderCreatedAlert() {
    Swal.fire({
      title: 'Good job!',
      text: 'Your Order is Made Successfully',
      icon: 'success',
    });
  }
}

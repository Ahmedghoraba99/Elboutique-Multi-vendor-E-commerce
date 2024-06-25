import { Component, OnDestroy, OnInit ,Input } from '@angular/core';
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

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, SummaryOrderComponent, FontAwesomeModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  faHeart = faHeart;
  faTrashCan = faTrashCan;
  faShoppingBasket = faShoppingBasket;
  customerCart: any = [];
  addtoWishlistSub: Subscription | null = null;
  getCartSub: Subscription | null = null;
  removeFromCartSub: Subscription | null = null;

  @Input() cartProduct: any;
  totalPrice: number = 0;
  paymentForm: FormGroup;

  constructor(
    private Toaster: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
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
  }
  ngOnInit(): void {
    this.getCartSub = this.cartService.getCustomerCart().subscribe((cart) => {
      this.customerCart = cart;
      
      console.log(cart);
    });
    const productsPrices = this.cartProduct.map(
      (product: any) => product.price
    );
    const totalPrice = productsPrices.reduce(
      (accumelator: number, current: number) => {
        return accumelator + current;
      },
      0
    );
  
    this.totalPrice = totalPrice;
    

  }

  getstock(stock : number ){
    return Array.from({ length: stock }, (_, i) => i + 1);
  }
  // make the update
  update(product:any){}
  // 
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




  
}

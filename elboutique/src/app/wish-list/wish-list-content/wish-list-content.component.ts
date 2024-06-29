import { Component, OnDestroy, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../service/wishlist.service';
import { ToastrService } from 'ngx-toastr';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-wish-list-content',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, RouterLink],
  templateUrl: './wish-list-content.component.html',
  styleUrl: './wish-list-content.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WishListContentComponent implements OnInit, OnDestroy {
  faHeartBroken = faHeartBroken;
  faShoppingBasket = faShoppingBasket;
  getWishlistSub: Subscription | null = null;
  deleteFromWishlistSub: Subscription | null = null;
  userWishlist: any = [];
  userCartId: any[] = [];
  // userCart: any = [];

  userCart: any = [];

  isAuthenticated = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toaster: ToastrService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.getWishlistSub?.unsubscribe();
    this.deleteFromWishlistSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.authService.isAuthObservable().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
    this.getWishlistSub = this.wishlistService
      .getUserWishlist()
      .subscribe((wishlist) => {
        this.userWishlist = wishlist;
        console.log(this.userWishlist);
      });

    this.cartService.getCartData().subscribe((cart) => {
      cart.forEach((element: { id: any }) => {
        this.userCartId.push(element.id);
      });
    });
  }
  removeProductFromWishlist(id: number) {
    const sentbody: Object = {
      products: id,
    };

    this.wishlistService.deleteItemFromWishlist(sentbody);
    this.toaster.error('Product Removed From Wishlist', 'Remove');
    this.userWishlist = this.userWishlist.filter(
      (product: any) => product.id != id
    );
  }

  addProductToCart(e: HTMLButtonElement, id: number) {
    const sentbody: Object = {
      products: {
        [id.toString()]: 1,
      },
    };

    this.cartService.addItemToCart(sentbody);
    this.toaster.success('Product Added To Cart', 'Add');
    // Change button text
    e.textContent = 'Remove from cart';
  }

  removeProductFromCart(e: HTMLButtonElement, id: number) {
    const sentbody: Object = {
      products: id,
    };
    this.cartService.deleteItemFromCart(sentbody);
    this.toaster.error('Product Removed From Cart', 'Remove');
    // Change button text
    e.textContent = 'Add to cart';
  }

  addToCartToggler(e: HTMLButtonElement, id: number) {
    if (!this.userCartId.includes(id)) {
      this.addProductToCart(e, id);
    } else {
      this.removeProductFromCart(e, id);
    }
  }
}

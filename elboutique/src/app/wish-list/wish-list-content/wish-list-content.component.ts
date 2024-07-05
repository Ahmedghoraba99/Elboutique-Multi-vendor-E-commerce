import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../service/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHeartBroken,
  faShoppingBasket,
  faTrashCan,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wish-list-content',
  templateUrl: './wish-list-content.component.html',
  styleUrls: ['./wish-list-content.component.css'],
})
export class WishListContentComponent implements OnInit, OnDestroy {
  faHeartBroken = faHeartBroken;
  faShoppingBasket = faShoppingBasket;
  faHeart = faHeart;
  faTrashCan = faTrashCan;

  getWishlistSub: Subscription | null = null;
  deleteFromWishlistSub: Subscription | null = null;
  wishlistSubSub: Subscription[] = [];
  userWishlist: any = [];
  userCartId: any[] = [];
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
    this.wishlistSubSub.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    const authSub = this.authService.isAuthObservable().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
    this.wishlistSubSub.push(authSub);
    this.getWishlistSub = this.wishlistService
      .getUserWishlist()
      .subscribe((wishlist) => {
        this.userWishlist = wishlist;
      });
    if (this.isAuthenticated) {
      const cartSub = this.cartService.getCartData().subscribe((cart) => {
        if (cart) {
          cart.forEach((element: { id: any }) => {
            this.userCartId.push(element.id);
          });
        }
      });
      this.wishlistSubSub.push(cartSub);
    }
  }

  removeProductFromWishlist(id: number) {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Do you really want to delete this product from your wishlist ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#270949',
      cancelButtonColor: '#f95b3d',
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const sentbody: Object = {
          products: id,
        };

        this.wishlistService.deleteItemFromWishlist(sentbody);
        this.toaster.error('Product Removed From Wishlist', 'Remove');
        this.userWishlist = this.userWishlist.filter(
          (product: any) => product.id != id
        );
      }
    });
  }

  addProductToCart(e: HTMLButtonElement, id: number) {
    const sentbody: Object = {
      products: {
        [id.toString()]: 1,
      },
    };

    this.cartService.addItemToCart(sentbody);
    this.toaster.success('Product Added To Cart', 'Add');
    e.textContent = 'Remove from cart';
  }

  removeProductFromCart(e: HTMLButtonElement, id: number) {
    const sentbody: Object = {
      products: id,
    };
    this.cartService.deleteItemFromCart(sentbody);
    this.toaster.error('Product Removed From Cart', 'Remove');
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

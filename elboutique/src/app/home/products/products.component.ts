import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsComponent implements OnDestroy, OnInit {
  private productsSubscriptions: Subscription[] = [];
  homeService: HomeService = inject(HomeService);

  products: any[] = [];
  userWishlist: any[] = [];
  userCart: any[] = [];

  isAuthenticated = false;

  ngOnInit(): void {
    const isAuthenticatedSubscrip = this.authService
      .isAuthObservable()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
    this.productsSubscriptions.push(isAuthenticatedSubscrip);

    const getFeaturedProductsSubscrip = this.homeService
      .getFeaturedProducts()
      .subscribe((data) => {
        this.products = data;
      });
    this.productsSubscriptions.push(getFeaturedProductsSubscrip);

    const getWishlistDataSubscrip = this.wishlisteService
      .getWishlistData()
      .subscribe((data) => {
        if (data) {
          data.forEach((item: { id: any }) => {
            this.userWishlist.push(item?.id);
          });
        }
      });
    this.productsSubscriptions.push(getWishlistDataSubscrip);
    const getCartDataSubscrip = this.cartService
      .getCartData()
      .subscribe((data) => {
        if (data) {
          data.forEach((item: { id: any }) => {
            this.userCart.push(item?.id);
          });
        }
      });
    this.productsSubscriptions.push(getCartDataSubscrip);
  }
  constructor(
    private toast: ToastrService,
    private cartService: CartService,
    private wishlisteService: WishlistService,
    private authService: AuthService
  ) {}

  toggleCart(event: Event, id: number): void {
    if (!this.isAuthenticated) {
      this.toast.warning('Please login first', 'Not Authenticated');
      return;
    }
    if ((event.target as HTMLInputElement).checked) {
      this.addToCart(id);
    } else {
      this.removeFromCart(id);
    }
  }

  toggleWishList(event: Event, id: number): void {
    if (!this.isAuthenticated) {
      this.toast.warning('Please login first', 'Not Authenticated');
      return;
    }
    if ((event.target as HTMLInputElement).checked) {
      this.addToWishlist(id);
    } else {
      this.removeFromWishlist(id);
    }
  }

  isInWishlist(id: number): boolean {
    return this.userWishlist.includes(id);
  }

  isInCart(id: number): boolean {
    return this.userCart.includes(id);
  }

  private addToCart(id: number): void {
    this.cartService.addItemToCart({
      products: {
        [id.toString()]: 1,
      },
    });
    this.toast.success('Product added to cart', 'Added');
  }

  private removeFromCart(id: number): void {
    this.cartService.deleteItemFromCart({
      products: id,
    });
    this.toast.error('Product removed from cart', 'Removed');
  }

  private addToWishlist(id: number): void {
    this.wishlisteService.addItemToWishlist({
      products: [id],
    });
    this.toast.success('Product added to wishlist', 'Added');
  }

  private removeFromWishlist(id: number): void {
    this.wishlisteService.deleteItemFromWishlist({
      products: id,
    });
    this.toast.error('Product removed from wishlist', 'Removed');
  }
  ngOnDestroy(): void {
    this.productsSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}

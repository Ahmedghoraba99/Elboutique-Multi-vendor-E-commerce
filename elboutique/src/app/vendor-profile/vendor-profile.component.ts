import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { VendorPortofolioService } from '../service/vendor-portofolio.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { WishlistService } from '../service/wishlist.service';
import { CartService } from '../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-profile',
  // imports: [ CommonModule, FontAwesomeModule, RouterLink, NgIf, NgFor],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css',
})
export class VendorProfileComponent implements OnInit, OnDestroy {
  productGroups: any[] = [];
  vendor: any = {};
  userWishlist: any[] = [];
  userCart: any[] = [];
  isAuthenticated = false;
  private subscriptions: Subscription[] = [];

  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  constructor(
    private vendorPortofolio: VendorPortofolioService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        // Clear the productGroups array before fetching new data
        this.productGroups = [];
        this.vendorPortofolio
          .getVendorProducts(params['id'])
          .subscribe((data: any) => {
            this.productGroups.push(data.data);
            if (data.data) {
              this.vendor = this.productGroups[0][0].vendor;
            }
          });
      })
    );

    this.subscriptions.push(
      this.wishlistService.getWishlistData().subscribe((data) => {
        this.userWishlist = [];
        data?.forEach((item: { id: any }) => {
          this.userWishlist.push(item.id);
        });
      })
    );

    this.subscriptions.push(
      this.cartService.getCartData().subscribe((data) => {
        this.userCart = [];
        data.forEach((item: { id: any }) => {
          this.userCart.push(item.id);
        });
      })
    );

    this.subscriptions.push(
      this.authService.isAuthObservable().subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      })
    );
  }

  ngOnDestroy(): void {
    this.userCart = [];
    this.userWishlist = [];
    this.productGroups = [];
    this.vendor = [];
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleCart(event: Event, id: number): void {
    if (!this.isAuthenticated) {
      this.toaster.warning('Please login first', 'Not Authenticated');
      return;
    } else {
      if ((event.target as HTMLInputElement).checked) {
        this.addToCart(id);
      } else {
        this.removeFromCart(id);
      }
    }
  }

  toggleWishList(event: Event, id: number): void {
    if (!this.isAuthenticated) {
      this.toaster.warning('Please login first', 'Not Authenticated');
      return;
    } else {
      if ((event.target as HTMLInputElement).checked) {
        this.addToWishlist(id);
      } else {
        this.removeFromWishlist(id);
      }
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
    this.wishlistService.addItemToWishlist({
      products: [id],
    });
    this.toast.success('Product added to wishlist', 'Added');
  }

  private removeFromWishlist(id: number): void {
    this.wishlistService.deleteItemFromWishlist({
      products: id,
    });
    this.toast.error('Product removed from wishlist', 'Removed');
  }
}

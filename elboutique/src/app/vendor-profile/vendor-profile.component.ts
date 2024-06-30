import { Component } from '@angular/core';
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
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, NgIf, NgFor],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorProfileComponent {
  productGroups: any = [];
  vendor: any = {};
  userWishlist: any[] = [];
  userCart: any[] = [];

  constructor(
    private vendorPortofolio: VendorPortofolioService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlisteService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.vendorPortofolio
        .getVendorProducts(params['id'])
        .subscribe((data: any) => {
          this.productGroups.push(data.data);
          if (data.data) {
            this.vendor = this.productGroups[0][0].vendor;
          }
        });
    });
    this.wishlisteService.getWishlistData().subscribe((data) => {
      data.forEach((item: { id: any }) => {
        this.userWishlist.push(item.id);
      });
    });
    this.cartService.getCartData().subscribe((data) => {
      data.forEach((item: { id: any }) => {
        this.userCart.push(item.id);
      });
    });
  }
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  toggleCart(event: Event, id: number): void {
    if ((event.target as HTMLInputElement).checked) {
      this.addToCart(id);
    } else {
      this.removeFromCart(id);
    }
  }

  toggleWishList(event: Event, id: number): void {
    if ((event.target as HTMLInputElement).checked) {
      this.addToWishlist(id);
    } else {
      this.removeFromWishlist(id);
    }
  }

  isInWishlist(id: number): boolean {
    // console.log("**************");
    // console.log(this.userWishlist.includes(id));

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
}

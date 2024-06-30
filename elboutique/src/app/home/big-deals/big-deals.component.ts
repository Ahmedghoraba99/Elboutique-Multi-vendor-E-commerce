import { Component, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-big-deals',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './big-deals.component.html',
  styleUrl: './big-deals.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BigDealsComponent {
  homeService: HomeService = inject(HomeService);

  products: any[] = [];
  userWishlist: any[] = [];
  userCart: any[] = [];

  ngOnInit(): void {
    this.homeService.getOnSaleProducts().subscribe((data) => {
      this.products = data;
    });
    this.wishlisteService.getWishlistData().subscribe((data) => {
      // console.log('Data from wishlist: ', data);
      data.forEach((item: { id: any }) => {
        this.userWishlist.push(item.id);
      });
    });
    this.cartService.getCartData().subscribe((data) => {
      // console.log('Data from cart: ', data);
      data.forEach((item: { id: any }) => {
        this.userCart.push(item.id);
        // console.log(this.userCart);
      });
    });
  }

  constructor( private toast: ToastrService,
    private cartService: CartService,
    private wishlisteService: WishlistService) {}

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

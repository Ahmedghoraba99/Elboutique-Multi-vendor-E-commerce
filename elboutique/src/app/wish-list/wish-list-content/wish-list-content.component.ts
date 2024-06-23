import { Component, OnDestroy, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../service/wishlist.service';

@Component({
  selector: 'app-wish-list-content',
  standalone: true,
  imports: [],
  templateUrl: './wish-list-content.component.html',
  styleUrl: './wish-list-content.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WishListContentComponent implements OnInit, OnDestroy {
  getWishlistSub: Subscription | null = null;
  deleteFromWishlistSub: Subscription | null = null;
  userWishlist: any = [];
  constructor(private wishlistService: WishlistService) {}
  ngOnDestroy(): void {
    this.getWishlistSub?.unsubscribe();
    this.deleteFromWishlistSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.getWishlistSub = this.wishlistService
      .getUserWishlist()
      .subscribe((wishlist) => {
        this.userWishlist = wishlist;
        console.log(this.userWishlist);
      });
  }
  removeProductFromWishlist(id: number) {
    const sentbody: Object = {
      products: id,
    };
    this.deleteFromWishlistSub = this.wishlistService
      .deleteFromUserWishlist(sentbody)
      .subscribe((res) => {
        console.log(res);
        this.userWishlist = this.userWishlist.filter(
          (product: any) => product.id != id
        );
      });
  }
}

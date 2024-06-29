import { Component, OnDestroy, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../service/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-wish-list-content',
  standalone: true,
  imports: [FontAwesomeModule , RouterLink],
  templateUrl: './wish-list-content.component.html',
  styleUrl: './wish-list-content.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WishListContentComponent implements OnInit, OnDestroy {
  faHeartBroken=faHeartBroken;
  faShoppingBasket=faShoppingBasket;
  faTrashCan=faTrashCan;
  faHeart=faHeart;
  getWishlistSub: Subscription | null = null;
  deleteFromWishlistSub: Subscription | null = null;
  userWishlist: any = [];
  constructor(
    private wishlistService: WishlistService,
    private toaster: ToastrService
  ) {}
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
  // removeProductFromWishlist(id: number) {
  //   const sentbody: Object = {
  //     products: id,
  //   };
  //   this.deleteFromWishlistSub = this.wishlistService
  //     .deleteFromUserWishlist(sentbody)
  //     .subscribe((res) => {
  //       console.log(res);
  //       this.userWishlist = this.userWishlist.filter(
  //         (product: any) => product.id != id
  //       );
  //       this.toaster.error('Product Removed From Wishlist', 'Remove');
  //     });
  // }


  removeProductFromWishlist(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this product from your wishlist!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
      
    }).then((result) => {
      if (result.isConfirmed) {
        const sentbody: Object = {
          products: id,
        };
        this.deleteFromWishlistSub = this.wishlistService
          .deleteFromUserWishlist(sentbody)
          .subscribe((res) => {
            this.userWishlist = this.userWishlist.filter(
              (product: any) => product.id != id
            );
            this.toaster.error('Product Removed From Wishlist', 'Remove');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your product is safe :)',
          'error'
        );
      }
    });
  }
  AddToCart(product_id :number){

  }
}

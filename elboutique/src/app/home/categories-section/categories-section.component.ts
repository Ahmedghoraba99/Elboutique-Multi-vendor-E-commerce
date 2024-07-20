import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [FontAwesomeModule, NgFor, NgIf, RouterLink, CommonModule],
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesSectionComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  products: any[] = [];
  productId: number = 0;
  userWishlist: any[] = [];
  userCart: any[] = [];
  categories: number[] = [1, 2, 3];
  isAuthenticated = false;
  categoryNames: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toaster: ToastrService
  ) {}

  faHeart = faHeart;

  ngOnInit(): void {
    this.subscriptions.push(
      this.wishlistService.getWishlistData().subscribe((data) => {
        if (data) {
          this.userWishlist = data.map((item: { id: any }) => item.id);
        }
      })
    );

    this.subscriptions.push(
      this.authService.isAuthObservable().subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      })
    );
    this.categories.forEach(categoryid=>{
      const sub = this.homeService.getProductsInCategory(categoryid).subscribe(data=>{
        console.log("data")
        console.log(this.products);
        const categoryName = data.data[0]?.category?.name; 

        if (categoryName && !this.categoryNames.includes(categoryName)) {
          this.categoryNames.push(categoryName); 
        }
        
      this.products = data.data;

      });

    } )
  }

  ngOnDestroy(): void {
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

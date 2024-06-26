import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-similarproduct',
  standalone: true,
  imports: [FontAwesomeModule, NgFor, NgIf, RouterLink, CommonModule],
  templateUrl: './similarproduct.component.html',
  styleUrl: './similarproduct.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SimilarproductComponent implements OnInit, OnDestroy {
  similarProductSubscriptions: Subscription[] = [];
  homeService: HomeService = inject(HomeService);

  products: any[] = [];
  productId: number = 0;
  categoryId: number = 0;
  userWishlist: any[] = [];
  userCart: any[] = [];

  isAuthenticated = false;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.productId = +params['id'];
          return this.productService.getProduct(this.productId);
        }),
        switchMap((product) => {
          this.categoryId = product.category_id;
          return this.homeService.getProductsInCategory(this.categoryId);
        })
      )
      .subscribe((product) => {
        this.products = product.data;
        this;
      });

    const getWishlistDataSubscription = this.wishlisteService
      .getWishlistData()
      .subscribe((data) => {
        if (data) {
          data.forEach((item: { id: any }) => {
            this.userWishlist.push(item.id);
          });
        }
      });
    this.similarProductSubscriptions.push(getWishlistDataSubscription);
    const getCartDataSubscription = this.cartService
      .getCartData()
      .subscribe((data) => {
        if (data) {
          data.forEach((item: { id: any }) => {
            this.userCart.push(item.id);
          });
        }
      });
    this.similarProductSubscriptions.push(getCartDataSubscription);
    const isAuthObservableSubscription = this.authService
      .isAuthObservable()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
    this.similarProductSubscriptions.push(isAuthObservableSubscription);
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductDetailsService,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlisteService: WishlistService,
    private authService: AuthService,
    private toaster: ToastrService
  ) {}

  faHeart = faHeart;

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
    this.similarProductSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
}

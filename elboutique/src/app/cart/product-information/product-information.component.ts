import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ProductSliderComponent } from '../product-slider/product-slider.component';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../service/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../service/cart.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-product-information',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ProductSliderComponent,
    NgIf,
    NgClass,
    NgFor,
    RouterLink,
  ],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css',
})
export class ProductInformationComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductDetailsService,
    private wishlistService: WishlistService,
    private toaster: ToastrService,
    private cartService: CartService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.productInformationSubscriptions.forEach((sub) => sub.unsubscribe());
  }
  faCircleCheck = faCircleCheck;
  product: any = {};
  productInformationSubscriptions: Subscription[] = [];

  currentWishlist: number[] = [];
  isAuthenticated = false;

  id: number = 0;
  ngOnInit(): void {
    const isAuthObservableSubscription = this.authService
      .isAuthObservable()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
    this.productInformationSubscriptions.push(isAuthObservableSubscription);
    const idSubscription = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      const getProductSubscription = this.productService
        .getProduct(this.id)
        .subscribe((product) => {
          this.product = product;
        });
      this.productInformationSubscriptions.push(getProductSubscription);
    });
    this.productInformationSubscriptions.push(idSubscription);

    const getWishlistDataSubscription = this.wishlistService
      .getWishlistData()
      .subscribe((res: any) => {
        console.log('this is wishlist data :', res);
        res?.forEach((element: any) => {
          this.currentWishlist.push(element.id);
        });
      });
    this.productInformationSubscriptions.push(getWishlistDataSubscription);
  }

  getStock(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  addToCart(select: HTMLSelectElement) {
    if (!this.isAuthenticated) {
      this.toaster.warning('Please login first', 'Not Authenticated');
      return;
    } else {
      const selectedValue = String(select.value);
      const sentBody = {
        products: {
          [`${this.product.id}`]: selectedValue,
        },
      };
      this.cartService.addItemToCart(sentBody);
      this.toaster.success('Product Added To Cart', 'success');
    }
    // console.log(typeof selectedValue);
    // console.log('this is sentbody :');
    // console.log(sentBody);

    // this.addToCartSub = this.cartService
    //   .addToCustomerCart(sentBody)
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.toaster.success('Product Added To Cart', 'success');
    //   });
  }

  addToWishlist(div: HTMLDivElement) {
    if (!this.isAuthenticated) {
      this.toaster.warning('Please login first', 'Not Authenticated');
      return;
    } else {
      const sentBody: Object = {
        products: [this.product.id],
      };
      if (this.currentWishlist.includes(this.product.id)) {
        this.wishlistService.deleteItemFromWishlist({
          products: this.product.id,
        });
        this.toaster.error('Product removed from Wishlist', 'Error');
        div.innerHTML = `<i class="fa-regular fa-heart fs-6 text-danger"></i>`;
        this.currentWishlist = this.currentWishlist.filter(
          (item) => item !== this.product.id
        );
      } else {
        this.wishlistService.addItemToWishlist(sentBody);
        this.toaster.success('Product added to Wishlist', 'Added');
        this.currentWishlist.push(this.product.id);
        div.innerHTML = `<i class="fa-solid fa-heart fs-6 "></i>`;
      }
    }
  }
}

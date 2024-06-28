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
    private cartService: CartService
  ) {}
  ngOnDestroy(): void {
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
  }
  faCircleCheck = faCircleCheck;
  product: any = {};
  addToWishlistSub: Subscription | null = null;
  addToCartSub: Subscription | null = null;
  id: number = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.productService.getProduct(this.id).subscribe((product) => {
        this.product = product;
      });
    });
  }

  getStock(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  addToCart(select: HTMLSelectElement) {
    const selectedValue = String(select.value);
    console.log(typeof selectedValue);
    const sentBody = {
      products: {
        [`${this.product.id}`]: selectedValue,
      },
    };
    console.log('this is sentbody :');
    console.log(sentBody);

    this.addToCartSub = this.cartService
      .addToCustomerCart(sentBody)
      .subscribe((res) => {
        console.log(res);
        this.toaster.success('Product Added To Cart', 'success');
      });
  }

  addToWishlist(div: HTMLDivElement) {
    const sentBody: Object = {
      products: [this.product.id],
    };
    this.addToWishlistSub = this.wishlistService
      .addToUserWishlist(sentBody)
      .subscribe((res) => {
        console.log(res);
        div.innerHTML = `<i class="fa-solid fa-heart fs-6 text-danger"></i>`;
        this.toaster.success('Product added to Wishlist', 'Added');
      });
  }
}

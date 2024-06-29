import { Component, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-similarproduct',
  standalone: true,
  imports: [FontAwesomeModule, NgFor, NgIf, RouterLink, CommonModule],
  templateUrl: './similarproduct.component.html',
  styleUrl: './similarproduct.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SimilarproductComponent {
  homeService: HomeService = inject(HomeService);

  products: any[] = [];
  productId: number = 0;
  categoryId: number = 0;

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
        // console.log('The product from subscription', product.data);
        this.products = product.data;
        this;
      });
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductDetailsService
  ) {}
  faHeart = faHeart;
}

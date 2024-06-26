import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCategoryService } from '../service/product-category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryComponent implements OnInit {
  faChevronRight = faChevronRight;
  productsPerPage = 10;
  products: any[] = [];
  productsGroup: any[][] = [];
  orderByValue = '';
  orderByPriceValue = '';
  navLinks: any[] = [];
  thereIsNextPage = false;
  currentPage = 1;
  title = '';
  id: string | null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductCategoryService,
    private toast: ToastrService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      const name = queryParams.get('name');
      if (name) {
        const paramObject = { name };
        if (this.id != 'all') {
          this.categoryService
            .searchForProducts(paramObject)
            .subscribe((data) => {
              this.resetProducts();
              this.setPageParameters(data);
            });
        }
      } else {
        this.handleCategoryLoading();
      }
    });
  }

  private handleCategoryLoading(): void {
    if (this.id === 'all') {
      this.categoryService.getAllProductsInAll().subscribe((data) => {
        this.setPageParameters(data);
        this.title = 'All Products';
      });
    } else if (parseInt(this.id as string)) {
      this.categoryService
        .productsPerCategory(parseInt(this.id as string))
        .subscribe((data) => {
          this.title = data.data[0]?.category?.name || 'Whoops!';
          this.setPageParameters(data);
        });
    } else {
      this.toast.error('Invalid category ID', 'Error');
    }
  }

  private resetProducts(): void {
    this.productsGroup = [];
  }

  loadMore(): void {
    if (this.id === 'all') {
      this.loadMoreProducts(
        this.categoryService.loadMoreProductsAll.bind(this.categoryService)
      );
    } else if (parseInt(this.id as string)) {
      this.loadMoreProducts(
        this.categoryService.loadMoreProductsPerCategory.bind(
          this.categoryService,
          parseInt(this.id as string)
        )
      );
    }
  }

  private loadMoreProducts(loadMoreFn: (page: number) => any): void {
    loadMoreFn(this.currentPage + 1).subscribe((data: any) => {
      this.productsGroup.push(data.data);
      this.updatePagination(data);
    });
  }

  private updatePagination(data: any): void {
    this.products = data.data;
    this.navLinks = data.links;
    this.currentPage++;
    this.thereIsNextPage = this.currentPage < data.last_page;
  }

  toggleCart(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }

  toggleWishList(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      this.addToWishlist();
    } else {
      this.removeFromWishlist();
    }
  }

  private addToCart(): void {
    this.toast.success('Product added to cart', 'Added');
  }

  private removeFromCart(): void {
    this.toast.error('Product removed from cart', 'Removed');
  }

  private addToWishlist(): void {
    this.toast.success('Product added to wishlist', 'Added');
  }

  private removeFromWishlist(): void {
    this.toast.error('Product removed from wishlist', 'Removed');
  }

  private setPageParameters(data: any): void {
    this.products = data.data;
    this.productsGroup.push(this.products);
    this.navLinks = data.links;
    if (this.id !== 'all') {
      this.title = data.data[0]?.category?.name || 'Whoops!';
    }
    this.thereIsNextPage = this.currentPage < data.last_page;
  }

  orderBy(event: string): void {
    this.productsGroup.forEach((productsArray) => {
      if (event === 'recent') {
        productsArray.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (event === 'sale') {
        productsArray.sort((a, b) => b.sale - a.sale);
      }
    });
  }

  orderByPrice(event: string): void {
    this.productsGroup.forEach((productsArray) => {
      if (event === 'highToLow') {
        productsArray.sort((a, b) => b.price - a.price);
      } else {
        productsArray.sort((a, b) => a.price - b.price);
      }
    });
  }
}

import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCategoryService } from '../service/product-category.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryComponent {
  faChevronRight = faChevronRight;
  productsPerPage: number = 10;
  products: any = [];
  productsGroup: any[] = [];
  orderByValue = '';
  orderByPriceValue = '';
  navLinks = [];
  thereIsNextPage: boolean = false;
  currentPage: number = 1;
  title = '';
  id = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductCategoryService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      if (queryParams) {
        let name = queryParams.get('name');
        let paramObject = {
          name: name,
        };
        if (this.id !== 'all') {
          this.categoryService
            .searchForProducts(paramObject)
            .subscribe((data) => {
              this.productsGroup = [];
              this.setPageParameters(data);
            });
        }
      } else {
        if (this.id === 'all') {
          this.categoryService.getAllProductsInAll().subscribe((data) => {
            this.setPageParameters(data);
          });
          this.title = 'All Products';
        } else if (parseInt(this.id as string)) {
          this.categoryService
            .productsPerCategory(parseInt(this.id as string))
            .subscribe((data) => {
              this.title = data.data[0].category.name;
              this.setPageParameters(data);
            });
        }
      }
    });
  }

  loadMore() {
    if (this.id === 'all') {
      this.categoryService
        .loadMoreProductsAll(this.currentPage + 1)
        .subscribe((data) => {
          // add products to data
          // this.products.push(...data.data);
          this.productsGroup.push(data.data);
          console.log('Groups: ', this.productsGroup);

          // update pagination
          this.products.links = data.links;
          this.currentPage++;
          this.thereIsNextPage = this.currentPage < this.products.last_page;
        });
    } else if (parseInt(this.id as string)) {
      this.categoryService
        .loadMoreProductsPerCategory(
          parseInt(this.id as string),
          this.currentPage + 1
        )
        .subscribe((data) => {
          // add products to data
          this.productsGroup.push(data.data);
          console.log('Groups: ', this.productsGroup);

          // update pagination
          this.products.links = data.links;
          this.currentPage++;
          this.thereIsNextPage = this.currentPage < this.products.last_page;
        });
    }
  }

  toggleCart(event: any) {
    if (event.target.checked) {
      this.Addtocart();
    } else {
      this.RemoveFromCart();
    }
  }

  toggleWishList(event: any) {
    if (event.target.checked) {
      this.AddtoWishlist();
    } else {
      this.RemoveFromWishlist();
    }
  }

  // cart
  Addtocart() {
    this.toast.success('Product added to cart ', 'Added ');
  }

  RemoveFromCart() {
    this.toast.error('Product Removed', 'Removed');
  }

  // wishlist
  AddtoWishlist() {
    this.toast.success('Product added to WishList ', 'Added ');
  }

  RemoveFromWishlist() {
    this.toast.error('Product Removed', 'Removed');
  }

  private setPageParameters(data: any) {
    this.products = data.data;
    this.productsGroup.push(this.products);
    this.navLinks = data.links;
    if (this.id != 'all') this.title = data.data[0].category.name;
    if (this.currentPage < data.last_page) this.thereIsNextPage = true;
  }

  orderBy(event: Event) {
    if (event.toString() == 'recent') {
      this.productsGroup.forEach((productsArray) => {
        // Sort each array of products by created_at in descending order
        productsArray.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } else if (event.toString() == 'sale') {
      this.productsGroup.forEach((productsArray) => {
        productsArray.sort(
          (a: { sale: number }, b: { sale: number }) => b.sale - a.sale
        );
      });
    }
  }

  orderByPrice(event: Event) {
    if (event.toString() == 'highToLow')
      this.productsGroup.forEach((productsArray) => {
        productsArray.sort(
          (a: { price: number }, b: { price: number }) => b.price - a.price
        );
      });
    else
      this.productsGroup.forEach((productsArray) => {
        productsArray.sort(
          (a: { price: number }, b: { price: number }) => a.price - b.price
        );
      });
  }
}

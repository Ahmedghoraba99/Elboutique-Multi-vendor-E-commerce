import { Component, OnDestroy, OnInit } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ProductCategoryService } from '../service/product-category.service';
import { WishlistService } from '../service/wishlist.service';
import { CartService } from '../service/cart.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../service/home.service';
import { VendorService } from '../service/admin/vendor.service';
import { TagesService } from '../service/tages.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private categoriySubscriptions: Subscription[] = [];
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
  userWishlist: any[] = [];
  userCart: any[] = [];
  sub: Subscription | null = null;
  categories: any[] = [];
  vendors: any[] = [];
  tags: any[] = [];
  isAuthenticated = false;
  filters: any = {};
  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductCategoryService,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toaster: ToastrService,
    private HomeService: HomeService,
    private VendorService: VendorService,
    private TagesService: TagesService,
    private fb: FormBuilder
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe;
    this.categoriySubscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngOnInit(): void {
    const queryParamMapSubscribe = this.route.queryParamMap.subscribe(
      (queryParams) => {
        const name = queryParams.get('name');
        if (name) {
          const paramObject = { name };
          if (this.id != 'all') {
            const searchForProductSubscribe = this.categoryService
              .searchForProducts(paramObject)
              .subscribe((data) => {
                this.resetProducts();
                this.setPageParameters(data);
              });
            this.categoriySubscriptions.push(searchForProductSubscribe);
          }
        } else {
          this.handleCategoryLoading();
        }
      }
    );
    const getWishlistDataSubscribe = this.wishlistService
      .getWishlistData()
      .subscribe((data) => {
        data.forEach((item: { id: any }) => {
          this.userWishlist.push(item.id);
        });
      });
    this.categoriySubscriptions.push(getWishlistDataSubscribe);
    const getCartDataSubscribe = this.cartService
      .getCartData()
      .subscribe((data) => {
        data.forEach((item: { id: any }) => {
          this.userCart.push(item.id);
        });
      });
    this.categoriySubscriptions.push(getCartDataSubscribe);
    const getAllCategoriesSubscribe =
      this.HomeService.getAllCategories().subscribe((res) => {
        this.categories = res.data;
      });
    this.categoriySubscriptions.push(getAllCategoriesSubscribe);

    const getAllTagsSubscribe = this.TagesService.getAllTags().subscribe(
      (res) => {
        this.tags = res.data;
      }
    );
    this.categoriySubscriptions.push(
      this.authService.isAuthObservable().subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      })
    );
    this.categoriySubscriptions.push(getAllTagsSubscribe);
    this.categoriySubscriptions.push(queryParamMapSubscribe);
  }

  // serch for products
  applyFilters(): void {
    this.filters.cats = this.categories
      .filter((cat) => cat.selected)
      .map((cat) => cat.id)
      .join(',');
    if (this.filters.cats === '') delete this.filters.cats;
    this.filters.tags = this.tags
      .filter((tag) => tag.selected)
      .map((tag) => tag.name);
    this.filters.max_price;
    this.filters.min_price;
    if (this.filters.max_price === null || this.filters.min_price === null) {
      delete this.filters.max_price;
      delete this.filters.min_price;
    }
    this.filters.vendors = this.vendors
      .filter((vendor) => vendor.selected)
      .map((vendor) => vendor.id)
      .join(',');
    if (this.filters.vendors === '') delete this.filters.vendors;
    this.searchProducts();
  }

  preventNegativeValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = '0';
    }
  }
  getVendors(): void {
    const uniqueVendors = new Map<number, any>();
    this.products.forEach((product) => {
      if (product.vendor && !uniqueVendors.has(product.vendor.id)) {
        uniqueVendors.set(product.vendor.id, product.vendor);
      }
    });
    this.vendors = Array.from(uniqueVendors.values());
    // console.log(this.products);
    // console.log(this.vendors);
  }

  private searchProducts(): void {
    // console.log(this.filters);

    this.categoryService.searchForProducts(this.filters).subscribe((data) => {
      this.resetProducts();
      this.setPageParameters(data);
    });
  }

  private handleCategoryLoading(): void {
    if (this.id === 'all') {
      const getAllProductsInAllSubscribe = this.categoryService
        .getAllProductsInAll()
        .subscribe((data) => {
          this.setPageParameters(data);
          this.title = 'All Products';
          console.log(data);
          this.getVendors();
        });
      this.categoriySubscriptions.push(getAllProductsInAllSubscribe);
    } else if (parseInt(this.id as string)) {
      const productsPerCategorySubscribe = this.categoryService
        .productsPerCategory(parseInt(this.id as string))
        .subscribe((data) => {
          this.title = data.data[0]?.category?.name || 'Whoops!';
          this.setPageParameters(data);
        });
      this.categoriySubscriptions.push(productsPerCategorySubscribe);
    } else {
      this.toast.error('Invalid category ID', 'Error');
    }
  }

  private resetProducts(): void {
    this.productsGroup = [];
    this.products = [];
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
    const updatePaginationSubscribe = loadMoreFn(
      this.currentPage + 1
    ).subscribe((data: any) => {
      this.productsGroup.push(data.data);
      this.updatePagination(data);
    });
    this.categoriySubscriptions.push(updatePaginationSubscribe);
  }

  private updatePagination(data: any): void {
    this.products.push(...data.data);
    this.navLinks = data.links;
    this.currentPage++;
    this.thereIsNextPage = this.currentPage < data.last_page;
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
    if (event === 'recent') {
      this.products.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (event === 'sale') {
      this.products.sort((a, b) => b.sale - a.sale);
    }
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

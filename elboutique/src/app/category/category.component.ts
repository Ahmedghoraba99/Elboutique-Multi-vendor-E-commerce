import { Component, OnDestroy, OnInit } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
export class CategoryComponent implements OnInit , OnDestroy {
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
  // 
  sub:Subscription |null = null ;
  categories :any [] = []  ;
  vendors :any [] = [];
  tags: any [] = [] ;
// 
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductCategoryService,
    private toast: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toaster: ToastrService,
    private HomeService :HomeService ,
    private VendorService:VendorService ,
    private TagesService:TagesService

  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe;
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
    this.wishlistService.getWishlistData().subscribe((data) => {
      data.forEach((item: { id: any }) => {
        this.userWishlist.push(item.id);
      });
    });
    this.cartService.getCartData().subscribe((data) => {
      data.forEach((item: { id: any }) => {
        this.userCart.push(item.id);
      });
    });
    this.sub = this.HomeService.getAllCategories().subscribe(res=>{
        this.categories = res.data ;
        // console.log(this.categories)
    })
    // this.sub = this.VendorService.getVendors().subscribe(res=>{
    //   this.vendors =  res;
    //   console.log(res);
    // })
    this.sub = this.TagesService.getAllTags().subscribe(res =>{
      console.log(res);
    })
  
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
    loadMoreFn(this.currentPage + 1).subscribe((data: any) => {
      this.productsGroup.push(data.data);
      this.updatePagination(data);
    });
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

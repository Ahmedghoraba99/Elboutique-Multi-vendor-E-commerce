import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectDropComponent } from './select-drop/select-drop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faShoppingCart,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgIf } from '@angular/common';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, SelectDropComponent, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private navBarSubscriptions: Subscription[] = [];
  selectedCategory: any = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private wislistService: WishlistService,
    private cartService: CartService
  ) {}
  isAuthenticated = false;
  currentUser: any = {};
  wishListItems = 0;
  cartItems = 0;
  ngOnInit(): void {
    this.authService.isAuthObservable().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      console.log('authStatus', isAuth);

      if (isAuth) {
        const authService = this.authService
          .getUserDataObservable()
          .subscribe((data) => {
            if (data) {
              this.currentUser = data.data;
            }
          });
        const wislistService = this.wislistService
          .getWishlistData()
          .subscribe((data) => {
            if (data) {
              this.wishListItems = data.length;
            }
          });

        const cartService = this.cartService.getCartData().subscribe((data) => {
          if (data) {
            this.cartItems = data.length;
          }
        });
        this.navBarSubscriptions.push(authService, wislistService, cartService);
      }
    });

    this.cartService.cart.next(this.cartService.getCustomerCart());
    this.wislistService.wishlist.next(this.wislistService.getUserWishlist());
    this.authService.currentUser.next(this.authService.getCurrentUserRrq());
  }

  onCategorySelected(category: any) {
    this.selectedCategory = category;
  }
  performSearch(searchTerm: string) {
    const categoryId = this.selectedCategory ? this.selectedCategory.id : 'all';
    this.router.navigate([`/categories/${categoryId}`], {
      queryParams: { name: searchTerm },
    });
  }

  handleKeyPress(event: KeyboardEvent, searchTerm: string) {
    if (event.key === 'Enter') {
      this.performSearch(searchTerm);
    }
  }
  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faArrowRightFromBracket = faArrowRightFromBracket;

  user_id = localStorage.getItem('id');
  logout(): void {
    // handle auth
    this.cartItems = 0;
    this.wishListItems = 0;
    this.currentUser = {};
   const logoutSubscription=  this.authService.logout().subscribe(() => {
      localStorage.removeItem('user_info');
      this.authService.updateAuthStatus(false);
      this.router.navigate(['/login']);
    });
    this.navBarSubscriptions.push(logoutSubscription);
  }
  ngOnDestroy(): void {
    this.navBarSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
}

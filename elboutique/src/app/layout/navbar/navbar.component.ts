import { Component, OnDestroy, OnInit,EventEmitter , Output } from '@angular/core';
import { SelectDropComponent } from './select-drop/select-drop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import {
  faSearch,
  faShoppingCart,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faUser, faChevronDown  ,faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgIf } from '@angular/common';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, SelectDropComponent,  CommonModule,NgIf ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  faUser=faUser ;
  faRightFromBracket=faRightFromBracket;
  faChevronDown = faChevronDown;
  isDropdownOpen = false;
  selectedIndex: number | null = null;
  selectedItem: string = "My Account";

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
  user_id: number | null = null;
  user_role: string | null = null;

  ngOnInit(): void {
    this.user_role = this.authService.getUserRole();

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

  logout(): void {
    // handle auth
    this.user_role = null;
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
  getDashboardRoute() :string {
    if (this.user_role === 'admin') {
      return '/dashboard';
    } else if (this.user_role === 'vendor') {
      return '/v';
    }
   return '/login';
  }
  ngOnDestroy(): void {
    this.navBarSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }

  @Output() categorySelected = new EventEmitter<any>();
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setIsOpen(index: number, name: string) {
    this.selectedIndex = index;
    this.isDropdownOpen = false;
    this.selectedItem = name;
  }

 



}

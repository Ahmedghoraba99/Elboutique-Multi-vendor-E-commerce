import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Auth/login/login.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ForgotPasswordComponent } from './Auth/forget-password/forget-password.component';
import { RegisterComponent } from './Auth/register/register.component';
import { CategoryComponent } from './category/category.component';
import { UsersComponent } from './dashboard/users/users.component';
import { VendorsComponent } from './dashboard/vendors/vendors.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { CheckMailComponent } from './Auth/check-mail/check-mail.component';
import { CongsComponent } from './Auth/congs/congs.component';
import { checkMailGuard } from './guards/check-mail.guard';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './profile/user/user.component';
import { AccountComponent } from './profile/user/account/account.component';
import { OrdersComponent as UserOrdersComponent } from './profile/user/orders/orders.component';
import { WishListComponent as UserWishListComponent } from './profile/user/wish-list/wish-list.component';
import { PaymentComponent } from './profile/user/payment/payment.component';
import { ChangePasswordComponent as UserChangePasswordComponent } from './profile/user/change-password/change-password.component';
export const routes: Routes = [
  {
    path: '',
    title: 'Elboutique',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        title: 'Overview',
        component: OverviewComponent,
      },
      {
        path: 'users',
        title: 'Users',
        component: UsersComponent,
      },
      {
        path: 'vendors',
        title: 'Vendors',
        component: VendorsComponent,
      },
      {
        path: 'products',
        title: 'Products',
        component: ProductsComponent,
      },
      {
        path: 'orders',
        title: 'Orders',
        component: OrdersComponent,
      },
    ],
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'wishlist',
    title: 'WishList',
    component: WishListComponent,
  },
  {
    path: 'products/:id',
    title: 'Details',
    component: CartComponent,
  },
  {
    path: 'checkout',
    title: 'Checkout',
    component: CheckoutComponent,
  },
  {
    path: 'category',
    title: 'Category',
    component: CategoryComponent,
  },
  {
    path: 'login/forget-password',
    title: 'ForgetPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkmail',
    title: 'checkmail',
    component: CheckMailComponent,
    canActivate: [checkMailGuard],
  },
  {
    path: 'congs',
    title: 'congs',
    component: CongsComponent,
  },

  {
    path: 'u',
    title: 'Users',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        title: 'Account',
        component: AccountComponent,
      },
      {
        path: 'orders',
        title: 'Orders',
        component: UserOrdersComponent,
      },
      {
        path: 'wishlist',
        title: 'WishList',
        component: UserWishListComponent,
      },
      {
        path: 'payment',
        title: 'Payment',
        component: PaymentComponent,
      },
      {
        path: 'account/change-password',
        title: 'Change Password',
        component: UserChangePasswordComponent,
      },
    ],
  },
  {
    path: '**',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];

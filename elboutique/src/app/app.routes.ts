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
  },
  {
    path: 'checkmail',
    title: 'checkmail',
    component: CheckMailComponent,
  },
  {
    path: '**',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];

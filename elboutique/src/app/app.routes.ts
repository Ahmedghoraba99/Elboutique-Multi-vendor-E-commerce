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
import { CheckMailComponent } from './Auth/check-mail/check-mail.component';
import { CongsComponent } from './Auth/congs/congs.component';
import { checkMailGuard } from './guards/check-mail.guard';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './profile/user/user.component';
import { AccountComponent } from './profile/user/account/account.component';
import { OrdersComponent as UserOrdersComponent } from './profile/user/orders/orders.component';
import { PaymentComponent } from './profile/user/payment/payment.component';
import { ChangePasswordComponent as UserChangePasswordComponent } from './Auth/change-password/change-password.component';
import { VendorComponent } from './profile/vendor/vendor.component';
import { OverviewComponent as VendorOverviewComponent } from './profile/vendor/overview/overview.component';
import { ProductsComponent as VendorProductsComponent } from './profile/vendor/products/products.component';
import { AccountComponent as VendorAccountComponent } from './profile/vendor/account/account.component';
import { ChangePasswordComponent as VendorChangePasswordComponent } from './profile/vendor/change-password/change-password.component';
import { CategoryComponent as VendorCategoryComponent } from './dashboard/category/category.component';
import { UserReviewsComponent } from './profile/user/user-reviews/user-reviews.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { adminGuard } from './_guards/admin.guard';
import { ReportListComponent } from './profile/user/report-list/report-list.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuardGuard } from './_guards/auth.guard';
import { AddProductComponent } from './profile/vendor/products/add-product/add-product.component';
import { UpdateProductComponent } from './profile/vendor/products/update-product/update-product.component';
import { ReportsComponent as ReviewReportsComponent } from './dashboard/reports/reports.component';
import { ShowProductComponent } from './profile/vendor/products/show-product/show-product.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AddressComponent } from './profile/user/address/address.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent, data: { title: 'Home' } },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard],
        data: { title: 'Login' },
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./wish-list/wish-list.module').then((m) => m.WishListModule),
      },
      {
        path: 'products/:id',
        loadComponent: () => CartComponent,
        data: { title: 'Details' },
      },
      {
        path: 'checkout',
        loadComponent: () => CheckoutComponent,
        data: { title: 'Checkout' },
      },
      {
        path: 'categories/:id',
        data: { title: 'Category' },
        // component: CategoryComponent,
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'vendor/:id',
        data: { title: 'Vendor Profile' },
        // component: VendorProfileComponent,
        loadChildren: () =>
          import('./vendor-profile/vendor-profile.module').then(
            (m) => m.VendorProfileModule
          ),
      },
      {
        path: 'login/forget-password',
        // loadComponent: () => ForgotPasswordComponent,
        loadChildren: () =>
          import('./Auth/forget-password/forget-password.module').then(
            (m) => m.ForgetPasswordModule
          ),
        data: { title: 'Forget Password' },
      },
      {
        path: 'register',
        loadComponent: () => RegisterComponent,
        canActivate: [authGuard],
        data: { title: 'Register' },
      },
      {
        path: 'checkmail',
        canActivate: [checkMailGuard],
        data: { title: 'Check Mail' },
        // loadComponent: () => CheckMailComponent,
        loadComponent: () =>
          import('./Auth/check-mail/check-mail.component').then(
            (m) => m.CheckMailComponent
          ),
      },
      {
        path: 'congs',
        loadComponent: () =>
          import('./Auth/congs/congs.component').then((m) => m.CongsComponent),
        data: { title: 'Congs' },
      },
      {
        path: 'password/reset',
        data: { title: 'Change Password' },
        // component: UserChangePasswordComponent,
        loadChildren: () =>
          import('./Auth/change-password/change-password.module').then(
            (m) => m.ChangePasswordModule
          ),
      },
      {
        path: 'Aboutus',
        data: { title: 'About us' },
        // component: AboutusComponent,
        loadComponent: () =>
          import('./aboutus/aboutus.component').then((m) => m.AboutusComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    // component: DashboardComponent,
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        title: 'Users',
        // component: UsersComponent,
        loadComponent: () =>
          import('./dashboard/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'vendors',
        title: 'Vendors',
        loadComponent: () => VendorsComponent,
      },
      {
        path: 'products',
        title: 'Products',
        // component: ProductsComponent,
        loadComponent: () =>
          import('./dashboard/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'orders',
        title: 'Orders',
        // component: OrdersComponent,
        loadComponent: () => OrdersComponent,
      },
      {
        path: 'categories',
        loadComponent: () => VendorCategoryComponent,
        title: 'Categories',
        // component: VendorCategoryComponent,
      },
      {
        path: 'reports',
        title: 'Reports',
        loadComponent: () => ReviewReportsComponent,
      },
    ],
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login/forget-password',
    title: 'ForgetPassword',
    loadChildren: () =>
      import('./Auth/forget-password/forget-password.module').then(
        (m) => m.ForgetPasswordModule
      ),
  },
  {
    path: 'register',
    title: 'Register',
    loadComponent: () => RegisterComponent,
    // loadChildren: () =>
    //   import('./Auth/register/register.module').then((m) => m.RegisterModule),
    canActivate: [authGuard],
  },
  {
    path: 'checkmail',
    title: 'checkmail',
    loadComponent: () => CheckMailComponent,
    canActivate: [checkMailGuard],
  },
  {
    path: 'congs',
    title: 'congs',
    loadComponent: () => CongsComponent,
  },
  {
    path: 'password/reset',
    title: 'Change Password',
    loadComponent: () => UserChangePasswordComponent,
  },

  {
    path: 'u',
    title: 'Users',
    loadComponent: () => UserComponent,
    canActivate: [authGuardGuard],

    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        title: 'Account',
        loadComponent: () => AccountComponent,
      },
      {
        path: 'orders',
        title: 'Orders',
        loadComponent: () => UserOrdersComponent,
      },
      {
        path: 'report-products',
        title: 'WishList',
        loadComponent: () => ReportListComponent,
      },
      {
        path: 'payment',
        title: 'Payment',
        loadComponent: () => PaymentComponent,
      },
      {
        path: 'reviews',
        title: 'Reviews',
        loadComponent: () => UserReviewsComponent,
      },
      {
        path: 'address',
        title: 'Address',
        loadComponent: () => AddressComponent
      }
    ],
  },
  {
    path: 'v',
    title: 'Vendor',
    loadComponent: () => VendorComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        title: 'Overview',
        loadComponent: () => VendorOverviewComponent,
      },
      {
        path: 'products',
        title: 'Products',
        loadComponent: () => VendorProductsComponent,
      },
      {
        path: 'products/add',
        title: 'Add Product',
        loadComponent: () => AddProductComponent,
      },
      {
        path: 'products/edit/:id',
        title: 'Edit Product',
        loadComponent: () => UpdateProductComponent,
      },
      {
        path: 'products/show/:id',
        title: 'Show Product',
        loadComponent: () => ShowProductComponent,
      },
      {
        path: 'products/edit/:id',
        title: 'edit Product',
        loadComponent: ()=> UpdateProductComponent
      },
      {
        path: 'account',
        title: 'Account',
        loadComponent: () => VendorAccountComponent,
      },
      {
        path: 'account/change-password',
        title: 'Change Password',
        loadComponent: () => VendorChangePasswordComponent,
      },
    ],
  },
  {
    path: 'not-authorized',
    title: 'Not Authorized',
    // component: NotAuthComponent,
    loadChildren: () =>
      import('./not-auth/not-auth.module').then((m) => m.NotAuthModule),
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => PageNotFoundComponent,
  },
];

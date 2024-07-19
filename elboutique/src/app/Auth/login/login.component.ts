import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../widgets/toast/toast.component';
import { NavComponent } from '../nav/nav.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../service/cart.service';
import { WishlistService } from '../../service/wishlist.service';
import { UtilityService } from '../../service/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastComponent,
    NavComponent,
    RouterLink,
  ],
})
export class LoginComponent implements OnDestroy, OnInit {
  private loginSubscriptions: Subscription[] = [];
  currentStep = 0;
  loginForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private utilityService: UtilityService
  ) {
    this.loginForm = this.fb.group({
      userType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {
    this.getSocialAuthParams();
  }
  getSocialAuthParams() {
    const paramsSubscription = this.route.queryParams.subscribe((params) => {
      const { token, role, id } = params;

      if (this.isValidParams(token, role, id)) {
        this.storeUserInfo(token, role, id);
        this.notfayNavBar();
        this.navigateToRoot();
      }
    });
    this.loginSubscriptions.push(paramsSubscription);
  }

  private isValidParams(token: string, role: string, id: string): boolean {
    return !!token && !!role && !!id;
  }

  private storeUserInfo(token: string, role: string, id: string): void {
    const userInfo = { token, role, id };
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }

  private navigateToRoot(): void {
    this.router.navigate(['/']);
  }
  nextStep() {
    if (this.currentStep === 0 && !this.loginForm.controls['userType'].valid) {
      this.utilityService.showToastMessage(
        this,
        'Please select a user type',
        'Validation Error'
      );
      return;
    }
    if (
      this.currentStep === 1 &&
      (!this.loginForm.controls['email'].valid ||
        !this.loginForm.controls['password'].valid)
    ) {
      this.utilityService.showToastMessage(
        this,
        'Please enter valid email and password',
        'Validation Error'
      );
      return;
    }
    this.currentStep = Math.min(this.currentStep + 1, 2);
  }

  prevStep() {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  selectUserType(userType: string) {
    this.loginForm.patchValue({ userType });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { userType, email, password } = this.loginForm.value;
      const loginSubscription = this.authService
        .login(email, password, userType)
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) => this.utilityService.handleError(this, error),
        });
      this.loginSubscriptions.push(loginSubscription);
    } else {
      this.utilityService.showToastMessage(
        this,
        'Please fill out the form correctly',
        'Validation Error'
      );
    }
  }
  loginWithGoogle() {
    const loginWithGoogleSubscription = this.authService
      .loginWithGoogle()
      .subscribe((response) => {
        window.location.href = response.url;
      });
    this.loginSubscriptions.push(loginWithGoogleSubscription);
  }

  loginWithFacebook() {
    const loginWithFacebookSubscription = this.authService
      .loginWithFacebook()
      .subscribe((response) => {
        window.location.href = response.url;
      });
    this.loginSubscriptions.push(loginWithFacebookSubscription);
  }

  notfayNavBar() {
    this.authService.getCurrentUser();
    this.authService.updateAuthStatus(true);
    this.cartService.fetchCustomerCart();
    this.wishlistService.fetchUserWishlist();
  }
  handleSuccess(response: any) {
    this.nextStep();
    this.notfayNavBar();

    if (response.role === 'admin') {
      this.utilityService.showToastMessage(
        this,
        'Welcome! Redirecting to admin dashboard...',
        'Success'
      );
    } else if (response.role === 'vendor') {
      this.utilityService.showToastMessage(
        this,
        'Welcome! Redirecting to vendor dashboard...',
        'Success'
      );
    } else {
      this.utilityService.showToastMessage(
        this,
        'Welcome! Redirecting to home page...',
        'Success'
      );
    }
    console.log(response);

    setTimeout(() => {
      if (response.role === 'admin') {
        this.router.navigateByUrl('/dashboard');
      } else if (response.role == 'vendor') {
        this.router.navigateByUrl('/v');
      } else this.navigateToRoot();
    }, 3000);
  }

  showToastMessage(message: string, title: string) {
    this.toastMessage = message;
    this.toastTitle = title;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
  ngOnDestroy() {
    if (this.loginSubscriptions) {
      this.loginSubscriptions.forEach((subscription) =>
        subscription.unsubscribe()
      );
      this.loginSubscriptions = [];
    }
  }
}

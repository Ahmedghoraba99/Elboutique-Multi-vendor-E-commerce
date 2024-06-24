import { Component } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';

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
export class LoginComponent {
  currentStep = 0;
  loginForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  nextStep() {
    if (this.currentStep === 0 && !this.loginForm.controls['userType'].valid) {
      this.showToastMessage('Please select a user type', 'Validation Error');
      return;
    }
    if (
      this.currentStep === 1 &&
      (!this.loginForm.controls['email'].valid ||
        !this.loginForm.controls['password'].valid)
    ) {
      this.showToastMessage(
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
      this.authService.login(email, password, userType).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) => this.handleError(error),
      });
    } else {
      this.showToastMessage(
        'Please fill out the form correctly',
        'Validation Error'
      );
    }
  }

  handleSuccess(response: any) {
    this.nextStep();
    localStorage.setItem('user_info', JSON.stringify(response));

    this.showToastMessage('Welcome! Redirecting to home page...', 'Success');
    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 3000);
  }
  handleError(error: any) {
    this.showToastMessage('Login failed. Please try again.', 'Error');
  }

  showToastMessage(message: string, title: string) {
    this.toastMessage = message;
    this.toastTitle = title;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}

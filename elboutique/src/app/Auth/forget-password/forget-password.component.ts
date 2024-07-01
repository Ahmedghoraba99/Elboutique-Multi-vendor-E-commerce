import { Component, OnDestroy } from '@angular/core';
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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent, NavComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgotPasswordComponent  implements OnDestroy{
  private forgotPasswordSubscriptions!: Subscription;
  forgotPasswordForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;

     this.forgotPasswordSubscriptions= this.authService.forgotPassword(email).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) => this.handleError(error),
      });
    } else {
      this.showToastMessage('Please enter a valid email', 'Validation Error');
    }
  }

  handleSuccess(response: any) {
    sessionStorage.setItem('needReset', 'true');
    this.showToastMessage('Password reset link sent!', 'Success');
    setTimeout(() => {
      this.router.navigateByUrl('/checkmail');
    }, 2000);

    this.forgotPasswordForm.reset();
  }

  handleError(error: any) {
    if (error.status == 404) {
      this.showToastMessage(
        'Failed to send password reset link. Please enter a valid email and try again.',
        'Error'
      );
    } else if (error.status == 400) {
      this.showToastMessage(
        ' We alrady sent link to your Email Please check your inbox.',
        'Error'
      );
    }
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

    this.forgotPasswordSubscriptions.unsubscribe();
    
  }

}

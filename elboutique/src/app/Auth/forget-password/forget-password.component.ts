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

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent, NavComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.forgotPassword(email).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) => this.handleError(error),
      });
    } else {
      this.showToastMessage('Please enter a valid email', 'Validation Error');
    }
  }

  handleSuccess(response: any) {
    this.showToastMessage('Password reset link sent!', 'Success');
  }

  handleError(error: any) {
    this.showToastMessage(
      'Failed to send password reset link. Please try again.',
      'Error'
    );
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

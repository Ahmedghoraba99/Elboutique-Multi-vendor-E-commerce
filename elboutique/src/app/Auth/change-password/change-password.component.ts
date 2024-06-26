import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../validators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  private token = this.getParams('token');
  private email = this.getParams('email');
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.token || !this.email) {
      this.router.navigate(['/login']);
    }
    this.creatForm();
  }

  creatForm() {
    this.changePasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },

      {
        validators: passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const dataObject = this.creatDataObject();
      this.authService.resetPassword(dataObject).subscribe(
        (res) => {
          this.handleSuccess();
        },
        (err) => {
          this.handleError(err);
        }
      );
      console.log(this.changePasswordForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  creatDataObject() {
    const data = {
      token: this.getParams('token'),
      email: this.getParams('email'),
      password: this.changePasswordForm.value.password,
    };
    return data;
  }
  handleSuccess() {
    sessionStorage.removeItem('needReset');
    alert(
      'Your password has been changed successfully. Please login with your new password'
    );

    this.router.navigateByUrl('/login');
  }
  handleError(err: any) {
    if (err.status) alert('This password reset token is invalid.');
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }
  getParams(param: string) {
    const searchBarParams = new URLSearchParams(window.location.search);
    return searchBarParams.get(param);
  }
}

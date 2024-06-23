// vendor-form.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../validators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../../../widgets/toast/toast.component';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
})
export class VendorFormComponent {
  vendorForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.vendorForm = this.fb.group(
      {
        image: [null, [Validators.required]],
        name: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z ,.\'-]+$/)],
        ],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^01[012]\d{8}$/)],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
          ],
        ],
        national_id: [null, [Validators.required]],
        address: ['', Validators.required],
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
  onFileSelected(event: any, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.vendorForm.patchValue({
        [controlName]: file,
      });
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.vendorForm);

    if (this.vendorForm.valid) {
      const from = this.createForm();

      this.authService.register('vendors', from).subscribe(
        (res) => {
          this.showToastMessage(
            'Welcome! Redirecting to checkmail page...',
            'vendor created successfully we sent a verification email to you please check your inbox'
          );
          setTimeout(() => {
            this.router.navigateByUrl('/checkmail');
          }, 2000);

          this.vendorForm.reset();
        },
        (err) => {
          console.log(err);
          this.showToastMessage(
            'Please fill out the form correctly',
            'Validation Error'
          );
        }
      );

      console.log('Vendor Form Data:', this.vendorForm.value);
    }
  }

  createForm() {
    const formData = new FormData();
    for (const key in this.vendorForm.value) {
      formData.append(key, this.vendorForm.value[key]);
    }
    return formData;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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

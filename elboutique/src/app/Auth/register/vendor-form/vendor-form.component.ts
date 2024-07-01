// vendor-form.component.ts
import { Component, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
})
export class VendorFormComponent implements OnDestroy {
  private vendorSubscriptions: Subscription[] = [];

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
        address: ['', [Validators.required, Validators.minLength(10)]],
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
  onBlur(controler: string) {
    const query = { [controler]: this.vendorForm.get(controler)?.value };
    const emailAndPasswordExisting = this.authService
      .emailAndPasswordExisting(query)
      .subscribe(
        () => {},
        (err) => {
          if (err.status == 422) {
            this.vendorForm
              .get(controler)
              ?.setErrors({ existingAccount: true });
            this.showToastMessage(
              'Phones and emails cannot be linked to more than one account.',
              'Validation Error'
            );
          }
        }
      );
    this.vendorSubscriptions.push(emailAndPasswordExisting);
  }
  onSubmit() {
    this.markFormGroupTouched(this.vendorForm);

    if (this.vendorForm.valid) {
      const from = this.createForm();

      const register = this.authService.register('vendors', from).subscribe(
        () => {
          this.handleSuccess();
        },
        (err) => {
          this.handleError(err);
        }
      );
      this.vendorSubscriptions.push(register);
    }
  }

  handleSuccess() {
    sessionStorage.setItem('needactivation', 'true');
    this.showToastMessage(
      'Welcome! Redirecting to checkmail page...',
      'vendor created successfully we sent a verification email to you please check your inbox'
    );
    setTimeout(() => {
      this.router.navigateByUrl('/checkmail');
    }, 2000);

    this.vendorForm.reset();
  }
  handleError(err: any) {
    console.log(err);
    this.showToastMessage(
      'Please fill out the form correctly',
      'Validation Error'
    );
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
  ngOnDestroy() {
    this.vendorSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}

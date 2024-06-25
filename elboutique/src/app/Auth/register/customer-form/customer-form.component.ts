import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../validators';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { ToastComponent } from '../../../widgets/toast/toast.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent {
  customerForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTitle = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.customerForm = this.fb.nonNullable.group(
      {
        image: ['', Validators.required],
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
        address: this.fb.nonNullable.group({
          governorate: [
            '',
            [
              Validators.required,
              Validators.pattern(/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/),
            ],
          ],
          city: [
            '',
            [
              Validators.required,
              Validators.pattern(/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/),
            ],
          ],
          street: [
            '',
            [
              Validators.required,
              Validators.pattern(/^(?=.*[A-Za-z])[A-Za-z0-9 _]+$/),
            ],
          ],
          houseNumber: [
            '',
            [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
          ],
        }),
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

  onSubmit() {
    this.markFormGroupTouched(this.customerForm);

    if (this.customerForm.valid) {
      const from = this.createForm();
      this.authService.register('customers', from).subscribe(
        (res) => {
          console.log('Vendor Form Data:', res);

          this.handleSuccess();
        },
        (err) => {
          this.handleError(err);
        }
      );
      const formData = this.customerForm.getRawValue();
      console.log('Vendor Form Data:', formData);
    }
  }

  handleSuccess() {
    localStorage.setItem('needactivation', 'true');
    this.showToastMessage(
      'Welcome! Redirecting to checkmail page...',
      'customer created successfully we sent a verification email to you please check your inbox'
    );
    setTimeout(() => {

      this.router.navigateByUrl('/checkmail');
    }, 2000);

    this.customerForm.reset();
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
    for (const key in this.customerForm.value) {
      if (key === 'address') {
        for (const addressKey in this.customerForm.value.address) {
          formData.append(
            `addresses[0][${addressKey}]`,
            this.customerForm.value.address[addressKey]
          );
        }
      } else if (key === 'phone') {
        formData.append(
          `phones[0][phoneNumper] `,
          this.customerForm.value[key]
        );
      } else {
        formData.append(key, this.customerForm.value[key]);
      }
    }
    return formData;
  }
  onFileSelected(event: any, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.customerForm.patchValue({
        [controlName]: file,
      });
    }
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
  ngOnDestroy(): void {}
}

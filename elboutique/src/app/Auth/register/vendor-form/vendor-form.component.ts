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

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class VendorFormComponent {
  vendorForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.vendorForm = this.fb.group(
      {
        avatar: [null, [Validators.required]],
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
      this.authService.register('vendors', this.vendorForm.value).subscribe(
        (res) => {
          
        },
        (err) => {
          console.log(err);
        }
      );

      console.log('Vendor Form Data:', this.vendorForm.value);
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
}

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

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class VendorFormComponent {
  vendorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.vendorForm = this.fb.group(
      {
        avatar: ['', [Validators.required]],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        idFront: ['', Validators.required],
        idBack: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit() {
    this.markFormGroupTouched(this.vendorForm);

    if (this.vendorForm.valid) {
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

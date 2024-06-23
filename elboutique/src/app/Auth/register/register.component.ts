import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavComponent,
    CustomerFormComponent,
    VendorFormComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      userType: ['', Validators.required],
    });
  }

  selectUserType(type: string) {
    this.userType = type;
    this.registerForm.patchValue({ userType: type });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log(formData);

      // if (this.userType === 'vendor') {
      //   this.authService.registerVendor(formData).subscribe({
      //     next: (response) => {
      //       // handle success
      //     },
      //     error: (error) => {
      //       // handle error
      //     },
      //   });
      // }
      if (this.userType === 'customer') {
        this.authService.registerCustomer(formData).subscribe({
          next: (response) => {
            // handle success
          },
          error: (error) => {
            // handle error
          },
        });
      }
    }
  }
}

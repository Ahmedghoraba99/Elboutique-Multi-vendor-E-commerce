import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendorChangePassword } from '../../../service/vendor/changePassword.service';
@Component({
  selector: 'app-vendor-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder , private  VendorChangePassword :VendorChangePassword) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.ConfirmValidator('newPassword', 'confirmPassword') }
    );
  }

  ConfirmValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors?.['confirmValidator']) {
        return null;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmValidator: true });
        return { confirmValidator: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      // console.log(this.changePasswordForm.value);
      const newPassword = this.changePasswordForm.value.newPassword;
      this.VendorChangePassword.changePassword(newPassword).subscribe(
        response=>{
          console.log(response);
          this.changePasswordForm.reset();
        }
      )
    } else {
      console.log('Form is invalid');
    }
  }
}

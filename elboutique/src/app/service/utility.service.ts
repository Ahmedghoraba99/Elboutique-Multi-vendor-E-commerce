import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private router: Router) {}

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showToastMessage(component: any, message: string, title: string) {
    component.toastMessage = message;
    component.toastTitle = title;
    component.showToast = true;
    setTimeout(() => {
      component.showToast = false;
    }, 5000);
  }

  handleSuccess(component: any, message: string, route: string) {
    sessionStorage.setItem('needactivation', 'true');
    this.showToastMessage(component, message, 'Success');
    setTimeout(() => {
      this.router.navigateByUrl(route);
    }, 2000);
    component.form.reset();
  }

  handleError(component: any, error: any) {
    console.log(error);
    this.showToastMessage(
      component,
      'Please fill out the form correctly',
      'Validation Error'
    );
  }

  uploadFile(event: any, controlName: string, targrtForm: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      targrtForm.patchValue({
        [controlName]: file,
      });
    }
  }
}

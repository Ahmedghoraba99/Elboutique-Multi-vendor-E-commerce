import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forget-password.component';
import { ToastComponent } from '../../widgets/toast/toast.component';
import { NavComponent } from '../nav/nav.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }]),
    ToastComponent,
    NavComponent,
  ],
})
export class ForgetPasswordModule {}

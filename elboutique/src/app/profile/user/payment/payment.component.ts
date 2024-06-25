import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SweetAlertComponent } from '../../../widgets/sweet-alert/sweet-alert.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SweetAlertComponent],
  providers: [SweetAlertComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup = new FormGroup({});
  @ViewChild('editPaymentModal') editPaymentModal: any;
  constructor(
    private fb: FormBuilder,
    private sweetAlertComponent: SweetAlertComponent
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],
      cardHolder: ['', [Validators.required, Validators.minLength(5)]],
      expiryDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$'),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
    });
  }

  onEditSubmit(): void {
    if (this.paymentForm.valid) {
      this.editPaymentModal.dismiss('success');

      console.log('Edited payment details:', this.paymentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  onSubmit(): void {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  confirmDelete(): void {
    this.sweetAlertComponent.showSweetAlert().then((result) => {
      if (result.isConfirmed) {
        // Logic to delete the payment
        console.log('Payment deleted');
      } else if (result.dismiss === 'cancel') {
        console.log('Delete operation canceled');
      }
    });
  }
}

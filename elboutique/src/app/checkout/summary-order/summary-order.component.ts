import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-summary-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './summary-order.component.html',
  styleUrls: ['./summary-order.component.css'],
})
export class SummaryOrderComponent implements OnInit {
  @Input() cartProduct: any;
  totalPrice: number = 0;
  paymentForm: FormGroup;
  faCcVisa = faCcVisa;
  faCreditCard = faCreditCard;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9 ]{19}$')],
      ], // Adjust the pattern to include spaces
      cardHolder: ['', [Validators.required]],
      expDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$'),
        ],
      ],
      ccv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      paymentType: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const productsPrices = this.cartProduct.map(
        (product: any) => product.price
      );
      const totalPrice = productsPrices.reduce(
        (accumelator: number, current: number) => {
          return accumelator + current;
        },
        0
      );
    
      this.totalPrice = totalPrice;
  }
}

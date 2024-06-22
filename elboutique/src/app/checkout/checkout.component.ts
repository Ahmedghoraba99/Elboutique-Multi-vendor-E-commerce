import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SummaryOrderComponent } from './summary-order/summary-order.component';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SummaryOrderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CheckoutComponent {

}

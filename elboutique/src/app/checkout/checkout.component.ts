import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SummaryOrderComponent } from './summary-order/summary-order.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {  faHeart , faTrashCan  } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SummaryOrderComponent ,FontAwesomeModule ,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CheckoutComponent  {
  faHeart = faHeart;
  faTrashCan=faTrashCan;
  addToWishlist() {
   
  }
  DeleteFromWishlist(){}
}
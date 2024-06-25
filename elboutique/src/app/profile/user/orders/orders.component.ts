import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddReviewComponent } from '../add-review/add-review.component';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {}

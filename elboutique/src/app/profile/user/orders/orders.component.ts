import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../service/order.service';
import { Subscription } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { AddReview } from '../../../_model/reviews';
import { AddReviewComponent } from '../add-review/add-review.component';


@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [RouterLink,FontAwesomeModule,AddReviewComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  faHeartBroken=faHeartBroken;
  userOrders: any;
  getUserOrderSub: Subscription | null = null;
  userInfo = localStorage.getItem('user_info');
  private userID = this.userInfo ? JSON.parse(this.userInfo).id : null;

  constructor(private ordersService: OrderService) {}
  ngOnDestroy(): void {
    this.getUserOrderSub?.unsubscribe();
  }

  getUser(){
    return this.userID;
  }

  ngOnInit(): void {
    this.getUserOrderSub = this.ordersService
      .getUserOrders(this.userID)
      .subscribe((res) => {
        console.log(res);
        this.userOrders = res.orders;
        console.log(this.userOrders);

      });
  }

  getOrderDate(date:any){
    return date.split("T")[0]
  }
}

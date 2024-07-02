import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit, OnDestroy {
  productDetailsSubscriptions: Subscription[] = [];
  constructor(
    private productService: ProductDetailsService,
    private route: ActivatedRoute
  ) {}
  product: any = {};
  id = 0;
  ngOnInit(): void {
    const idSubscription = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      const getProductSubscription = this.productService
        .getProduct(this.id)
        .subscribe((product) => {
          this.product = product;
        });
      this.productDetailsSubscriptions.push(getProductSubscription);
    });
    this.productDetailsSubscriptions.push(idSubscription);
  }
  ngOnDestroy(): void {
    this.productDetailsSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
}

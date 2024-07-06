import { ReportsService } from '../../service/admin/reports.service';
import { ProductService } from '../../service/admin/product.service';
import { VendorService } from '../../service/admin/vendor.service';
import { ReviewService } from '../../service/review.service';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    TabViewModule,
    FieldsetModule,
    AvatarModule,
    CommonModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private reportsSubscriptions: Subscription[] = [];
  productsReports: any[] = [];
  reviewsReports: any[] = [];
  constructor(
    private reportsService: ReportsService,
    private productService: ProductService,
    private vendorService: VendorService,
    private reviewService: ReviewService
  ) {}
  loading = true;

  ngOnInit(): void {
    this.getReviews();
    this.getProducts();
  }

  getReviews() {
    this.reportsSubscriptions.push(
      this.reportsService.getReReviewReports().subscribe({
        next: (response) => {
          this.reviewsReports = response.data;
          console.log('getReviews', this.reviewsReports);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        },
      })
    );
  }

  getProducts() {
    this.reportsSubscriptions.push(
      this.reportsService.getProductReports().subscribe({
        next: (response) => {
          this.productsReports = response.data;
          this.loading = false;
          console.log('getProducts', this.productsReports);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        },
      })
    );
  }

  banVendor(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ban !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsSubscriptions.push(
          this.vendorService.banVendor(id, true).subscribe({
            next: (response) => {
              this.getProducts();
            },
            error: (error) => {
              console.log(error);
            },
          })
        );
      }
    });
  }
  deleteProductReport(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsSubscriptions.push(
          this.reportsService.deleteProductReport(id).subscribe((response) => {
            this.getProducts();
          })
        );
      }
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsSubscriptions.push(
          this.productService.deleteProduct(id).subscribe({
            next: (response) => {
              console.log(response);
              this.getProducts();
            },
            error: (error) => {
              console.log(error);
            },
          })
        );
      }
    });
  }

  deleteReviewReport(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsSubscriptions.push(
          this.reportsService.deleteReviewReport(id).subscribe((response) => {
            console.log(response);
            this.getReviews();
          })
        );
      }
    });
  }
  deleteReview(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportsSubscriptions.push(
          this.reviewService.deleteReview(id).subscribe((response) => {
            console.log(response);
            this.getReviews();
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.reportsSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

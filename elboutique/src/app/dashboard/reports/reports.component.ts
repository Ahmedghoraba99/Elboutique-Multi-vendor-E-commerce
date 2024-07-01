import { ReportsService } from '../../service/admin/reports.service';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, FieldsetModule, AvatarModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private reportsSubscriptions: Subscription[] = [];

  constructor(private reportsService: ReportsService) {}
  loading = true;

  ngOnInit(): void {
    this.getReports();
    this.getProducts();
  }

  getReports() {
    this.reportsSubscriptions.push(
      this.reportsService.getReReviewReports().subscribe({
        next: (response) => {
          console.log(response);
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
          console.log(response);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.reportsSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

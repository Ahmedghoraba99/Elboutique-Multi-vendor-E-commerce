import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  NgModel,
  FormsModule,
} from '@angular/forms';
import { AddReportService } from '../../service/add-report.service';
import { AddReport } from '../../_model/add-report';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './report-review.component.html',
  styleUrl: './report-review.component.css',
})
export class ReportReviewComponent implements OnDestroy {
  reportReviewSubscriptions!: Subscription;

  @Input() reviewId: number = 0;
  customerId: number;
  report!: AddReport;
  reportForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isAdd:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private addReportService: AddReportService
  ) {
    this.reportForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.customerId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
  }

  onSubmit() {
    if (this.reportForm.valid) {
      const review: AddReport = this.reportForm.value;
      review.customer_id = this.customerId;
      review.review_id = this.reviewId;
      // Call the service to add the report
      this.reportReviewSubscriptions = this.addReportService
        .submitReport(review)
        .subscribe(
          (response) => {
            this.successMessage = 'Review created successfully';
            setTimeout(()=>{
              this.successMessage ='';
            },2000);
            this.errorMessage = '';
            this.reportForm.reset();
            setTimeout(() => {
              this.successMessage = '';
            }, 2000);
          },
          (error) => {
            this.errorMessage = 'An error occurred while submitting the review';
            this.successMessage = '';
            setTimeout(() => {
              this.errorMessage =
                'An error occurred while submitting the review';
            }, 2000);
          }
        );
    }
  }
  ngOnDestroy(): void {
    if (this.reportReviewSubscriptions) {
      this.reportReviewSubscriptions.unsubscribe();
    }
  }
}

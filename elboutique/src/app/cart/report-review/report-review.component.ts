
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, NgModel, FormsModule } from '@angular/forms';
import { AddReportService } from '../../service/add-report.service';
import {AddReport} from '../../_model/add-report'


@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './report-review.component.html',
  styleUrl: './report-review.component.css'
})
export class ReportReviewComponent {

  @Input() reviewId: number = 0;
  customerId: number;
  report!: AddReport;
  reportForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private addReportService: AddReportService) {
    this.reportForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.customerId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
  }

  onSubmit() {
    if (this.reportForm.valid) {
      const review:AddReport = this.reportForm.value;
      review.review_id = this.reviewId;
      review.customer_id = this.customerId;
      // Call the service to add the report
      this.addReportService.submitReport(review)
        .subscribe(
          response => {
            this.successMessage = 'Review created successfully';
            this.errorMessage = '';
            this.reportForm.reset();
            setTimeout(()=>{
              this.successMessage = '';
            },2000);
      },
      error => {
        this.errorMessage = 'An error occurred while submitting the review';
        this.successMessage = '';
        setTimeout(()=>{
          this.errorMessage = 'An error occurred while submitting the review';
        },2000);
      }
    )
    }
  }

}

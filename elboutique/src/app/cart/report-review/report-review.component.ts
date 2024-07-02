
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
  isAdd:boolean = false;

  constructor(private formBuilder: FormBuilder, private addReportService: AddReportService) {
    this.reportForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.customerId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.isAdd = true;
      const review:AddReport = this.reportForm.value;
      review.customer_id = this.customerId;
      review.review_id = this.reviewId;
      // Call the service to add the report
      this.addReportService.submitReport(review)
        .subscribe(
          response => {
            this.successMessage = 'Review created successfully';
            setTimeout(()=>{
              this.successMessage ='';
            },2000);
            this.errorMessage = '';
            this.reportForm.reset();
            this.isAdd = false;
      },
      error => {
        setTimeout(()=>{
          this.errorMessage = 'An error occurred while submitting the review';
        },2000);
        this.errorMessage = '';
      }
    )
    }
  }

}

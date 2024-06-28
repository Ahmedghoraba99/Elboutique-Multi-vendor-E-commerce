import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import {AddReport} from '../../../_model/add-report'
import {ReportProductService} from '../../../service/report-product.service'


@Component({
  selector: 'app-add-report-product',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './add-report-product.component.html',
  styleUrl: './add-report-product.component.css'
})
export class AddReportProductComponent {
  @Input() productId: number = 0;
  report!: AddReport;
  customerId: number;
  reportForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private addReportService: ReportProductService) {
    this.reportForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.customerId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
  }


  onSubmit() {
    if (this.reportForm.valid) {
      const review:AddReport = this.reportForm.value;
      review.customer_id = this.customerId;
      review.product_id = this.productId;
      // call service
      this.addReportService.submitReport(review).subscribe(
        data => {
          this.successMessage = 'Report submitted successfully';
          this.reportForm.reset();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error => {
          this.errorMessage = 'An error occurred while submitting the review';
          this.successMessage = '';
          setTimeout(()=>{
            this.errorMessage = '';
          },2000);
        }
      )
    }
  }
}

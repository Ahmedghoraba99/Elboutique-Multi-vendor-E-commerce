import { Component, OnInit } from '@angular/core';
import {AllReport} from '../../../_model/reviews';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddReportService } from '../../../service/add-report.service';


@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent implements OnInit{
  reports:AllReport[] = [];
  customerId!: number;
  errorMessage = '';
  successMessage = '';
  private id:number = 0;
  private report_id = 0;
  reason:string = '';
  reviewForm: FormGroup;

  constructor(private reportService: AddReportService,private fb: FormBuilder) {
    if(localStorage.getItem('user_info')){
      this.customerId  = JSON.parse(localStorage.getItem('user_info') || '{}').id;
    }
    this.reviewForm = this.fb.group({
      reason: [this.reason, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reportService.getReviewsByCustomer(this.customerId).subscribe(
      response => {
        this.reports = response.data;
      },
      error => {
        this.errorMessage = 'An error occurred while fetching the reviews';
      }
    );
  }

  setReviewForUpdate(report:AllReport){
    this.reason = report.reason;
    this.report_id = report.id;
    console.log(this.report_id);
    console.log(this.reason);
  }

  deleteReview(id:number){
    this.id = id;
  }
  comnfirmDeleteReview(){
    this.reportService.deleteReview(this.id).subscribe(
      response => {
        this.loadReviews();
      }
    );
  }

  onSubmit(){
    const report = {
      reason: this.reason
    }
    this.reportService.updateReview(this.report_id, report).subscribe(
      (response) => {
        this.successMessage = 'Report updated successfully';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.loadReviews();
        this.reason = '';
    },
    error => {
      this.errorMessage = 'An error occurred while submitting the review';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      this.successMessage = '';
    });
  }

}

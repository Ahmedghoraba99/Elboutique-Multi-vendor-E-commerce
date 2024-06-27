import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../service/review.service';
import {AllReviews} from '../../../_model/reviews';
import { CommonModule } from '@angular/common';
import { UpdateReviewComponent } from './update-review/update-review.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule,UpdateReviewComponent,ReactiveFormsModule,RouterLink],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.css'
})

export class UserReviewsComponent implements OnInit {

  reviews:AllReviews[] = [];
  customerId!: number;
  errorMessage = '';
  successMessage = '';
  private id:number = 0;
  private review_id = 0;
  comment:string = '';
  rate:number = 0;
  reviewForm: FormGroup;


  constructor(private reviewService: ReviewService,private fb: FormBuilder) {
    if(localStorage.getItem('user_info')){
      this.customerId  = JSON.parse(localStorage.getItem('user_info') || '{}').id;
    }
    this.reviewForm = this.fb.group({
      rate: this.rate,
      comment: this.comment,
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByCustomer(this.customerId).subscribe(
      response => {
        this.reviews = response.data;
        // console.log(this.reviews);
      },
      error => {
        this.errorMessage = 'An error occurred while fetching the reviews';
      }
    );
  }

  comnfirmDeleteReview(): void {
    this.reviewService.deleteReview(this.id).subscribe(
      () => {
        this.successMessage = 'Review deleted successfully';
        this.loadReviews(); // Refresh the reviews list
      },
      error => {
        this.errorMessage = 'An error occurred while deleting the review';
      }
    );
  }

  deleteReview(reviewId: number): void {
    this.id = reviewId;
    // console.log(this.id);
  }

  setReviewForUpdate(review: AllReviews): void {
    const selectedReview = review;
    this.comment = selectedReview.comment;
    this.rate = selectedReview.rate;
    this.setRating(this.rate);
    this.review_id = selectedReview.id;
    console.log(this.reviewForm.value.rate);
  }

  onSubmit(): void {
    const review = {
      rate: this.rate,
      comment: this.comment,
    }
    this.reviewService.updateReview(this.review_id, review).subscribe(
      (response) => {
        this.successMessage = 'Review updated successfully';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.loadReviews();
    },
    error => {
      this.errorMessage = 'An error occurred while submitting the review';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      this.successMessage = '';
    });

  }


  setRating(rate: number): void {
    this.reviewForm.patchValue({ rate });
    this.rate = rate;
  }

  changeComment(){
    // this.comment =
  }



}

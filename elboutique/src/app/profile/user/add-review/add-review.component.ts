import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../service/review.service';
import { AddReview } from '../../../_model/reviews';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddReviewComponent {

  reviewForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rate: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      customer_id: ['', Validators.required],
      product_id: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const review: AddReview = this.reviewForm.value;
      this.reviewService.submitReview(review).subscribe(
        response => {
          this.successMessage = 'Review created successfully';
          this.errorMessage = '';
          this.reviewForm.reset();
          this.reviewForm.patchValue({ rate: 0 });
        },
        error => {
          this.errorMessage = 'An error occurred while submitting the review';
          this.successMessage = '';
        }
      );
    }
  }

  setRating(rate: number): void {
    this.reviewForm.patchValue({ rate });
  }

}

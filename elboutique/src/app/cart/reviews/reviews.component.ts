import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import {Review} from '../../_model/reviews'
import { ReviewService } from '../../service/review.service';
import { ActivatedRoute } from '@angular/router';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import { ReportReviewComponent } from '../report-review/report-review.component';


@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,ReportReviewComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit{
  reviews: Review[] = [];
  averageRating: number = 0;
  totalRating: number = 0;
  reviewId :number = 0;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ){}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadReviews(productId);
    })
  }



  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarEmpty = faStarEmpty;
    rating = 3 ;

  setRating(value:number){
    this.rating = value ;
  }

  reviewRate = 5;
  setReviewRate(value:number){
    this.reviewRate = value
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviews(productId).subscribe(response => {
      this.reviews = response.data;
      this.calculateAverageRating();
    });
  }

  calculateAverageRating(): void {
    this.totalRating = this.reviews.reduce((sum, review) => sum + Number(review.rate), 0);
    this.averageRating = this.totalRating / this.reviews.length;
    this.averageRating = Number(this.averageRating.toFixed(2));

  }

  getStarIcon(index: number): any {
    if (index < Math.floor(this.averageRating)) {
      return this.faStar;
    } else if (index === Math.floor(this.averageRating) && this.averageRating % 1 !== 0) {
      return this.faStarHalfAlt;
    } else {
      return this.faStarEmpty;
    }
  }

  updateReview(id:number){
    this.reviewId = id;
    console.log(this.reviewId);
  }

}


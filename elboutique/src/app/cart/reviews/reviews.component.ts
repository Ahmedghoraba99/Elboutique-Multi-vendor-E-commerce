import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import {Review} from '../../_model/reviews'
import { ReviewService } from '../../service/review.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit{
  reviews: Review[] = [];
  averageRating: number = 0;
  totalRating: number = 0;

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
      // console.log(response.data);
      this.reviews = response.data;
      this.calculateAverageRating();
      console.log(this.reviews);
    });
  }

  calculateAverageRating(): void {
    this.totalRating = this.reviews.reduce((sum, review) => sum + Number(review.rate), 0);
    this.averageRating = this.totalRating / this.reviews.length;

  }
}

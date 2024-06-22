import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  faStar = faStar;
  rating = 3 ;

  setRating(value:number){
    this.rating = value ;
  }
  reviewRate = 5;
  setReviewRate(value:number){
    this.reviewRate = value
  }
}

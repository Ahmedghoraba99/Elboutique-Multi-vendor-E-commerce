import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ReviewResponse} from '../_model/reviews'
import { AddReview } from '../_model/reviews';
import {AllReviews} from '../_model/reviews';


@Injectable({
  providedIn: 'root'
})


export class ReviewService {
  private apiUrl = 'http://127.0.0.1:8000/api/reviews';

  constructor(private http: HttpClient) { }

  getReviews(productId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/product/${productId}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }

  submitReview(review: AddReview): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, review, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getReviewsByCustomer(customerId: number): Observable<{data: AllReviews[]}> {
    return this.http.get<{data: AllReviews[]}>(`${this.apiUrl}/customer/${customerId}`);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  updateReview(reviewId: number, review: Partial<AllReviews>): Observable<AllReviews> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '_method': 'PUT'
    });
    return this.http.post<AllReviews>(`${this.apiUrl}/${reviewId}`, {'_method':'PUT',...review});
  }


}

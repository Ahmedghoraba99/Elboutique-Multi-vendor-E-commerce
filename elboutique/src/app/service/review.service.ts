import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ReviewResponse} from '../_model/reviews'


@Injectable({
  providedIn: 'root'
})


export class ReviewService {
  private apiUrl = 'http://127.0.0.1:8000/api/reviews/product';

  constructor(private http: HttpClient) { }

  getReviews(productId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/${productId}`);
  }

  
}

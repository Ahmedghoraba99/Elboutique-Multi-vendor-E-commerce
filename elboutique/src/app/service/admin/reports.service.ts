import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private reviewUrl = 'http://127.0.0.1:8000/api/report-reviews';
  private productUrl = 'http://127.0.0.1:8000/api/report-products';

  constructor(private http: HttpClient) {}

  getReReviewReports(): Observable<any> {
    return this.http.get(this.reviewUrl);
  }

  getProductReports(): Observable<any> {
    return this.http.get(this.productUrl);
  }
  deleteProductReport(id: number): Observable<any> {
    return this.http.delete(`${this.productUrl}/${id}`);
  }
}

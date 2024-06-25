import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  getFeaturedProducts(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/product/featured`)
      .pipe(tap((data) => data));
  }

  getOnSaleProducts(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/product/onsale`)
      .pipe(tap((data) => data));
  }

  getNewArrivalsProducts(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/product/newarrivals`)
      .pipe(tap((data) => data));
  }

  getProductsInCategory(categoryId: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/product/category/${categoryId}`)
      .pipe(tap((data) => data));
  }

  getAllCategories(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/categories`)
      .pipe(tap((data) => data));
  }

  constructor() {}
}

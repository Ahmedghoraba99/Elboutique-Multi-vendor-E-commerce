import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';
  private categories$!: Observable<any>;

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
    if (!this.categories$) {
      this.fetchCategories();
    }
    return this.categories$;
  }

  fetchCategories(): void {
    this.categories$ = this.httpClient
      .get<any>(`${this.baseUrl}/categories`)
      .pipe(shareReplay(1));
  }
  constructor() {}
}

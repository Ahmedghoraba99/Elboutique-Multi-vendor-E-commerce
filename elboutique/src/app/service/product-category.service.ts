import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  httpClient = inject(HttpClient);
  getAllProductsInAll(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8000/api/products');
  }

  getAllVendors(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8000/api/Vendors');
  }

  loadMoreProductsAll(page: number): Observable<any> {
    return this.httpClient
      .get<any>(`http://localhost:8000/api/products?page=${page}`)
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }

  productsPerCategory(categoryId: number): Observable<any> {
    return this.httpClient.get<any>(
      `http://localhost:8000/api/product/category/${categoryId}`
    );
  }
  loadMoreProductsPerCategory(
    categoryId: number,
    page: number
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        `http://localhost:8000/api/product/category/${categoryId}?page=${page}`
      )
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }

  searchForProducts(queryParams: any): Observable<any> {
    queryParams = new HttpParams({
      fromObject: queryParams,
    });
    return this.httpClient.get<any>(
      `http://localhost:8000/api/product/search`,
      { params: queryParams }
    );
  }
  constructor() {}
}

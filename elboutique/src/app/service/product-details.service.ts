import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  getProduct(id: number): Observable<any> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/products/${id}`)
      .pipe(tap((data) => console.log(data)));
  }
  constructor() {}
}

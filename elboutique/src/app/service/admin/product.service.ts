import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, perPage: number = 10): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&per_page=${perPage}`;
    return this.http.get(url);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  updateProduct(id: number, productData: FormData): Observable<any> {
    console.log(productData);

    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  deleteProducts(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products/delete-multiple`, {
      ids,
    });
  }
}

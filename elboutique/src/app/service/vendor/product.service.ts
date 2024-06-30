import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorAddProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  addProductVendor(product: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(this.apiUrl, product, { headers });
  }

  updateProductVendor(id: number, product: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/${id}?_method=PUT`, product, { headers });
  }
  deleteProdcutVendor(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addSale(id: number, product: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.post(`${this.apiUrl}/${id}`, product, { headers });
  }
}

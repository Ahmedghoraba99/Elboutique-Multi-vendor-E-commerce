import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://127.0.0.1:8000/api/customer';
  private userInfo = localStorage.getItem('user_info');
  private userID = this.userInfo ? JSON.parse(this.userInfo).id : null;

  constructor(private http: HttpClient) {}

  getCustomerCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/showCart/${this.userID}`);
  }
  addToCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCart/${this.userID}`, body);
  }
  deleteFromCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteCart/${this.userID}`, body);
  }
  clearCustomerCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clearCart/${this.userID}`);
  }
}

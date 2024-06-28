import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://127.0.0.1:8000/api/orders';
  private userInfo = localStorage.getItem('user_info');
  private userID = this.userInfo ? JSON.parse(this.userInfo).id : null;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getUserOrders(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }
  createOrder(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}`, {
      customer_id: this.userID,
      ...body,
    });
  }
  addProductToOrder(body: Object, id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProducts/${id}`, body);
  }
  updateOrder(body: Object): Observable<any> {
    return this.http.put(`${this.baseUrl}`, body);
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

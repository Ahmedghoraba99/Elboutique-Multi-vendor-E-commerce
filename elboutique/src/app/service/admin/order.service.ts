import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://127.0.0.1:8000/api/orders';
  private statusUrl = 'http://127.0.0.1:8000/api/changeorderstatus';
  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  addOrder(order: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, order);
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, order);
  }
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.statusUrl}/${id}`, { status });
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://127.0.0.1:8000/api/payment';

  constructor(private http: HttpClient) {}

  payByPayPal(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}`, body);
  }
}

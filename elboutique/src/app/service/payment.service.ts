import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private payPalUrl = 'http://127.0.0.1:8000/api/payment';
  private payMobUrl = 'http://127.0.0.1:8000/api/getway-checkout';
  constructor(private http: HttpClient) {}

  payByPayPal(body: Object): Observable<any> {
    return this.http.post(`${this.payPalUrl}`, body);
  }

  payByPayMob(body: Object): Observable<any> {
    return this.http.post(`${this.payMobUrl}`, body);
  }
}

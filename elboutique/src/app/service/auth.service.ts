import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'api';
  private vendorLoginUrl = `${this.baseUrl}/vendor/login`;
  private customerLoginUrl = `${this.baseUrl}/customer/login`;

  constructor(private http: HttpClient) {}

  loginVendor(email: string, password: string): Observable<any> {
    return this.http.post(this.vendorLoginUrl, { email, password });
  }

  loginCustomer(email: string, password: string): Observable<any> {
    return this.http.post(this.customerLoginUrl, { email, password });
  }
}

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
  private vendorRegisterUrl = `${this.baseUrl}/vendor/register`;
  private customerRegisterUrl = `${this.baseUrl}/customer/register`;

  constructor(private http: HttpClient) {}

  loginVendor(email: string, password: string): Observable<any> {
    return this.http.post(this.vendorLoginUrl, { email, password });
  }

  loginCustomer(email: string, password: string): Observable<any> {
    return this.http.post(this.customerLoginUrl, { email, password });
  }
  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  registerVendor(vendorData: any): Observable<any> {
    return this.http.post(this.vendorRegisterUrl, vendorData);
  }

  registerCustomer(customerData: any): Observable<any> {
    return this.http.post(this.customerRegisterUrl, customerData);
  }
}

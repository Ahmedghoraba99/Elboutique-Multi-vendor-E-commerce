import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  private loginUrl = `${this.baseUrl}/login`;

  private vendorRegisterUrl = `${this.baseUrl}/vendor/register`;
  private customerRegisterUrl = `${this.baseUrl}/customer/register`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password, role });
  }

  // loginCustomer(email: string, password: string): Observable<any> {
  //   return this.http.post(this.customerLoginUrl, { email, password });
  // }
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

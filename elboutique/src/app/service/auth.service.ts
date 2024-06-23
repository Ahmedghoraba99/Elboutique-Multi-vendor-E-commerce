import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api/';
  private loginUrl = `${this.baseUrl}login`;
  private storageData = localStorage.getItem('user_info');
  private registerUrl = `${this.baseUrl}/ `;
  private customerRegisterUrl = `${this.baseUrl}/customer/register`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password, role });
  }

  getCurrentUser(): Observable<any> | null {
    const currentStoragUser = this.getStorageData();
    if (currentStoragUser) {
      return this.http.get(
        `${this.baseUrl}${currentStoragUser.role}s/${currentStoragUser.id}`
      );
    }
    return null;
  }

  getStorageData() {
    return this.storageData !== null ? JSON.parse(this.storageData) : null;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  register(role: string, data: any): Observable<any> {
    console.log(data);

    return this.http.post(`${this.baseUrl}${role}`, data);
  }
  verification(verificationLink: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(verificationLink, { headers });
  }

  registerCustomer(customerData: any): Observable<any> {
    return this.http.post(this.customerRegisterUrl, customerData);
  }
}

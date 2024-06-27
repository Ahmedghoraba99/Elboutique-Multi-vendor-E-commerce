import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private checkMailSubject: Subject<string> = new Subject();
  private checkMailStatus!: string;
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

  getToken() {
    const user = this.getStorageData();
    return user ? user.token : null;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}forgot-password`, { email });
  }
  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}password/reset`, data);
  }

  register(role: string, data: any): Observable<any> {
    console.log(data);

    return this.http.post(`${this.baseUrl}${role}`, data);
  }

  emailAndPasswordExisting(query: any) {
    return this.http.post(`${this.baseUrl}registerFormValdation`, query);
  }

  verification(verificationLink: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(verificationLink, { headers });
  }
  logout() {
    localStorage.removeItem('user_info');
  }
  registerCustomer(customerData: any): Observable<any> {
    return this.http.post(this.customerRegisterUrl, customerData);
  }
  needReset() {
    this.checkMailStatus = 'needReset';

    this.checkMailSubject.next(this.checkMailStatus);
  }
  needActivation() {
    this.checkMailStatus = 'needActivation';
    this.checkMailSubject.next(this.checkMailStatus);
  }

  getCheckMailStatus(): Observable<any> {
    return this.checkMailSubject.asObservable();
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Subject,
  Observable,
  Subscription,
  BehaviorSubject,
  tap,
  of,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private checkMailSubject: Subject<string> = new Subject();
  private checkMailStatus!: string;
  private baseUrl = 'http://127.0.0.1:8000/api/';
  private loginUrl = `${this.baseUrl}login`;
  private storageData!: any;
  private customerRegisterUrl = `${this.baseUrl}/customer/register`;
  public authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}
  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password, role }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('user_info', JSON.stringify(response));
          this.getCurrentUser();
          this.updateAuthStatus(true);
        }
      })
    );
  }
  public currentUser = new BehaviorSubject<any>(null);

  getCurrentUser() {
    const currentStorageUser = this.getStorageData();
    if (currentStorageUser) {
      this.http
        .get(
          `${this.baseUrl}${currentStorageUser.role}s/${currentStorageUser.id}`
        )
        .subscribe((userData) => {
          this.currentUser.next(userData);
        });
    }
  }
  getCurrentUserRrq() {
    const currentStorageUser = this.getStorageData();
    if (currentStorageUser) {
      return this.http.get(
        `${this.baseUrl}${currentStorageUser.role}s/${currentStorageUser.id}`
      );
    }
    return null;
  }
  getUserDataObservable(): Observable<any> {
    this.getCurrentUser();
    if (this.isAuthenticated()) {
      this.getCurrentUser();
      return this.currentUser.asObservable();
    }
    return this.currentUser.asObservable();
  }

  getStorageData() {
    this.storageData = localStorage.getItem('user_info');
    return this.storageData != null ? JSON.parse(this.storageData) : null;
  }

  getToken() {
    const user = this.getStorageData();
    return user ? user.token : null;
  }

  getUserRole() {
    const user = this.getStorageData();
    return user ? user.role : null;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}forgot-password`, { email });
  }
  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}password/reset`, data);
  }

  register(role: string, data: any): Observable<any> {
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
    return this.http.get(`${this.baseUrl}logout`);
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
  updateAuthStatus(isAuthenticated: boolean): void {
    this.authStatus.next(isAuthenticated);
  }
  isAuthObservable(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  loginWithGoogle(): Observable<any> {
    return this.http.get(`${this.baseUrl}auth/google`);
  }

  loginWithFacebook(): Observable<any> {
    return this.http.get(`${this.baseUrl}auth/facebook`);
  }
}

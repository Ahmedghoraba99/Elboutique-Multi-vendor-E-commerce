import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, Subscription, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

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
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

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
  private currentUser = new BehaviorSubject<any>(null);

  getCurrentUser(): void {
    const currentStorageUser = this.getStorageData();
    if (currentStorageUser) {
      this.http
        .get(
          `${this.baseUrl}${currentStorageUser.role}s/${currentStorageUser.id}`
        )
        .subscribe((userData) => {
          // console.log('From Observable', userData);
          this.currentUser.next(userData);
        });
    }
  }
  getUserDataObservable(): Observable<any> {
    // console.log('userDataObservable');

    this.getCurrentUser();
    if (this.isAuthenticated()) {
      // console.log('Authemticated getting user');
      this.getCurrentUser();
      return this.currentUser.asObservable();
    }
    return this.currentUser.asObservable();
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
    // console.log(data);

    return this.http.post(`${this.baseUrl}${role}`, data);
  }

  emailAndPasswordExisting(query: any) {
    return this.http.post(`${this.baseUrl}registerFormValdation`, query);
  }

  verification(verificationLink: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(verificationLink, { headers });
  }
  logout(): void {
    localStorage.removeItem('user_info');
    this.updateAuthStatus(false);
    this.router.navigate(['/login']);
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
}

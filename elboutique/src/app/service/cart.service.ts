import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://127.0.0.1:8000/api/customer';
  private userInfo!: any; // = localStorage.getItem('user_info');
  private userID!: any; // = this.userInfo ? JSON.parse(this.userInfo).id : null;
  private userRole!: any; // = this.userInfo ? JSON.parse(this.userInfo).role : null;

  public cart = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.getStorageData();
    // Fetch initial cart data when service is instantiated
    if (this.userID) {
      this.fetchCustomerCart();
    }
  }

  getStorageData() {
    this.userInfo = localStorage.getItem('user_info');
    this.userID = this.userInfo ? JSON.parse(this.userInfo).id : null;
    this.userRole = this.userInfo ? JSON.parse(this.userInfo).role : null;
  }
  getCustomerCart(): Observable<any> {
    this.getStorageData();
    if (!this.userID || this.userRole === 'vendor') {
      return of(null);
    }
    return this.http.get(`${this.baseUrl}/showCart/${this.userID}`);
  }
  addToCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCart/${this.userID}`, body);
  }
  deleteFromCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteCart/${this.userID}`, body);
  }
  clearCustomerCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clearCart/${this.userID}`);
  }
  fetchCustomerCart(): void {
    this.getCustomerCart().subscribe((cartData) => {
      this.cart.next(cartData);
    });
  }
  getCartData(): Observable<any> {
    return this.cart.asObservable();
  }
  addItemToCart(body: Object): void {
    this.addToCustomerCart(body)
      .pipe(
        switchMap(() => this.getCustomerCart()),
        tap((cartData) => this.cart.next(cartData))
      )
      .subscribe();
  }

  deleteItemFromCart(body: Object): void {
    this.deleteFromCustomerCart(body)
      .pipe(
        switchMap(() => this.getCustomerCart()),
        tap((cartData) => this.cart.next(cartData))
      )
      .subscribe();
  }
  clearCart(): void {
    this.clearCustomerCart()
      .pipe(
        switchMap(() => this.getCustomerCart()),
        tap((cartData) => this.cart.next(cartData))
      )
      .subscribe();
  }
}

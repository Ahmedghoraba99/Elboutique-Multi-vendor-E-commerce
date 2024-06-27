import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://127.0.0.1:8000/api/customer';
  private userInfo = localStorage.getItem('user_info');
  private userID = this.userInfo ? JSON.parse(this.userInfo).id : null;
  private cart = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Fetch initial cart data when service is instantiated
    if (this.userID) {
      this.fetchCustomerCart();
    }
  }

  getCustomerCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/showCart/${this.userID}`);
  }
  addToCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCart/${this.userID}`, body);
  }
  deleteFromCustomerCart(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteCart/${this.userID}`, body);
  }
  // ************
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
}

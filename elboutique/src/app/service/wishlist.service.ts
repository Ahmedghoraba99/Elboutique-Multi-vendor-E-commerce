import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = 'http://127.0.0.1:8000/api/customer';
  private userInfo!: any; // = localStorage.getItem('user_info');
  private userID!: any; // = this.userInfo ? JSON.parse(this.userInfo).id : null;
  private userRole!: any; // = this.userInfo ? JSON.parse(this.userInfo).role : null;

  public wishlist = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getUserWishlist(): Observable<any> {
    this.userInfo = localStorage.getItem('user_info');
    this.userID = this.userInfo ? JSON.parse(this.userInfo).id : null;
    this.userRole = this.userInfo ? JSON.parse(this.userInfo).role : null;
    if (!this.userID || this.userRole === 'vendor') {
      return of(null);
    }
    return this.http.get(`${this.baseUrl}/showWishlist/${this.userID}`);
  }
  addToUserWishlist(body: Object): Observable<any> {
    if (!this.userID) {
      return of(null);
    }
    return this.http.post(`${this.baseUrl}/addWishlist/${this.userID}`, body);
  }
  deleteFromUserWishlist(body: Object): Observable<any> {
    if (!this.userID) {
      return of(null);
    }
    return this.http.post(
      `${this.baseUrl}/deleteWishlist/${this.userID}`,
      body
    );
  }

  // **********
  // Methods with observrs
  fetchUserWishlist(): void {
    this.getUserWishlist().subscribe((wishlistData) => {
      this.wishlist.next(wishlistData);
    });
  }
  getWishlistData(): Observable<any> {
    this.fetchUserWishlist();
    return this.wishlist.asObservable();
  }
  addItemToWishlist(body: Object): void {
    this.addToUserWishlist(body).subscribe(() => {
      this.fetchUserWishlist();
    });
  }

  deleteItemFromWishlist(body: Object): void {
    this.deleteFromUserWishlist(body).subscribe(() => {
      this.fetchUserWishlist();
    });
  }
}

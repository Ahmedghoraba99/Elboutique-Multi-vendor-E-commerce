import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = 'http://127.0.0.1:8000/api/customer';
  private userInfo = localStorage.getItem('user_info');
  private userID = this.userInfo ? JSON.parse(this.userInfo).id : null;
  
  constructor(private http: HttpClient) {}

  getUserWishlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/showWishlist/${this.userID}`);
  }
  addToUserWishlist(body: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/addWishlist/${this.userID}`, body);
  }
  deleteFromUserWishlist(body: Object): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/deleteWishlist/${this.userID}`,
      body
    );
  }
}

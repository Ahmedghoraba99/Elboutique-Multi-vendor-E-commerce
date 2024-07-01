import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentUser } from '../_model/customer'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class VendorPortofolioService {
  private vendoProducts = new BehaviorSubject<any>(null);
  private baseUrl = 'http://localhost:8000/api/product/vendor';
  private url ="http://localhost:8000/api/vendors"
  constructor(private http: HttpClient) {}

  getVendorProducts(vendorId: string): Observable<any> {
    this.fetchVendorProducts(vendorId).subscribe();
    return this.vendoProducts.asObservable();
  }

  private fetchVendorProducts(vendorId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${vendorId}`).pipe(
      tap((response) => {
        // console.log('response', response);
        this.vendoProducts.next(response);
      })
    );
  }

  getCurrentVendor(vendorId: number): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.url}/${vendorId}`);
  }
}

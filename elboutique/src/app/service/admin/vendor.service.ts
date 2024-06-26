import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = 'http://127.0.0.1:8000/api/vendors';
  constructor(private http: HttpClient, private authService: AuthService) {}
  token = this.authService.getToken();
  getVendors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateVendor(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/active/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  banVendor(id: number, banned: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/ban/${id}`);
  }
}

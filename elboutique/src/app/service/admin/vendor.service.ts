import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = 'http://127.0.0.1:8000/api/vendors';

  constructor(private http: HttpClient) {}

  getVendors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateVendor(id: number, active: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, { active, _method: 'put' });
  }

  banVendor(id: number, banned: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, { banned, _method: 'put' });
  }
}

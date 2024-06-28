import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://127.0.0.1:8000/api/vendors';
  constructor(private http: HttpClient, private authService: AuthService) {}
  token = this.authService.getToken();
  getVendorById(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
 
  updateVendor(id: number, vendorData: FormData): Observable<any> {
    console.log(vendorData);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '_method': 'PUT'
    });

    return this.http.post(`${this.apiUrl}/${id}`, vendorData, { headers });
  }
}
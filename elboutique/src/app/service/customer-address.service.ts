import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private apiUrl = 'http://127.0.0.1:8000/api/customeraddresses';

  constructor(private http: HttpClient) {}

  addAddress(address: any): Observable<any> {
    const customer_id = JSON.parse(localStorage.getItem('user_info') || '{}').id;
    const formData = { ...address, customer_id };

    return this.http.post<any>(this.apiUrl, formData);
  }
}

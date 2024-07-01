import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {VendorReceivables} from '../_model/vendor-receivables';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ReceivablesService {

  private apiUrl = 'http://127.0.0.1:8000/api/vendors/vendoreceivables';

  constructor(private http:HttpClient) { }

  getVendorReceivables(vendorId: number): Observable<VendorReceivables> {
    return this.http.get<VendorReceivables>(`${this.apiUrl}/${vendorId}`);
  }

}

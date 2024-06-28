import { Injectable } from '@angular/core';
import { HttpClient   } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class VendorProdcutService {
    private apiUrl = 'http://127.0.0.1:8000/api/product/vendor';
  constructor(private http: HttpClient, private authService: AuthService) {}
  token = this.authService.getToken();
  getVendorProducts(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
 
}
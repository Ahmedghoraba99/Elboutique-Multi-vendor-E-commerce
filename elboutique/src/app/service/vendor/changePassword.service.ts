import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorChangePassword {
  private apiUrl = 'http://127.0.0.1:8000/api/password/reset';


  constructor(private http: HttpClient, private authService: AuthService) {}

  changePassword(newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}`, { newPassword }, { headers });
  }
}

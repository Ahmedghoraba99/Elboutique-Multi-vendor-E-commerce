import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://127.0.0.1:8000/api/vendors';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getVendorById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateVendor(id: number, profileData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, profileData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.error && error.error.errors) {
        errorMessage = Object.values(error.error.errors).join(', ');
      } else {
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}

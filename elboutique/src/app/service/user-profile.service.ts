import { Injectable } from '@angular/core';
import { HttpClient ,HttpErrorResponse } from '@angular/common/http';
import { Observable ,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://127.0.0.1:8000/api/customers';
  constructor(private http: HttpClient) { }

  updateProfile(profileData: any,id:number): Observable<any> {
    const header = new Headers();
    header.append('Content-Type', 'form-data');
    header.append('Accept', 'application/json');
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData.hasOwnProperty(key)) {
        formData.append(key, profileData[key]);
      }
    }
    return this.http.post(`${this.apiUrl}/${id}?_method=PATCH`, formData).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      if (error.error && error.error.errors) {
        errorMessage = Object.values(error.error.errors).join(', ');
      } else {
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

}

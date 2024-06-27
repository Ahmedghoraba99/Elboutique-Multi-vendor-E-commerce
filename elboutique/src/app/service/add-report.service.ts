import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ReviewResponse} from '../_model/reviews'
import { catchError } from 'rxjs/operators';
import { AddReport} from '../_model/add-report';

@Injectable({
  providedIn: 'root'
})
export class AddReportService {

  private apiUrl = 'http://127.0.0.1:8000/api/report-reviews';
  constructor(private http: HttpClient) { }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }

  submitReport(report: AddReport): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, report, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

}

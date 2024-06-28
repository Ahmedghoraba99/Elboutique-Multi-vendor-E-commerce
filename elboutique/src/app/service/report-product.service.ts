import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddReport} from '../_model/add-report';

@Injectable({
  providedIn: 'root'
})
export class ReportProductService {

  private apiUrl = 'http://127.0.0.1:8000/api/report-products';
  constructor(private http: HttpClient) { }

  submitReport(report: AddReport): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, report, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }


}

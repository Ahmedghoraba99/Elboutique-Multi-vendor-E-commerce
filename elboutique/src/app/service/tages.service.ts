import { Injectable } from '@angular/core';
import {Tag} from '../_model/tag';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagesService {

  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http:HttpClient) { }

  getTagesProduct(id:number):Observable<Tag>{
    return this.http.get<Tag>(`${this.apiUrl}tages/product/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateProductTags(payload: { product_id: number; tag_ids: number[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}products/tages`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Result } from '../model/result';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post(url, params): Observable<Result> {
    return this.http.post(environment.apiUrl + url, params).pipe(
      tap((result: Result) => result),
      catchError(this.handleError<Result>('postData'))
    );
  }

  get(url): Observable<Result> {
    return this.http.get(url, {responseType: 'arraybuffer'}).pipe(
      tap((result: Result) => result),
      catchError(this.handleError<Result>('getData'))
    );
  }

  postBlob(url, params): Observable<any> {
    return this.http.post(environment.apiUrl + url, params, {responseType: 'arraybuffer'}).pipe(
      tap((result: any) => result),
      catchError(this.handleError<any>('postData'))
    );
  }

  uploadImage(url, formData): Observable <any> {
    return this.http.post(environment.apiUrl + url, formData).pipe(
      tap((result: any) => result),
      catchError(this.handleError<any>('postData'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(error as T);
    };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred.';
    if (err.error?.message) {
      message = err.error.message;
    } else if (err.message) {
      message = err.message;
    }
    return throwError(() => ({ message, status: err.status }));
  }
}

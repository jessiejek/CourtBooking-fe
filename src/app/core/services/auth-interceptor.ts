import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly token: TokenService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.token.getAccessToken();
    if (accessToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return next.handle(req);
  }
}

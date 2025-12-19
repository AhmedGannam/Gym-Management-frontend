// src/app/core/services/token.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private requestsInFlight = 0;
  constructor(private authService: AuthService, private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (this.requestsInFlight === 0 && req.method !== 'GET') {
      this.loader.show();
    }
    this.requestsInFlight++;
    const handle$ = token ? next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })) : next.handle(req);
    return handle$.pipe(
      finalize(() => {
        this.requestsInFlight--;
        if (this.requestsInFlight === 0) {
          this.loader.hide();
        }
      })
    );
  }
}
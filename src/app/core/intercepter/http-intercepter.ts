import { Injectable } from '@angular/core';
import { LoadingService } from '../service/loading.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class HttpIntercepter implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let contentType;
    if (request.url.includes('api/uploadFile')) {
      contentType = false;
    } else {
      contentType = 'application/json';
    }
    const header = {
      'Content-Type': contentType,
      'x-access-token': localStorage.getItem('id_token') == null ? '' : localStorage.getItem('id_token')
    };
    request = request.clone({
      setHeaders: header
    });
    return next.handle(request);
  }
}

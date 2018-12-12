import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../core/service/http.service';
import { API_URLS, ROUTER_URL, RESULT_CODE } from '../../core/const';

@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private router: Router,
    public httpService: HttpService
  ) {

  }

  canActivate() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigate(['/' + ROUTER_URL.login]);
      return false;
    }
    const formData = {
      url: this.router.url
    };
    this.httpService.post(API_URLS.getUserInfo, formData).subscribe(res => {
      if (res.code !== RESULT_CODE.success) {
        this.router.navigate(['/' + ROUTER_URL.login]);
      }
    });
    
    return true;
  }
}

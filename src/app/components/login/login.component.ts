import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { HttpService } from '../../core/service/http.service';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseCpnComponent implements OnInit {
  public userNameFormControl = new FormControl('', [
    Validators.required
  ]);
  public passWordFormControl = new FormControl('', [
    Validators.required
  ]);
  public loginFail: boolean = false;
  public loginFailMess: string = "";

  constructor(
    public httpService: HttpService,
    private router: Router,
    public translate: TranslateService
  ) {
    super(translate, 'login');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.vnext-form-control').keypress(function(e) {
      var c = e.key;
      if (c === "Enter") {
        $('.btn-enter').click();
      }
    });
  }

  doLogin(): void {
    const formData = {
      login_id: this.userNameFormControl.value,
      password: this.passWordFormControl.value
    };
    this.httpService.post(this.API_URLS.login, formData).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        localStorage.clear();
        localStorage.setItem('id_token', res.data['token']);
        localStorage.setItem('managerF', res.data['MANAGERF']);
        localStorage.setItem('SystemNo', res.data['SystemNo']);
        localStorage.setItem('Clerkname', res.data['CLERKNAME']);

        this.router.navigate(['/' + this.ROUTER_URL.customerSearch]);
      } else {
        if (res.code === this.RESULT_CODE.AUTH_FAIL) {
          this.loginFail = true;
          if (res.message === "OutOfDate") {
            this.loginFailMess = this.translate.instant("err_msg.loginOutofDate");
          }
          else {
            this.loginFailMess = this.translate.instant("err_msg.loginInfoIncorect");
          }
        }
      }
    });
  }

  clearErr(): void {
    this.loginFail = false;
  }

}

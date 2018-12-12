import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

import { API_URLS, ROUTER_URL, RESULT_CODE } from '../../core/const';
import { stringInject } from '../../core/common/stringInject';

@Component({
  selector: 'app-base-cpn',
  templateUrl: './base-cpn.component.html',
  styleUrls: ['./base-cpn.component.css']
})
export class BaseCpnComponent implements OnInit {
  public ROOT_URL = environment.webUrl;
  public API_URLS = API_URLS;
  public ROUTER_URL = ROUTER_URL;
  protected RESULT_CODE = RESULT_CODE;
  public requestResult = {
    err: false,
    msg: ''
  };

  constructor(
    public translate: TranslateService,
    private languageFolder: stringInject
  ) {
    this.translate.use(this.languageFolder + '/jp');
    this.translate.setDefaultLang(this.languageFolder + '/jp');
  }

  ngOnInit() {
  }

}

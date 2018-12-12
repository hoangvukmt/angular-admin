import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';

declare var $: any;
@Component({
  selector: 'app-analyzer-info',
  templateUrl: './analyzer-info.component.html',
  styleUrls: ['./analyzer-info.component.css']
})

export class AnalyzerInfoComponent extends BaseCpnComponent implements OnInit {
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {
    currentTab: 'tab-4',
    hasBack: true,
    backTitle: "未対応一覧",
    tabList: [
      { title: '家族別商品一覧', id: 'tab-1', url: this.ROUTER_URL.productsFamily },
      { title: 'カテゴリー別', id: 'tab-2', url: this.ROUTER_URL.productsCategory },
      { title: 'メッセージ', id: 'tab-3', url: this.ROUTER_URL.messageList },
      { title: '簡易診断', id: 'tab-4', url: 'no-url' },
      { title: '利用状況', id: 'tab-5', url: this.ROUTER_URL.historyInfo }
    ]
  }
  public customerInfo = {
    CustommerFullName: null,
    FamilyNo: null,
    IqCustomerNo: null,
    UserNo: null
  };
  public lsFamily = [];
  public messageContent = '';
  public messageData = '';
  public selectDisabled = false;
  public mapCheck = new Map();
  public iOS = false;
  public doneRequest = true;

  constructor(
    private toastr: ToastrService,
    public httpService: HttpService,
    public customerService: CustomerService,
    public translate: TranslateService
  ) {
    super(translate, 'analyzer-info');

    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }
  }

  ngOnInit() {
    this.loadData();
    this.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    if (isMac) {
      this.iOS = true;
    }
  }

  ngAfterViewChecked() {
    
  }

  loadData(): void {
    let objSearch = {
      user_no: this.customerInfo.UserNo
    }

    this.httpService.post(this.API_URLS.getKaniShindanInfo, objSearch).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsFamily = res.data;
        this.httpService.post(this.API_URLS.getCustomerInfo, objSearch).subscribe(res2 => {
          if (res2.code === this.RESULT_CODE.success) {
            if (res2.data.KaniShindanF === 2) {
              this.selectDisabled = false;
            }
            else if (res2.data.KaniShindanF === null || res2.data.KaniShindanF === 0 || res2.data.KaniShindanF === 1) {
              this.selectDisabled = true;
            }
          } else {
            console.log(res2);
            this.toastr.error('', 'ERROR');
          }
        });

      } else {
        console.log(res);
        this.toastr.error('', 'ERROR');
      }
    });
    
  }

  onChange(data, isCheck, name): void {
    if (this.mapCheck.has(data.FamilyNo + '-' + name)){
      this.mapCheck.delete(data.FamilyNo + '-' + name);
    }
    else {
      this.mapCheck.set(data.FamilyNo + '-' + name, isCheck);
    }
  }

  doSave(): void {
    if (this.doneRequest) {
      this.doneRequest = false;
      let objData = {
        user_no: this.customerInfo.UserNo,
        message: this.messageContent,
        data: this.lsFamily,
        tanto_name: localStorage.getItem('Clerkname')
      }
  
      this.httpService.post(this.API_URLS.updateKaniShindanInfo, objData).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          this.doneRequest = true;
          this.mapCheck = new Map();
          this.messageData = this.messageContent;
          this.selectDisabled = true;
          this.toastr.success('', '送信が完了しました。');
        } else {
          this.doneRequest = true;
          this.mapCheck = new Map();
          this.messageData = this.messageContent;
          console.log(res);
          this.toastr.error('', 'ERROR');
        }
      });
    }
  }
}

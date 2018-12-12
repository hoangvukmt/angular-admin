import {AfterViewInit, Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';

declare var $: any;
@Component({
  selector: 'app-products-category',
  templateUrl: './products-category.component.html',
  styleUrls: ['./products-category.component.css']
})
export class ProductsCategoryComponent extends BaseCpnComponent implements OnInit, AfterViewInit {
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {
    currentTab: 'tab-2',
    hasBack: true,
    backTitle: '顧客検索',
    tabList: [
      { title: '家族別商品一覧', id: 'tab-1', url: this.ROUTER_URL.productsFamily },
      { title: 'カテゴリー別', id: 'tab-2', url: 'no-url' },
      { title: 'メッセージ', id: 'tab-3', url: this.ROUTER_URL.messageList },
      { title: '簡易診断', id: 'tab-4', url: this.ROUTER_URL.analyzerInfo },
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
  public setHeight = false;

  constructor(
    public httpService: HttpService,
    public customerService: CustomerService,
    private router: Router,
    public translate: TranslateService
  ) {
    super(translate, 'products-category');
    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    let searchProduct = {
      user_no: this.customerInfo.UserNo
    }
    this.httpService.post(this.API_URLS.getListProductByUser, searchProduct).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsFamily = res.data;
      } else {
        console.log(res);
      }
    });
  }

  goProductDetail(id: number): void {
    localStorage.setItem('tab-back-to-page', this.router.url);
    localStorage.setItem('previousUrl', 'PC');
    this.router.navigate(['/' + this.ROUTER_URL.productDetail + "/" + id]);
  }

  strToArr(str): any {
    return JSON.parse(str);
  }

  ngAfterViewInit() {

  }
  ngAfterViewChecked() {
    if (!this.setHeight) {
      let lstTr = $("tr.itemBlance");
      for (let i = 0; i < lstTr.length; i++) {
        let item = lstTr[i];
        let lstTd = $(item).find("td");
        if (typeof lstTd[1] !== "undefined") {
          $(lstTd[0]).css('cssText' , 'height:' + $(lstTd[1]).height() + 'px !important;');
          this.setHeight = true;
        }
      }
    }
  }
}

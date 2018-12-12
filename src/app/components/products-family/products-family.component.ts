import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { ConfirmDialogComponent } from '../common/popup/confirm-dialog/confirm-dialog.component';
import { DateDiff } from '../../core/common/dateDiff';

import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-products-family',
  templateUrl: './products-family.component.html',
  styleUrls: ['./products-family.component.css']
})
export class ProductsFamilyComponent extends BaseCpnComponent implements OnInit {
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {
    currentTab: 'tab-1',
    hasBack: true,
    backTitle: localStorage.getItem('prev-page-tab') === "/messages-await" ? "未対応一覧" : "顧客検索",    
    tabList: [
      { title: '家族別商品一覧', id: 'tab-1', url: 'no-url' },
      { title: 'カテゴリー別', id: 'tab-2', url: this.ROUTER_URL.productsCategory },
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
  public iqSystem = localStorage.getItem('SystemNo') === "1" ? true : false;
  public asSystem = localStorage.getItem('SystemNo') === "2" ? true : false;
  public memoFormControl = new FormControl('', [
    Validators.required
  ]);
  public mapCheck = new Map();
  public memoData = '';

  constructor(
    public dialog: MatDialog,
    public dateDiff: DateDiff,
    private toastr: ToastrService,
    private router: Router,
    public httpService: HttpService,
    public customerService: CustomerService,
    public translate: TranslateService
  ) {
    super(translate, 'products-family');
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
        this.lsFamily = [];
        for (var i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          item.LifeData = JSON.parse(item.LifeData);
          item.MedicalData = JSON.parse(item.MedicalData);
          item.SavingsData = JSON.parse(item.SavingsData);
          item.CarData = JSON.parse(item.CarData);
          item.HouseData = JSON.parse(item.HouseData);
          item.SunData = JSON.parse(item.SunData);
          item.AirplaneData = JSON.parse(item.AirplaneData);
          item.OtherData = JSON.parse(item.OtherData);
          item.AutoData = JSON.parse(item.AutoData);

          if (item.FamilyNo === this.customerInfo.FamilyNo) {
            this.memoFormControl.setValue(item.Memo);
            this.memoData = item.Memo;
          }

          if (
            item.LifeData.length > 0 ||
            item.MedicalData.length > 0 ||
            item.SavingsData.length > 0 ||
            item.CarData.length > 0 ||
            item.HouseData.length > 0 ||
            item.SunData.length > 0 ||
            item.AirplaneData.length > 0 ||
            item.OtherData.length > 0 ||
            item.AutoData.length > 0
          ) {
            item.isOther = false;
            switch (item.Relation) {
              case 1:
              case 14:
              case 17:
                item.isMale = true;
                item.disableSex = true;
                break;
              case 2:
              case 15:
              case 18:
                item.isMale = false;
                item.disableSex = true;
                break;
              case 13:
                item.isMale = true;
                item.disableSex = false;
                break;
              case 16:
                item.isMale = true;
                item.disableSex = false;
                break;
              case 99:
                item.isMale = true;
                item.disableSex = false;
                item.isOther = true;
                break;
              default:
                if (item.Sex === '0') {
                  item.isMale = true;
                }
                else {
                  item.isMale = false;
                }
                item.disableSex = true;
                break;
            }

            this.lsFamily.push(item);
          }
        }
        if (this.lsFamily.length === 0) {
          for (var i = 0; i < res.data.length; i++) {
            let item = res.data[i];
            if (item.FamilyNo === this.customerInfo.FamilyNo) {
              this.memoFormControl.setValue(item.Memo);
              this.memoData = item.Memo;
              item.isOther = false;
              switch (item.Relation) {
                case 1:
                case 14:
                case 17:
                  item.isMale = true;
                  item.disableSex = true;
                  break;
                case 2:
                case 15:
                case 18:
                  item.isMale = false;
                  item.disableSex = true;
                  break;
                case 13:
                  item.isMale = true;
                  item.disableSex = false;
                  break;
                case 16:
                  item.isMale = true;
                  item.disableSex = false;
                  break;
                case 99:
                  item.isMale = true;
                  item.disableSex = false;
                  item.isOther = true;
                  break;
                default:
                  if (item.Sex === '0') {
                    item.isMale = true;
                  }
                  else {
                    item.isMale = false;
                  }
                  item.disableSex = true;
                  break;
              }
              this.lsFamily.push(item);
              break;
            }
          }
        }
      } else {
        console.log(res);
      }
    });
  }

  doBack(): void {
    this.router.navigate(['/' + this.ROUTER_URL.customerSearch]);
  }

  goProductDetail(id: number): void {
    localStorage.setItem('tab-back-to-page', this.router.url);
    localStorage.setItem('previousUrl', 'PF');
    this.router.navigate(['/' + this.ROUTER_URL.productDetail + "/" + id]);
  }

  caculatorAge(birthday): string {
    return this.dateDiff.diffYears(new Date(birthday), new Date()) + this.translate.instant("age");
  }

  calculatorAges(birthday): string {
    return (moment().diff(birthday, 'years', false)) + '歳'
  }

  doSaveMemo(): void {
    if (this.memoFormControl.value === "") {
      this.toastr.warning('', this.translate.instant("message.memoNotNull"));
      $("#memoInfo").focus();
      return;
    }

    let objUpdate = {
      user_no: this.customerInfo.UserNo,
      memo: this.memoFormControl.value
    };
    this.httpService.post(this.API_URLS.updateCustomer, objUpdate).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.toastr.success('', this.translate.instant("message.updateSuccess"));
      }
      else {
        this.toastr.error('', this.translate.instant("message.err"));
      }
    });
  }

  doSendSystem(): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmIQ") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        let lsKeiAdd = [];
        this.mapCheck.forEach((value, key) => {
          lsKeiAdd.push(value);
        });
        let objData = {
          user_no: this.customerInfo.UserNo,
          iq_customer_no: this.customerInfo.IqCustomerNo,
          list_kei: lsKeiAdd
        }
        this.httpService.post(this.API_URLS.sendKeiToSystem, objData).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            this.toastr.success('', this.translate.instant("message.sendSuccess"));
            this.loadData();
          }
          else {
            this.toastr.error('', this.translate.instant("message.err"));
          }
        });
      }
    });
  }

  doRemove(): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        let objDelete = {
          user_no: this.customerInfo.UserNo
        };
        this.httpService.post(this.API_URLS.deleteCustomer, objDelete).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            this.toastr.success('', this.translate.instant("message.deleteSuccess"));
            this.doBack();
          }
          else {
            this.toastr.error('', this.translate.instant("message.err"));
          }
        });
      }
    });
  }

  convertToMoney(kei, type): string {
    if (type === 1) {
      if (kei.Money !== "") {
        let strMoney = "";
        strMoney += kei.Money.replace(this.translate.instant("money"), '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + kei.ForeignFName;
        return strMoney;
      }
    }
    else {
      if (kei.HokenP !== "") {
        return kei.HokenP.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + kei.CurrencyFName;
      }
    }
    return "";
  }

  chageCheck(item): void {
    if (item.isCheck) {
      this.mapCheck.set(item.KeiyakuNo, {
        KeiyakuNo: item.KeiyakuNo
      });
    }
    else {
      if (this.mapCheck.has(item.KeiyakuNo)) {
        this.mapCheck.delete(item.KeiyakuNo);
      }
    }
  }

}

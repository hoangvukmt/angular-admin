import { HttpService } from '../../../../core/service/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { API_URLS, ROUTER_URL, RESULT_CODE } from '../../../../../app/core/const';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-select-item-common",
  templateUrl: "./select-item-common.component.html",
  styleUrls: ["./select-item-common.component.css"]
})
export class SelectItemCommonComponent implements OnInit {
  protected API_URLS = API_URLS;
  public ROUTER_URL = ROUTER_URL;
  protected RESULT_CODE = RESULT_CODE;
  public requestResult = {
    err: false,
    msg: ""
  };
  listData = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SelectItemCommonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    public httpService: HttpService
  ) {}

  ngOnInit() {
    if (this.data.category === 'AGENCY') {
      this.callApiGetAgent();
      return;
    }
    if (this.data.category === 'INSURANCY-TYPE') {
      this.callApiGetProduct();
      return;
    }
    if (this.data.category === 'HOSHO') {
      this.callApiGetListHosho();
      return;
    }
    if (this.data.category === 'TOKUYAKU') {
      this.callApiGetListTokuyaku();
      return;
    }
    this.callApiGetCompany();
  }

  doHandle(): void {
    this.dialogRef.close({ key: "HANDLE" });
  }

  chooseOption(i): void {
    this.dialogRef.close(this.listData[i]);
  }

  callApiGetListHosho() {
    const formData = {
      company_cd: this.data.companyCd,
      product_cd: this.data.productCd,
      hosho_category_f: this.data.hoshoCategoryF,
      type: this.data.shukeiyaku ? "SHU" : "TO"
      //category_cd: this.data.categoryCd
    };

    this.httpService.post(this.API_URLS.getListHosho, formData).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.listData = res.data;
        if (this.listData.length === 0) {
          this.dialogRef.close({ key: 'HANDLE' });
        }
      } else {
        console.log(res);
        this.dialogRef.close({ key: 'HANDLE' });
        this.toastr.error('', res.message);
      }
    });
  }

  callApiGetListTokuyaku() {
    const formData = {
      company_cd: this.data.companyCd,
      product_cd: this.data.productCd,
      category_cd: this.data.categoryCd,
      category_f: this.data.categoryF
    };

    this.httpService.post(this.API_URLS.getListTokuyaku, formData).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.listData = res.data;
        if (this.listData.length === 0) {
          this.dialogRef.close({ key: 'HANDLE' });
        }
      } else {
        console.log(res);
        this.dialogRef.close({ key: 'HANDLE' });
        this.toastr.error('', res.message);
      }
    });
  }

  callApiGetAgent() {
    this.httpService.post(this.API_URLS.getCustomerAgent, { user_no: this.data.userNo }).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.listData = res.data;
      } else {
        console.log(res);
        this.toastr.error('', res.message);
      }
    });
  }

  callApiGetCompany() {
    this.httpService.post(this.API_URLS.getListCompany, { company_cd: null }).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.listData = res.data;
      } else {
        console.log(res);
        this.toastr.error('', res.message);
      }
    });
  }

  callApiGetProduct() {
    this.httpService.post(this.API_URLS.getListProduct, { company_cd: this.data.company_cd }).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.listData = res.data;
      } else {
        console.log(res);
        this.toastr.error('', res.message);
      }
    });
  }

  closePopup() {
    this.dialogRef.close();
  }
}

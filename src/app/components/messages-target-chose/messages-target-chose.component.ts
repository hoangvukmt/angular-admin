import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { UploadImageComponent } from '../common/popup/upload-image/upload-image.component';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';
import { ConfirmDialogComponent } from '../common/popup/confirm-dialog/confirm-dialog.component';
import { HttpService } from '../../core/service/http.service';
import { environment } from './../../../environments/environment';
import { CONST_CODE } from "../../core/const";

declare var $: any;
@Component({
  selector: 'app-messages-target-chose',
  templateUrl: './messages-target-chose.component.html',
  styleUrls: ['./messages-target-chose.component.css']
})
export class MessagesTargetChoseComponent extends BaseCpnComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public objMenu = {
    currentMenu: 'menu-2'
  }
  public objTab = {
    currentTab: 'tab-1',
    hasBack: true,
    backToPage: true,
    backTitle: 'ターゲット一覧',
    tabList: [
      { title: 'ターゲット選択', id: 'tab-1', url: 'no-url' }
    ]
  }
  public lsHoshoCategory = [];
  public targetCount = 0;

  public targetF = '0';
  public targetMen = false;
  public targetWomen = false;
  public targetMarriage = false;
  public targetSingle = false;
  public targetHasChild = false;
  public targetNoChild = false;
  public targetAge20 = false;
  public targetAge30 = false;
  public targetAge40 = false;
  public targetAge50 = false;
  public targetAge60 = false;

  public kanyuShiteiF = '0';
  public kanyuF = '';

  public kikanF = '0';
  public kikanDaysAllDay = "";
  public kikanDaysOneDay = "";

  public dataModel = {
    KanyuHoshoCategoryF: null,
    MessageTitle: '',
    Message: '',
    GroupID: 0
  }
  public lsImages = [];
  public totalImageSize = 0;
  public lsUserSend = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    public httpService: HttpService,
    public translate: TranslateService
  ) {
    super(translate, 'messages-target-chose');

    var formData = {
      sel_type: 3
    };
    this.httpService.post(this.API_URLS.getSelectItem, formData).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsHoshoCategory = res.data;
      } else {
        console.log(res);
      }
    });
  }

  ngOnInit() {
    
  }

  loadImage(): void {
    this.totalImageSize = 0;
    let objSearch = {
      group_id: this.dataModel.GroupID
    }
    this.httpService.post(this.API_URLS.getListFileUpload, objSearch).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsImages = res.data;
      } else {
        this.requestResult.err = true;
        this.requestResult.msg = res.message;
      }
    });
  }

  targetChoose(): void {
    if (this.targetF === '0') {
      this.targetMen = false;
      this.targetWomen = false;
      this.targetMarriage = false;
      this.targetSingle = false;
      this.targetHasChild = false;
      this.targetNoChild = false;
      this.targetAge20 = false;
      this.targetAge30 = false;
      this.targetAge40 = false;
      this.targetAge50 = false;
      this.targetAge60 = false;
    }
  }

  kanyuShiteiChoose(): void {
    if (this.kanyuShiteiF === '0') {
      this.kanyuF = '';
      this.dataModel.KanyuHoshoCategoryF = null;
    }
  }

  doBack(): void {
    this.router.navigate(['/' + this.ROUTER_URL.messagesTarget]);
  }

  doSend(): void {
    if (this.targetCount === 0) {
      this.toastr.warning('', this.translate.instant("message.targetNull"));
      return;
    }
    if (this.dataModel.MessageTitle === null || this.dataModel.MessageTitle === "") {
      this.toastr.warning('', this.translate.instant("message.messageTitleNotNull"));
      $("#MessageTitle").focus();
      return;
    }
    if (this.dataModel.Message === null || this.dataModel.Message === "") {
      this.toastr.warning('', this.translate.instant("message.messageNotNull"));
      $("#Message").focus();
      return;
    }
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmSend") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        let objData = this.getFormData();
        objData["ls_send"] = this.lsUserSend;
        if (objData !== null) {
          this.httpService.post(this.API_URLS.createHaishinlog, objData).subscribe(res => {
            if (res.code === this.RESULT_CODE.success) {
              this.toastr.success('', this.translate.instant("message.actionSuccess"));
              this.router.navigate(['/' + this.ROUTER_URL.messagesTarget]);
            } else {
              console.log(res);
              this.toastr.warning('', this.translate.instant("message.err"));
            }
          });
        }
      }
    });
  }

  doAttach(): void {
    if (this.lsImages.length >= 5) {
      this.toastr.warning('', this.translate.instant("message.imageLimited"));
      return;
    }
    const _thiscpn = this;
    const dialogUpload = this.dialog.open(UploadImageComponent, {
      width: '400px',
      data: { totalSize: this.totalImageSize, fileFilter: CONST_CODE.imageUpload },
      panelClass: []
    });
    dialogUpload.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        let fileUpload = result.data;
        let formData = new FormData();
        formData.append('group_id', this.dataModel.GroupID.toString());
        formData.append('file_img', fileUpload);
        
        const enviURL = environment.apiUrl;
        $.ajax({
          url : enviURL + _thiscpn.API_URLS.haishinLogUpload,
          type: 'POST',
          dataType: 'json',
          data: formData,
          cache : false,
          processData: false,
          contentType: false,
          headers: {
            'x-access-token': localStorage.getItem('id_token') == null ? '' : localStorage.getItem('id_token')
          }
        }).done(function(response) {
          if (_thiscpn.dataModel.GroupID === 0) {
            _thiscpn.dataModel.GroupID = response.data;
          }
          _thiscpn.loadImage();
          _thiscpn.toastr.success('', _thiscpn.translate.instant("message.uploadSuccess"));
        });
      }
    });
  }

  doCaculator(): void {
    let objData = this.getFormData();
    if (objData !== null) {
      let objSearch = {
        target_sex: null,
        marriage_f: null,
        haschild_f: null,
        target_age: null,

        kanyushite_f: null,
        kanyuhoshocategory_f: null,
        kanyu_f: null,

        kikan_f: null,
        kikan_days: null
      }

      if (objData.target_f !== 0) {
        if (objData.target_sex !== null) {
          objSearch.target_sex = objData.target_sex;
        }

        if (objData.marriage_f !== null) {
          objSearch.marriage_f = objData.marriage_f;
        }

        if (objData.haschild_f !== null) {
          objSearch.haschild_f = objData.haschild_f;
        }

        if (objData.target_age !== null) {
          objSearch.target_age = objData.target_age;
        }
      }

      if (objData.kanyushite_f !== 0) {
        objSearch.kanyushite_f = objData.kanyushite_f;
        objSearch.kanyuhoshocategory_f = objData.kanyuhoshocategory_f;
        objSearch.kanyu_f = objData.kanyu_f;
      }

      if (objData.kikan_f !== 0) {
        objSearch.kikan_f = objData.kikan_f;
        objSearch.kikan_days = objData.kikan_days;
      }

      this.httpService.post(this.API_URLS.searchTargetCustomer, objSearch).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          this.targetCount = res.data.length;
          this.lsUserSend = res.data;
          console.log(this.lsUserSend);
          this.toastr.success('', this.translate.instant("message.caculatorSuccess"));
        } else {
          console.log(res);
          this.toastr.warning('', this.translate.instant("message.err"));
        }
      });
    }
  }

  viewImage(data, type): void {
    const dialogView = this.dialog.open(ViewImageComponent, {
      width: '800px',
      data: { type: type, data: data },
      panelClass: []
    });
    dialogView.afterClosed().subscribe(result => {
      
    });
  }

  getFormData() {
    if (this.targetF === '1') {
      if (
        !this.targetMen && !this.targetWomen && 
        !this.targetMarriage && !this.targetSingle &&
        !this.targetHasChild && !this.targetNoChild &&
        !this.targetAge20 && !this.targetAge30 && !this.targetAge40 && !this.targetAge50 && !this.targetAge60
      ) {
        this.toastr.warning('', this.translate.instant("message.targetNotNull"));
        return null;
      }
    }
    if (this.kanyuShiteiF === '1') {
      if (this.dataModel.KanyuHoshoCategoryF === null || this.dataModel.KanyuHoshoCategoryF === "") {
        this.toastr.warning('', this.translate.instant("message.kanyuHoshoCategoryNotNull"));
        $("#kanyuHoshoCategoryF").focus();
        return null;
      }
      if (this.kanyuF === '') {
        this.toastr.warning('', this.translate.instant("message.kanyuNotNull"));
        return null;
      }
    }
    if (this.kikanF === '2' && (this.kikanDaysAllDay === null || this.kikanDaysAllDay === "")) {
      this.toastr.warning('', this.translate.instant("message.kikanDaysAllDayNotNull"));
      $("#kikanDaysAllDay").focus();
      return null;
    }
    if (this.kikanF === '1' && (this.kikanDaysOneDay === null || this.kikanDaysOneDay === "")) {
      this.toastr.warning('', this.translate.instant("message.kikanDaysOneDayNotNull"));
      $("#kikanDaysOneDay").focus();
      return null;
    }

    let targetAge = 0;
    if (this.targetAge20) {
      targetAge += 1;
    }
    if (this.targetAge30) {
      targetAge += 2;
    }
    if (this.targetAge40) {
      targetAge += 4;
    }
    if (this.targetAge50) {
      targetAge += 8;
    }
    if (this.targetAge60) {
      targetAge += 16;
    }
    let objData = {
      target_f: parseInt(this.targetF),
      target_sex: this.targetF === '0' ? null : (this.targetMen && this.targetWomen ? 2 : (this.targetMen ? 0 : (this.targetWomen ? 1 : null))),
      marriage_f: this.targetF === '0' ? null : (this.targetMarriage && this.targetSingle ? 2 : (this.targetMarriage ? 0 : (this.targetSingle ? 1 : null))),
      haschild_f: this.targetF === '0' ? null : (this.targetHasChild && this.targetNoChild ? 2 : (this.targetHasChild ? 0 : (this.targetNoChild ? 1 : null))),
      target_age: this.targetF === '0' ? null : (targetAge === 0 ? null : targetAge),
      kanyushite_f: parseInt(this.kanyuShiteiF),
      kanyu_f: this.kanyuF === '' ? null : parseInt(this.kanyuF),
      kanyuhoshocategory_f: this.dataModel.KanyuHoshoCategoryF,
      kikan_f: parseInt(this.kikanF),
      kikan_days: this.kikanF === '0' ? null : (this.kikanF === '1' ? parseInt(this.kikanDaysOneDay) : parseInt(this.kikanDaysAllDay)),
      target_count: this.targetCount,
      message_title: this.dataModel.MessageTitle,
      message: this.dataModel.Message,
      group_id: this.dataModel.GroupID,
      tanto_name: localStorage.getItem('Clerkname')
    }

    return objData;
  }

  removeImage(image): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        let objData = {
          group_id: image.GroupID,
          file_id: image.FileID
        }
        this.httpService.post(this.API_URLS.deleteFileUpload, objData).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            this.loadImage();
            this.toastr.success('', this.translate.instant("message.deleteSuccess"));
          } else {
            console.log(res);
            this.toastr.warning('', this.translate.instant("message.err"));
          }
        });
      }
    });
  }

  loadFileContent(args): void {
    this.httpService.get(args.src).subscribe(res => {
      this.totalImageSize += res['byteLength']/1024/1024;
    });
  }

  kikanFChoose(): void {
    if (this.kikanF === '0') {
      this.kikanDaysAllDay = "";
      this.kikanDaysOneDay = "";
    }
    else if (this.kikanF === '2') {
      this.kikanDaysOneDay = "";
    }
    else {
      this.kikanDaysAllDay = "";
    }
  }

}

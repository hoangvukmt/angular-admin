import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { UploadImageComponent } from '../common/popup/upload-image/upload-image.component';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';
import { ConfirmDialogComponent } from '../common/popup/confirm-dialog/confirm-dialog.component';
import { environment } from "../../../environments/environment";
import { Ultils } from "../../core/common/ultils";
import { DatePipe } from '../../../../node_modules/@angular/common';
import { CONST_CODE } from "../../core/const";

declare var $: any;
@Component({
  selector: 'app-message-send',
  templateUrl: './message-send.component.html',
  styleUrls: ['./message-send.component.css'],
  providers: [DatePipe]
})
export class MessageSendComponent extends BaseCpnComponent implements OnInit {
  public menu: number;
  public objMenu = {};
  public objTab = {};
  public customerInfo = {
    CustommerFullName: null,
    FamilyNo: null,
    IqCustomerNo: null,
    UserNo: null
  };
  public messageModel = {
    message_no: 0,
    parent_message_no: 0,
    user_no: 0,
    message_type: 0,
    message_title: "",
    message: "",
    icon_number: 1
  }
  public lsFiles = [];
  public totalImageSize = 0;
  public uploadCount = 0;

  constructor(
    private datePipe: DatePipe,
    public ultils: Ultils,
    public httpService: HttpService,
    public customerService: CustomerService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
    super(translate, 'message-send');

    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }

    this.route.params.subscribe(paramsId => {
      this.messageModel.parent_message_no = Number(paramsId.id);
      this.messageModel.message_type = Number(paramsId.type);
    });
    this.messageModel.user_no = this.customerInfo.UserNo;
  }

  ngOnInit() {
    this.menu = +this.route.snapshot.data['menu'];
    if (this.menu === 1) {
      this.objMenu = {
        currentMenu: 'menu-1',
      }
    }
    else {
      this.objMenu = {
        currentMenu: 'menu-2',
      }
    }
    this.objTab = {
      currentTab: 'tab-1',
      hasBack: true,
      backToPage: true,
      backTitle: "メッセージ",
      tabList: [
        { title: 'メッセージ一入力', id: 'tab-1', url: 'no-url' }
      ]
    }
    if (localStorage.getItem('message-title-default') !== null) {
      this.messageModel.message_title = localStorage.getItem('message-title-default');
      localStorage.removeItem('message-title-default');
    }
  }

  doSave(): void {
    if (this.messageModel.message_title === null || this.messageModel.message_title === "") {
      this.toastr.warning('', this.translate.instant("message.titleNotNull"));
      $("#messageTitle").focus();
      return;
    }
    if (this.messageModel.message === null || this.messageModel.message === "") {
      this.toastr.warning('', this.translate.instant("message.messageNotNull"));
      $("#messageContent").focus();
      return;
    }
    if (this.messageModel.message_type === 2) {
      let hasPdf = false;
      for (let i = 0; i < this.lsFiles.length; i++) {
        let fileChose = this.lsFiles[i];
        if (fileChose.name.match(/\.(pdf)$/)) {
          hasPdf = true;
          break;
        }
      }
      if (!hasPdf) {
        this.toastr.warning('', this.translate.instant("message.pdfRequired"));
        return;
      }
    }

    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { message: this.translate.instant("confirmSend") },
      panelClass: []
    });

    const _thiscpn = this;

    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        this.httpService.post(this.API_URLS.sendMessage, this.messageModel).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            let messageId = res.data;
            if (this.lsFiles.length > 0) {
              for (var i = 0; i < this.lsFiles.length; i++) {
                let fileUpload = this.lsFiles[i];

                let formData = new FormData();
                formData.append('user_no', this.customerInfo.UserNo);
                formData.append("message_no", messageId.toString());
                formData.append("file_img", fileUpload);
                formData.append("tanto_name", localStorage.getItem('Clerkname'));

                const enviURL = environment.apiUrl;
                $.ajax({
                  url: enviURL + _thiscpn.API_URLS.messageImageUpload,
                  type: "POST",
                  dataType: "json",
                  data: formData,
                  cache: false,
                  processData: false,
                  contentType: false,
                  headers: {
                    "x-access-token": localStorage.getItem("id_token") == null ? "" : localStorage.getItem("id_token")
                  }
                }).done(function(response) {
                  _thiscpn.uploadCount++;
                  if (_thiscpn.lsFiles.length === _thiscpn.uploadCount) {
                    _thiscpn.toastr.success("", _thiscpn.translate.instant("message.sendSuccess"));
                    if (_thiscpn.menu === 2) {
                      _thiscpn.router.navigate([localStorage.getItem("tab-back-to-page")]);
                    } else {
                      if (_thiscpn.messageModel.message_type === 1) {
                        _thiscpn.router.navigate(["/" + _thiscpn.ROUTER_URL.analyzerInfo]);
                      }
                      else {
                        _thiscpn.router.navigate(["/" + _thiscpn.ROUTER_URL.messageList]);
                      }
                    }
                  }
                });
              }
            } else {
              _thiscpn.toastr.success("", _thiscpn.translate.instant("message.sendSuccess"));
              if (_thiscpn.menu === 2) {
                _thiscpn.router.navigate([localStorage.getItem("tab-back-to-page")]);
              } else {
                if (_thiscpn.messageModel.message_type === 1) {
                  _thiscpn.router.navigate(["/" + _thiscpn.ROUTER_URL.analyzerInfo]);
                }
                else {
                  _thiscpn.router.navigate(["/" + _thiscpn.ROUTER_URL.messageList]);
                }
              }
            }
          } else {
            this.toastr.error("", this.translate.instant("message.err"));
          }
        });
      }
    });
  }

  doBack(): void {
    this.router.navigate([localStorage.getItem('tab-back-to-page')]);
  }

  doAttach(): void {
    if (this.lsFiles.length >= 5) {
      this.toastr.warning('', this.translate.instant("message.imageLimited"));
      return;
    }
    const dialogUpload = this.dialog.open(UploadImageComponent, {
      width: '400px',
      data: { totalSize: this.totalImageSize, fileFilter: this.messageModel.message_type === 2 ? CONST_CODE.imagePdf : CONST_CODE.imageUpload },
      panelClass: []
    });
    dialogUpload.afterClosed().subscribe(result => {      
      if (typeof result !== "undefined" && result.action !== "close") {
        this.lsFiles.push(result.data);
        this.toastr.success('', this.translate.instant("message.uploadSuccess"));

        const fileSize = result.data.size/1024/1024;
        this.totalImageSize += fileSize;
      }
    })
  }

  genFileName(): string {
    return '画像' + this.datePipe.transform(new Date(), 'yyyyMMddHHmm')
  }

  genImage(filePreview, index): void {
    const fileSize = filePreview.size/1024/1024;
    if (fileSize <= 5) {
      (window as any).loadImage('#messageImg' + index, filePreview, this.ROOT_URL);
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

  removeImage(index): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        const fileSize = this.lsFiles[index].size/1024/1024;
        this.totalImageSize -= fileSize;

        this.lsFiles.splice(index, 1);
      }
    });
  }
  
}


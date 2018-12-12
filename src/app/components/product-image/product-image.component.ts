import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { environment } from './../../../environments/environment';
import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { UploadImageComponent } from '../common/popup/upload-image/upload-image.component';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';
import { ConfirmDialogComponent } from '../common/popup/confirm-dialog/confirm-dialog.component';
import { CONST_CODE } from "../../core/const";

declare var $: any;
@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent extends BaseCpnComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public id: number;
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {};
  public customerInfo = {
    CustommerFullName: null,
    FamilyNo: null,
    IqCustomerNo: null,
    UserNo: null
  };
  public lsImages = [];
  public lsImagesRelation = [];
  public totalImageSize = 0;

  public previousUrl = ''

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public httpService: HttpService,
    public customerService: CustomerService,
    public translate: TranslateService
  ) {
    super(translate, 'product-image');
    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }

    this.route.params.subscribe(paramsId => {
      this.id = Number(paramsId.id);
    });

    if (localStorage.getItem('previousUrl') == 'PC') {
      this.previousUrl = "カテゴリー別"
    } else if (localStorage.getItem('previousUrl') == 'PF') {
      this.previousUrl = "家族別商品一覧"
    }

    this.objTab = {
      currentTab: 'tab-2',
      hasBack: true,
      backToPage: true,
      backTitle: this.previousUrl,
      tabList: [
        { title: '商品情報詳細', id: 'tab-1', url: this.ROUTER_URL.productDetail + "/" + this.id },
        { title: '画像一覧', id: 'tab-2', url: 'no-url' }
      ]
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.totalImageSize = 0;
    let searchImage = {
      user_no: this.customerInfo.UserNo,
      keiyaku_no: this.id
    };
    this.httpService.post(this.API_URLS.getListImage, searchImage).subscribe(res => {      
      if (res.code === this.RESULT_CODE.success) {
        let dataReturn = res.data[0];
        this.lsImages = JSON.parse(dataReturn.Images)
        this.lsImagesRelation = JSON.parse(dataReturn.ImageRelation)
      } else {
        console.log(res);
      }
    });
  }

  doBack(): void {
    this.router.navigate(["/" + this.ROUTER_URL.productDetail + "/" + this.id]);
  }

  doUpload(): void {
    if (this.lsImagesRelation.length >= 5) {
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
        formData.append('user_no', this.customerInfo.UserNo);
        formData.append('file_img', fileUpload);
        
        const enviURL = environment.apiUrl;
        $.ajax({
          url : enviURL + _thiscpn.API_URLS.uploadFileRelation,
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
          _thiscpn.loadData();
          _thiscpn.toastr.success('', _thiscpn.translate.instant("message.uploadSuccess"));
        });
      }
    });
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

  loadRelation(args): void {
    this.httpService.get(args.src).subscribe(res => {
      this.totalImageSize += res['byteLength']/1024/1024;
    });
  }

  removeImage(lsFiles, index): void {    
    let objFile;
    let flag: boolean;
    if (typeof(lsFiles[index].GroupID) !="undefined") {    
      objFile = {
        group_id: lsFiles[index].GroupID,
        file_id: lsFiles[index].FileID      
      };
      flag = true;      
    } else {
      objFile = {
        user_no: lsFiles[index].UserNo,
        file_name: lsFiles[index].FileName      
      };
      flag = false;
    }
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result.action !== "close") {
        const fileSize = lsFiles[index].size/1024/1024;
        this.totalImageSize -= fileSize;

        lsFiles.splice(index, 1);
        
        if (flag) { 
          this.kanriDeleteFile(this.API_URLS.deleteFileUpload, objFile);
        } else {
          this.kanriDeleteFile(this.API_URLS.deleteFileRelationUpload, objFile);
        }
      }    
    });
  }

  kanriDeleteFile(api_urls, objFile): void {
    this.httpService.post(api_urls, objFile).subscribe(res => {      
      if (res.code === this.RESULT_CODE.success) {
      } else {
        console.log(res);
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { environment } from './../../../environments/environment';
import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent extends BaseCpnComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {
    currentTab: 'tab-3',
    hasBack: true,
    tabList: [
      { title: '家族別商品一覧', id: 'tab-1', url: this.ROUTER_URL.productsFamily },
      { title: 'カテゴリー別', id: 'tab-2', url: this.ROUTER_URL.productsCategory },
      { title: 'メッセージ', id: 'tab-3', url: 'no-url' },
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
  public lsMessages = [];
  public expanded = [];

  constructor(
    public httpService: HttpService,
    public customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog,
    public translate: TranslateService
  ) {
    super(translate, 'message-list');

    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }       
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    let objSearch = {
      user_no: this.customerInfo.UserNo
    };
    this.httpService.post(this.API_URLS.getListMessage, objSearch).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsMessages = res.data;
      }
      else {
        console.log(res)
      }
    });
  }

  goToSendMessage(message): void {
    localStorage.setItem('tab-back-to-page', this.router.url);
    this.router.navigate(['/' + this.ROUTER_URL.messageSend + "/" + message.MessageType + "/" + message.MessageNo]);
  }

  strToArr(str): any {
    let arrReturn = JSON.parse(str.replace(/(\r\n\t|\n|\r\t)/gm,"<br />").replace(/&lt;br \/&gt;/g, "<br />"));
    return arrReturn;
  }

  viewImage(fileId): void {
    const dialogView = this.dialog.open(ViewImageComponent, {
      width: '800px',
      data: { type: "message", data: fileId },
      panelClass: []
    });
    dialogView.afterClosed().subscribe(result => {
      
    });  
  }

  toggle(i): void{
    this.expanded[i] = !this.expanded[i];    
  }

  viewPdf(ResultPath): void {
    const formData = {
      file_name: ResultPath
    };

    this.httpService.postBlob(this.API_URLS.getFilePdf, formData).subscribe(res => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { environment } from './../../../environments/environment';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { HttpService } from '../../core/service/http.service';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent extends BaseCpnComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public id: number;
  public objMenu = {
    currentMenu: 'menu-2',
  }
  public objTab = {
    currentTab: 'tab-1',
    hasBack: true,
    backToPage: true,
    backTitle: "未対応一覧",
    tabList: [
      { title: 'メッセージ内容', id: 'tab-1', url: 'no-url' }
    ]
  }
  public lsMessages = [];
  public expanded = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public httpService: HttpService,
    public dialog: MatDialog,
    public translate: TranslateService
  ) {
    super(translate, 'message-detail');

    this.route.params.subscribe(paramsId => {
      this.id = Number(paramsId.id);
    });
  }

  ngOnInit() {
    localStorage.setItem('tab-back-to-page', this.ROUTER_URL.messagesAwait);
    this.loadData();
  }

  loadData(): void {
    let objSearch = {
      message_no: this.id
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
    let customerSelect = {
      CustommerFullName: null,
      FamilyNo: null,
      UserNo: message.UserNo,
      IqCustomerNo: null
    };
    localStorage.setItem('cus-select', JSON.stringify(customerSelect));
    localStorage.setItem('tab-back-to-page', this.router.url);
    this.router.navigate(['/' + this.ROUTER_URL.messageReply + "/" + message.MessageType + "/" + message.MessageNo]);
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

  doBack(): void{
    this.router.navigate(['/' + this.ROUTER_URL.messagesAwait]);
  }

  strToArr(str): any {
    return JSON.parse(str.replace(/(\r\n\t|\n|\r\t)/gm,"<br />").replace(/&lt;br \/&gt;/g, "<br />"));
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid/main";
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Ultils } from '../../core/common/ultils';
import { DateDiff } from '../../core/common/dateDiff';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { GridCommonComponent } from '../common/grid-common/grid-common.component';
import { MatDatepicker } from '../../../../node_modules/@angular/material';
import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { TableMessageAwaitService } from '../../core/service/table-message-await.service';

@Component({
  selector: 'app-messages-await',
  templateUrl: './messages-await.component.html',
  styleUrls: ['./messages-await.component.css'],
  providers: [DatePipe]
})
export class MessagesAwaitComponent extends BaseCpnComponent implements OnInit {
  public objMenu = {
    currentMenu: 'menu-2',
  }
  public objTab = {
    currentTab: 'tab-1',
    hasBack: false,
    tabList: [
      { title: '未対応一覧', id: 'tab-1', url: 'no-url' },
      { title: 'ターゲット一覧', id: 'tab-2', url: this.ROUTER_URL.messagesTarget }
    ]
  }
  public gridOptions: GridOptions;
  public paramInfo = {
    id: "messageAwaitTable",
    style: {'height': '350px'},
    apiUrl: this.API_URLS.searchMessage,
    objSearch: {
      from_date: null,
      to_date: null,
      irai_naiyou: "",
      taiou_joukyou: ",0,",
      dairi_ten: "",
      filter: [],
      sort: [],
      page: 1,
      pageSize: 20
    }
  }
  public supportOption = {
    option1: true,
    option2: false
  }
  public messageTypeOption = {
    option1: false,
    option2: false,
    option3: false
  }
  @ViewChild('tableResult') tableResult: GridCommonComponent;
  @ViewChild('fromDate') fromDate: MatDatepicker<Date>;
  @ViewChild('toDate') toDate: MatDatepicker<Date>;
  public fromDateFormControl = new FormControl('', []);
  public toDateFormControl = new FormControl('', []);
  public searchDate = {
    fromDay: "",
    fromMonth: "",
    fromYear: "",
    toDay: "",
    toMonth: "",
    toYear: ""
  }
  public matClearDateFn = this.clearDateInput;
  public enableAgent = localStorage.getItem("managerF") === "9" ? true : false;
  public lsAgent = [];

  constructor(
    public ultils: Ultils,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    public httpService: HttpService,
    public customerService: CustomerService,
    public tableMessageAwaitService: TableMessageAwaitService,
    public translate: TranslateService
  ) {
    super(translate, 'messages-await');

    if (typeof this.tableMessageAwaitService.paramInfo !== "undefined") {
      this.paramInfo.objSearch = this.tableMessageAwaitService.paramInfo;
      
      if (this.paramInfo.objSearch.irai_naiyou.indexOf(',0,') >= 0) {
        this.messageTypeOption.option1 = true;
      }
      if (this.paramInfo.objSearch.irai_naiyou.indexOf(',1,') >= 0) {
        this.messageTypeOption.option2 = true;
      }
      if (this.paramInfo.objSearch.irai_naiyou.indexOf(',2,') >= 0) {
        this.messageTypeOption.option3 = true;
      }
      if (this.paramInfo.objSearch.taiou_joukyou.indexOf(',0,') >= 0) {
        this.supportOption.option1 = true;
      }
      if (this.paramInfo.objSearch.taiou_joukyou.indexOf(',1,') >= 0) {
        this.supportOption.option2 = true;
      }

      if (this.paramInfo.objSearch.from_date !== null && this.paramInfo.objSearch.from_date !== '') {
        let arrDate = this.paramInfo.objSearch.from_date.split('-');
        if (arrDate[0] === '9000' || arrDate[0] === '1900') {
          this.searchDate.fromYear = "";
          this.searchDate.fromMonth = arrDate[1];
          this.searchDate.fromDay = "";
        }
        else {
          this.searchDate.fromYear = arrDate[0];
          this.searchDate.fromMonth = arrDate[1];
          this.searchDate.fromDay = arrDate[2];
        }
        this.fromDateFormControl.setValue(new Date(this.paramInfo.objSearch.from_date));
      }

      if (this.paramInfo.objSearch.to_date !== null && this.paramInfo.objSearch.to_date !== '') {
        let arrDate = this.paramInfo.objSearch.to_date.split('-');
        if (arrDate[0] === '9000' || arrDate[0] === '1900') {
          this.searchDate.toYear = "";
          this.searchDate.toMonth = arrDate[1];
          this.searchDate.toDay = "";
        }
        else {
          this.searchDate.toYear = arrDate[0];
          this.searchDate.toMonth = arrDate[1];
          this.searchDate.toDay = arrDate[2];
        }
        this.toDateFormControl.setValue(new Date(this.paramInfo.objSearch.to_date));
      }
    }

    this.gridOptions = <GridOptions> {
      context: {
        componentParent: this
      },
      onViewportChanged: this.onViewportChanged
    };
    if (this.enableAgent) {
      this.gridOptions.columnDefs = [
        { headerName: '依頼内容', field: 'MessageTypeName', width: 15, cellClass: 'ag-grid-cell flex-center text-label', type: 'text', cellRenderer: labelRenderer },
        { headerName: 'タイトル', field: 'MessageTitle', width: 40, cellClass: 'ag-grid-cell', type: 'text', cellRenderer: linkRenderer, onCellClicked: this.onCellClicked },
        { headerName: '代理店', field: 'AgentName', width: 15, cellClass: 'ag-grid-cell', type: 'text' },
        { headerName: '送信者', field: 'FullName', width: 15, cellClass: 'ag-grid-cell', type: 'text' },
        { headerName: '受信日時', field: 'CreateDate', width: 15, cellClass: 'ag-grid-cell flex-end', type: 'time' }
      ];
    }
    else {
      this.gridOptions.columnDefs = [
        { headerName: '依頼内容', field: 'MessageTypeName', width: 15, cellClass: 'ag-grid-cell flex-center text-label', type: 'text', cellRenderer: labelRenderer },
        { headerName: 'タイトル', field: 'MessageTitle', width: 55, cellClass: 'ag-grid-cell', type: 'text', cellRenderer: linkRenderer, onCellClicked: this.onCellClicked },
        { headerName: '送信者', field: 'FullName', width: 15, cellClass: 'ag-grid-cell', type: 'text' },
        { headerName: '受信日時', field: 'CreateDate', width: 15, cellClass: 'ag-grid-cell flex-end', type: 'time' }
      ];
    }
    
    this.gridOptions.rowData = [];
  }

  ngOnInit() {
    window["CustomerSearchComponent"] = this;

    if (this.enableAgent) {
      // load Agent dropdown
      this.httpService.post(this.API_URLS.getListAgent, {}).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          this.lsAgent = res.data;
        } else {
          console.log(res);
        }
      });
    }
  }

  onCellClicked(e): void {
    let obj = e.context.thisComponent.paramInfo.objSearch;
    obj.page = e.context.thisComponent.page;
    obj.pageSize = e.context.thisComponent.pageSize;
    e.context.componentParent.tableMessageAwaitService.paramInfo = obj;

    if (e.data.MessageType === 0) {
      localStorage.setItem('tab-back-to-page', e.context.componentParent.router.url);
      let parentNo;
      if (e.data.ParentMessageNo.toString() === '0') {
        parentNo = e.data.MessageNo;
      }
      else {
        parentNo = e.data.ParentMessageNo;
      }
      e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.messagesDetail + "/" + parentNo]);
    }
    else if (e.data.MessageType === 1) {
      let customerSelect = {
        CustommerFullName: e.data.FullName,
        FamilyNo: e.data.FamilyNo,
        UserNo: e.data.UserNo,
        IqCustomerNo: e.data.IqCustomerNo
      };
      e.context.componentParent.customerService.objData = customerSelect;
      localStorage.setItem('cus-select-id', e.data.UserNo);
      localStorage.setItem('prev-page-tab', e.context.componentParent.router.url);
      e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.analyzerInfo]);
    }
    else {
      if (e.data.countResultShokenBunseki === 0) {
        let parentNo;
        if (e.data.ParentMessageNo.toString() === '0') {
          parentNo = e.data.MessageNo;
        }
        else {
          parentNo = e.data.ParentMessageNo;
        }
        let customerSelect = {
          CustommerFullName: e.data.FullName,
          FamilyNo: e.data.FamilyNo,
          UserNo: e.data.UserNo,
          IqCustomerNo: e.data.IqCustomerNo
        };
        e.context.componentParent.customerService.objData = customerSelect;
        
        localStorage.setItem('tab-back-to-page', e.context.componentParent.router.url);
        localStorage.setItem('message-title-default', '「お試し分析」が完了しました。');
        e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.messageReply + '/2/' + parentNo]);
      }
      else {
        localStorage.setItem('tab-back-to-page', e.context.componentParent.router.url);
        let parentNo;
        if (e.data.ParentMessageNo.toString() === '0') {
          parentNo = e.data.MessageNo;
        }
        else {
          parentNo = e.data.ParentMessageNo;
        }
        e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.messagesDetail + "/" + parentNo]);
      }
    }
  }

  onViewportChanged(e): void {
    e.api.sizeColumnsToFit();
  }

  doSearch(): void {
    let arrIraiNaiyou = [];
    if (this.messageTypeOption.option1) {
      arrIraiNaiyou.push("0");
    }
    if (this.messageTypeOption.option2) {
      arrIraiNaiyou.push("1");
    }
    if (this.messageTypeOption.option3) {
      arrIraiNaiyou.push("2");
    }
    if (arrIraiNaiyou.length > 0) {
      this.paramInfo.objSearch.irai_naiyou = "," + arrIraiNaiyou.join() + ",";
    }
    else {
      this.paramInfo.objSearch.irai_naiyou = "";
    }
    let arrTaiouJoukyou = [];
    if (this.supportOption.option1) {
      arrTaiouJoukyou.push("0");
    }
    if (this.supportOption.option2) {
      arrTaiouJoukyou.push("1");
    }
    if (arrTaiouJoukyou.length > 0) {
      this.paramInfo.objSearch.taiou_joukyou = "," + arrTaiouJoukyou.join() + ",";
    }
    else {
      this.paramInfo.objSearch.taiou_joukyou = "";
    }

    if (!this.ultils.getSearchDateValue(this.searchDate, this.paramInfo.objSearch)) {
      return;
    }

    if (
      (typeof this.fromDateFormControl.value !== 'undefined' && this.fromDateFormControl.value !== null && this.fromDateFormControl.value !== '') &&
      (typeof this.toDateFormControl.value !== 'undefined' && this.toDateFormControl.value !== null && this.toDateFormControl.value !== '')
    ) {
      let fromDate = this.ultils.dateToyyyyMMdd(this.fromDateFormControl.value);
      let toDate = this.ultils.dateToyyyyMMdd(this.toDateFormControl.value);

      if (DateDiff.diffDays(new Date(fromDate), new Date(toDate)) < 0) {
        this.toastrService.warning(this.translate.instant("message.fromDateGreaterToDate"), "");
        return;
      }
    }

    this.tableResult.reloadData(this.paramInfo.objSearch, 1);
  }

  fromDateChange(): void {
    let fromDate = this.ultils.dateToyyyyMMdd(this.fromDateFormControl.value);
    if (this.toDateFormControl.value !== "") {
      let toDate = this.ultils.dateToyyyyMMdd(this.toDateFormControl.value);
      if (DateDiff.diffDays(new Date(fromDate), new Date(toDate)) < 0) {
        this.toastrService.warning(this.translate.instant("message.fromDateGreaterToDate"), "");
        this.searchDate.fromYear = "";
        this.searchDate.fromMonth = "";
        this.searchDate.fromDay = "";
        this.fromDateFormControl.setValue("");
        return;
      }
    }

    let arrFromDate = fromDate.split("-");
    this.searchDate.fromYear = arrFromDate[0];
    this.searchDate.fromMonth = arrFromDate[1];
    this.searchDate.fromDay = arrFromDate[2];
  }

  toDateChange(): void {
    let toDate = this.ultils.dateToyyyyMMdd(this.toDateFormControl.value);
    if (this.fromDateFormControl.value !== "") {
      let fromDate = this.ultils.dateToyyyyMMdd(this.fromDateFormControl.value);
      if (DateDiff.diffDays(new Date(fromDate), new Date(toDate)) < 0) {
        this.toastrService.warning(this.translate.instant("message.fromDateGreaterToDate"), "");
        this.searchDate.toYear = "";
        this.searchDate.toMonth = "";
        this.searchDate.toDay = "";
        this.toDateFormControl.setValue("");
        return;
      }
    }

    let arrToDate = toDate.split("-");
    this.searchDate.toYear = arrToDate[0];
    this.searchDate.toMonth = arrToDate[1];
    this.searchDate.toDay = arrToDate[2];
  }

  clearDateInput(input: string): void {
    if (input === "fromDate") {
      this.searchDate.fromYear = "";
      this.searchDate.fromMonth = "";
      this.searchDate.fromDay = "";
      this.fromDateFormControl.setValue("");
      this.fromDate.close();
    }
    if (input === "toDate") {
      this.searchDate.toYear = "";
      this.searchDate.toMonth = "";
      this.searchDate.toDay = "";
      this.toDateFormControl.setValue("");
      this.toDate.close();
    }
  }

  changeSearchDate(): void {
    this.ultils.changeSearchDate(this.searchDate, this.fromDateFormControl, this.toDateFormControl);
  }
}

var labelRenderer = function(params) {
  let classLabel = "";
  // QA
  if (params.value === "お問い合わせ") {
    classLabel = "blue-label";
  }
  // Kanishindan
  else if (params.value === "簡易診断") {
    classLabel = "green-label";
  }
  // Shoukenbunsheki
  else {
    classLabel = "red-label";
  }
  return '<span class="'+ classLabel + '">' + params.value + '</span>';
}

var linkRenderer = function(params) {
  return '<span class="link-label">' + params.value + '</span>';
}
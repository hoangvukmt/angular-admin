import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from "ag-grid/main";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Ultils } from '../../core/common/ultils';
import { DateDiff } from '../../core/common/dateDiff';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { GridCommonComponent } from '../common/grid-common/grid-common.component';
import { MatDatepicker } from '../../../../node_modules/@angular/material';
import { TableMessageTargetService } from '../../core/service/table-message-target.service';


@Component({
  selector: 'app-messages-target',
  templateUrl: './messages-target.component.html',
  styleUrls: ['./messages-target.component.css'],
  providers: [DatePipe]
})
export class MessagesTargetComponent extends BaseCpnComponent implements OnInit {
  public objMenu = {
    currentMenu: 'menu-2'
  }
  public objTab = {
    currentTab: 'tab-2',
    hasBack: false,
    tabList: [
      { title: '未対応一覧', id: 'tab-1', url: this.ROUTER_URL.messagesAwait },
      { title: 'ターゲット一覧', id: 'tab-2', url: 'no-url' }
    ]
  }
  public gridOptions: GridOptions;
  public paramInfo = {
    id: "messageTargetTable",
    style: {'height': '350px'},
    apiUrl: this.API_URLS.searchHaishinLog,
    objSearch: {
      from_date: null,
      to_date: null,
      filter: [],
      sort: [],
      page: 1,
      pageSize: 20
    }
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

  constructor(
    private datePipe: DatePipe,
    private toastrService: ToastrService,
    public ultils: Ultils,
    private router: Router,    
    public tableMessageTargetService: TableMessageTargetService,
    public translate: TranslateService
  ) {
    super(translate, 'messages-target');

    if (typeof this.tableMessageTargetService.paramInfo !== "undefined") {
      this.paramInfo.objSearch = this.tableMessageTargetService.paramInfo;
      
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
    this.gridOptions.columnDefs = [
      { headerName: 'タイトル', field: 'MessageTitle', width: 25, cellClass: 'ag-grid-cell', type: 'text', cellRenderer: linkRenderer, onCellClicked: this.onCellClicked },
      { headerName: '配信対象', field: 'TargetF', width: 25, cellClass: 'ag-grid-cell', type: 'none', cellRenderer: targetFRenderer },
      { headerName: '期間', field: 'KikanFName', width: 25, cellClass: 'ag-grid-cell', type: 'text' },
      { headerName: '送信日時', field: 'CreateDate', width: 25, cellClass: 'ag-grid-cell flex-end', type: 'time' }
    ];
    this.gridOptions.rowData = [];
  }

  ngOnInit() {
    window["CustomerSearchComponent"] = this;    
  }
  
  choseTarget() {
    localStorage.setItem('tab-back-to-page', this.router.url);
    this.router.navigate(['/' + this.ROUTER_URL.messagesTargetChose]);
  }

  onCellClicked(e): void {
    let obj = e.context.thisComponent.paramInfo.objSearch;
    obj.page = e.context.thisComponent.page;
    obj.pageSize = e.context.thisComponent.pageSize;
    e.context.componentParent.tableMessageTargetService.paramInfo = obj;

    localStorage.setItem('tab-back-to-page', e.context.componentParent.router.url);
    e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.messagesTargetDetail + "/" + e.data.HaishinID]);
  }

  onViewportChanged(e): void {
    e.api.sizeColumnsToFit();
  }

  doSearch(): void {
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

var linkRenderer = function(params) {
  return '<span class="link-label">' + params.value + '</span>';
}

var targetFRenderer = function(params) {
  let strValue = "";
  if (params.data.TargetF === 0) {
    strValue = "すべて";
  }
  else {
    if (params.data.TargetSex === 0) {
      strValue += "男性, ";
    }
    else if (params.data.TargetSex === 1) {
      strValue += "女性, ";
    }
    else if (params.data.TargetSex === 2) {
      strValue += "男性, 女性,";
    }

    if (params.data.MarriageF === 0) {
      strValue += "既婚者, ";
    }
    else if (params.data.MarriageF === 1) {
      strValue += "未婚者, ";
    }
    else if (params.data.MarriageF === 2) {
      strValue += "既婚者, 未婚者, ";
    }

    if (params.data.HasChildF === 0) {
      strValue += "子供有, ";
    }
    else if (params.data.HasChildF === 1) {
      strValue += "子供無, ";
    }
    else if (params.data.HasChildF === 2) {
      strValue += "子供有, 子供無, ";
    }

    if (params.data.TargetAge !== null) {
      switch (params.data.TargetAge) {
        case 1:
          strValue += "20代, ";
          break;
        case 2:
          strValue += "30代, ";
          break;
        case 3:
          strValue += "20代, 30代, ";
          break;
        case 4:
          strValue += "40代, "
          break;
        case 5:
          strValue += "20代, 40代, ";
          break;
        case 6:
          strValue += "30代, 40代, ";
          break;
        case 7:
          strValue += "20代, 30代, 40代, ";
          break;
        case 8:
          strValue += "50代, ";
          break;
        case 9:
          strValue += "20代, 50代, ";
          break;
        case 10:
          strValue += "30代, 50代, ";
          break;
        case 11:
          strValue += "20代, 30代, 50代, ";
          break;
        case 12:
          strValue += "40代, 50代, ";
          break;
        case 13:
          strValue += "20代, 40代, 50代, ";
          break;
        case 14:
          strValue += "30代, 40代, 50代, ";
          break;
        case 15:
          strValue += "20代, 30代, 40代, 50代, ";
          break;
        case 16:
          strValue += "60代, ";
          break;
        case 17:
          strValue += "20代, 60代, ";
          break;
        case 18:
          strValue += "30代, 60代, ";
          break;
        case 19:
          strValue += "20代, 30代, 60代, ";
          break;
        case 20:
          strValue += "40代, 60代, ";
          break;
        case 21:
          strValue += "20代, 40代, 60代, ";
          break;
        case 22:
          strValue += "30代, 40代, 60代, ";
          break;
        case 23:
          strValue += "20代, 30代, 40代, 60代, ";
          break;
        case 24:
          strValue += "50代, 60代, ";
          break;
        case 25:
          strValue += "20代, 50代, 60代, ";
          break;
        case 26:
          strValue += "30代, 50代, 60代, ";
          break;
        case 27:
          strValue += "20代, 30代, 50代, 60代, ";
          break;
        case 28:
          strValue += "40代, 50代, 60代, ";
          break;
        case 29:
          strValue += "20代, 40代, 50代, 60代, ";
          break;
        case 30:
          strValue += "30代, 40代, 50代, 60代, ";
          break;
        case 31:
          strValue += "20代, 30代, 40代, 50代, 60代, ";
          break;
      }
    }

      if(strValue != "すべて") {
          strValue = strValue.substring(0, strValue.length - 2)
      }
  }

  return strValue;
}
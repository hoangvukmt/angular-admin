import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from "ag-grid/main";
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

import { Ultils } from '../../core/common/ultils';
import { DateDiff } from '../../core/common/dateDiff';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { GridCommonComponent } from '../common/grid-common/grid-common.component';
import { MatDatepicker } from '../../../../node_modules/@angular/material';
import { TableHistoryService } from '../../core/service/table-history.service';
import { CustomerService } from '../../core/service/customer.service';

@Component({
  selector: 'app-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.css'],
  providers: [DatePipe]
})
export class HistoryInfoComponent extends BaseCpnComponent implements OnInit {
  public customerInfo = {
    CustommerFullName: null,
    FamilyNo: null,
    IqCustomerNo: null,
    UserNo: null
  };
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {
    currentTab: 'tab-5',
    hasBack: true,
    tabList: [
      { title: '家族別商品一覧', id: 'tab-1', url: this.ROUTER_URL.productsFamily },
      { title: 'カテゴリー別', id: 'tab-2', url: this.ROUTER_URL.productsCategory },
      { title: 'メッセージ', id: 'tab-3', url: this.ROUTER_URL.messageList },
      { title: '簡易診断', id: 'tab-4', url: this.ROUTER_URL.analyzerInfo },
      { title: '利用状況', id: 'tab-5', url: 'no-url' }
    ]
  }
  public gridOptions: GridOptions;
  public paramInfo = {
    id: "historySearchTable",
    style: {'height': '350px'},
    apiUrl: this.API_URLS.searchRiyo,
    objSearch: {
      user_no: null,
      login_action: "",
      kazoku_jouhou: "",
      irai: "",
      hoken_shouken: "",
      hoken_dairiten: "",
      baner: "",
      from_date: null,
      to_date: null,
      filter: [],
      sort: [],
      page: 1,
      pageSize: 20
    }
  }
  public loginActionCheck = {
    option1: false,
    option2: false,
    option3: false
  }
  public kazokuJouhouCheck = {
    option1: false,
    option2: false,
    option3: false,
    option4: false
  }
  public iraiCheck = {
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false
  }
  public hokenShoukenCheck = {
    option1: false,
    option2: false,
    option3: false,
    option4: false
  }
  public hokenDairitenCheck = {
    option1: false,
    option2: false,
    option3: false
  }
  public banerCheck = {
    option1: false
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
    public ultils: Ultils,
    private toastrService: ToastrService,
    public tableHistoryService: TableHistoryService,
    public customerService: CustomerService,
    public translate: TranslateService
  ) {
    super(translate, 'history-info');

    this.customerInfo = this.customerService.objData;
    if (this.customerInfo.UserNo === null) {
      this.customerInfo = JSON.parse(localStorage.getItem('cus-select'));
    }

    this.paramInfo = {
      id: "historySearchTable",
      style: {'height': '350px'},
      apiUrl: this.API_URLS.searchRiyo,
      objSearch: {
        user_no: this.customerInfo.UserNo,
        login_action: "",
        kazoku_jouhou: "",
        irai: "",
        hoken_shouken: "",
        hoken_dairiten: "",
        baner: "",
        from_date: null,
        to_date: null,
        filter: [],
        sort: [],
        page: 1,
        pageSize: 20
      }
    };
    
    if (typeof this.tableHistoryService.paramInfo !== "undefined") {
      this.paramInfo.objSearch = this.tableHistoryService.paramInfo;

      if (this.paramInfo.objSearch.login_action.indexOf(',0,') >= 0) {
        this.loginActionCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.login_action.indexOf(',1,') >= 0) {
        this.loginActionCheck.option2 = true;
      }
      if (this.paramInfo.objSearch.login_action.indexOf(',2,') >= 0) {
        this.loginActionCheck.option3 = true;
      }

      if (this.paramInfo.objSearch.kazoku_jouhou.indexOf(',0,') >= 0) {
        this.kazokuJouhouCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.kazoku_jouhou.indexOf(',1,') >= 0) {
        this.kazokuJouhouCheck.option2 = true;
      }
      if (this.paramInfo.objSearch.kazoku_jouhou.indexOf(',2,') >= 0) {
        this.kazokuJouhouCheck.option3 = true;
      }
      if (this.paramInfo.objSearch.kazoku_jouhou.indexOf(',3,') >= 0) {
        this.kazokuJouhouCheck.option4 = true;
      }

      if (this.paramInfo.objSearch.irai.indexOf(',0,') >= 0) {
        this.iraiCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.irai.indexOf(',1,') >= 0) {
        this.iraiCheck.option2 = true;
      }
      if (this.paramInfo.objSearch.irai.indexOf(',2,') >= 0) {
        this.iraiCheck.option3 = true;
      }
      if (this.paramInfo.objSearch.irai.indexOf(',3,') >= 0) {
        this.iraiCheck.option4 = true;
      }
      if (this.paramInfo.objSearch.irai.indexOf(',4,') >= 0) {
        this.iraiCheck.option5 = true;
      }

      if (this.paramInfo.objSearch.hoken_shouken.indexOf(',0,') >= 0) {
        this.hokenShoukenCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.hoken_shouken.indexOf(',1,') >= 0) {
        this.hokenShoukenCheck.option2 = true;
      }
      if (this.paramInfo.objSearch.hoken_shouken.indexOf(',2,') >= 0) {
        this.hokenShoukenCheck.option3 = true;
      }
      if (this.paramInfo.objSearch.hoken_shouken.indexOf(',3,') >= 0) {
        this.hokenShoukenCheck.option4 = true;
      }

      if (this.paramInfo.objSearch.hoken_dairiten.indexOf(',0,') >= 0) {
        this.hokenDairitenCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.hoken_dairiten.indexOf(',1,') >= 0) {
        this.hokenDairitenCheck.option2 = true;
      }
      if (this.paramInfo.objSearch.hoken_dairiten.indexOf(',2,') >= 0) {
        this.hokenDairitenCheck.option3 = true;
      }

      if (this.paramInfo.objSearch.baner.indexOf(',0,') >= 0) {
        this.banerCheck.option1 = true;
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

    this.gridOptions.columnDefs = [
      { headerName: '日付', field: 'CreateDate', width: 15, cellClass: 'ag-grid-cell flex-center', type: 'date' },
      { headerName: '行動', field: 'ActionContent', width: 85, cellClass: 'ag-grid-cell', type: 'text' }
    ];
    this.gridOptions.rowData = [];
  }

  ngOnInit() {
    window["CustomerSearchComponent"] = this;
  }

  onViewportChanged(e): void {
    e.api.sizeColumnsToFit();
  }

  doSearch(): void {
    let arrLoginAction = [];
    if (this.loginActionCheck.option1) {
      arrLoginAction.push("0");
    }
    if (this.loginActionCheck.option2) {
      arrLoginAction.push("1");
    }
    if (this.loginActionCheck.option3) {
      arrLoginAction.push("2");
    }
    if (arrLoginAction.length > 0) {
      this.paramInfo.objSearch.login_action = "," + arrLoginAction.join() + ",";
    }
    else {
      this.paramInfo.objSearch.login_action = "";
    }

    let arrKazokuJouhou = [];
    if (this.kazokuJouhouCheck.option1) {
      arrKazokuJouhou.push("0");
    }
    if (this.kazokuJouhouCheck.option2) {
      arrKazokuJouhou.push("1");
    }
    if (this.kazokuJouhouCheck.option3) {
      arrKazokuJouhou.push("2");
    }
    if (this.kazokuJouhouCheck.option4) {
      arrKazokuJouhou.push("3");
    }
    if (arrKazokuJouhou.length > 0) {
      this.paramInfo.objSearch.kazoku_jouhou = "," + arrKazokuJouhou.join() + ",";
    }
    else {
      this.paramInfo.objSearch.kazoku_jouhou = "";
    }

    let arrIrai = [];
    if (this.iraiCheck.option1) {
      arrIrai.push("0");
    }
    if (this.iraiCheck.option2) {
      arrIrai.push("1");
    }
    if (this.iraiCheck.option3) {
      arrIrai.push("2");
    }
    if (this.iraiCheck.option4) {
      arrIrai.push("3");
    }
    if (this.iraiCheck.option5) {
      arrIrai.push("4");
    }
    if (arrIrai.length > 0) {
      this.paramInfo.objSearch.irai = "," + arrIrai.join() + ",";
    }
    else {
      this.paramInfo.objSearch.irai = "";
    }

    let arrHokenShouken = [];
    if (this.hokenShoukenCheck.option1) {
      arrHokenShouken.push("0");
    }
    if (this.hokenShoukenCheck.option2) {
      arrHokenShouken.push("1");
    }
    if (this.hokenShoukenCheck.option3) {
      arrHokenShouken.push("2");
    }
    if (this.hokenShoukenCheck.option4) {
      arrHokenShouken.push("3");
    }
    if (arrHokenShouken.length > 0) {
      this.paramInfo.objSearch.hoken_shouken = "," + arrHokenShouken.join() + ",";
    }
    else {
      this.paramInfo.objSearch.hoken_shouken = "";
    }

    let arrHokenDairiten = [];
    if (this.hokenDairitenCheck.option1) {
      arrHokenDairiten.push("0");
    }
    if (this.hokenDairitenCheck.option2) {
      arrHokenDairiten.push("1");
    }
    if (this.hokenDairitenCheck.option3) {
      arrHokenDairiten.push("2");
    }
    if (arrHokenDairiten.length > 0) {
      this.paramInfo.objSearch.hoken_dairiten = "," + arrHokenDairiten.join() + ",";
    }
    else {
      this.paramInfo.objSearch.hoken_dairiten = "";
    }

    let arrBaner = [];
    if (this.banerCheck.option1) {
      arrBaner.push("0");
    }
    if (arrBaner.length > 0) {
      this.paramInfo.objSearch.baner = "," + arrBaner.join() + ",";
    }
    else {
      this.paramInfo.objSearch.baner = "";
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

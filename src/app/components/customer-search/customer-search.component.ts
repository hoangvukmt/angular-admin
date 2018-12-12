import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid/main";
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Ultils } from '../../core/common/ultils';
import { DateDiff } from '../../core/common/dateDiff';
import { HttpService } from '../../core/service/http.service';
import { TableCustomerService } from '../../core/service/table-customer.service';
import { CustomerService } from '../../core/service/customer.service';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { GridCommonComponent } from '../common/grid-common/grid-common.component';
import { MatDatepicker } from '../../../../node_modules/@angular/material';
import { async } from '../../../../node_modules/rxjs/internal/scheduler/async';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css'],
  providers: [DatePipe]
})
export class CustomerSearchComponent extends BaseCpnComponent implements OnInit {
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public gridOptions: GridOptions;
  public paramInfo = {
    id: "customerSearchTable",
    style: {'height': '350px'},
    apiUrl: this.API_URLS.searchCustomer,
    objSearch: {
      full_name: null,
      email: null,
      from_date: null,
      to_date: null,
      agent_cd: "",
      kani_shindan_filter: "",
      shoken_bunseki_filter: "",
      filter: [],
      sort: [],
      page: 1,
      pageSize: 20
    }
  }
  public kaniShindanCheck = {
    option1: false,
    option2: false,
    option3: false
  }
  public shokenBunsekiCheck = {
    option1: false,
    option2: false,
    option3: false
  }
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
  @ViewChild('tableResult') tableResult: GridCommonComponent;
  @ViewChild('fromDate') fromDate: MatDatepicker<Date>;
  @ViewChild('toDate') toDate: MatDatepicker<Date>;
  public enableAgent = localStorage.getItem("managerF") === "9" ? true : false;
  public lsAgent = [];

  constructor(
    private toastrService: ToastrService,
    public ultils: Ultils,
    private datePipe: DatePipe,
    private router: Router,
    public httpService: HttpService,
    public tableCustomerService: TableCustomerService,
    public customerService: CustomerService,
    public translate: TranslateService
  ) {
    super(translate, 'customer-search');

    if (typeof this.tableCustomerService.paramInfo !== "undefined") {
      this.paramInfo.objSearch = this.tableCustomerService.paramInfo;

      if (this.paramInfo.objSearch.kani_shindan_filter.indexOf(',0,') >= 0) {
        this.kaniShindanCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.kani_shindan_filter.indexOf(',1,') >= 0) {
        this.kaniShindanCheck.option3 = true;
      }
      if (this.paramInfo.objSearch.kani_shindan_filter.indexOf(',2,') >= 0) {
        this.kaniShindanCheck.option2 = true;
      }

      if (this.paramInfo.objSearch.shoken_bunseki_filter.indexOf(',0,') >= 0) {
        this.shokenBunsekiCheck.option1 = true;
      }
      if (this.paramInfo.objSearch.shoken_bunseki_filter.indexOf(',1,') >= 0) {
        this.shokenBunsekiCheck.option3 = true;
      }
      if (this.paramInfo.objSearch.shoken_bunseki_filter.indexOf(',2,') >= 0) {
        this.shokenBunsekiCheck.option2 = true;
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
      //rowSelection: 'multiple',
      onViewportChanged: this.onViewportChanged,
    };

    this.gridOptions.columnDefs = [
      //{ headerName: '', field: '', width: 40, cellClass: 'ag-grid-cell flex-center', type: 'none', checkboxSelection: true, headerCheckboxSelection: true },
      { headerName: '簡易診断', field: 'KaniShindanFName', width: 100, cellClass: 'ag-grid-cell flex-center', type: 'text' },
      { headerName: 'お試し証券分析', field: 'ShokenBunsekiFName', width: 130, cellClass: 'ag-grid-cell flex-center', type: 'text' },
      { headerName: 'メールアドレス', field: 'LoginId', width: 150, cellClass: 'ag-grid-cell', type: 'text' },
      { headerName: '顧客名', field: 'CustommerFullName', width: 130, cellClass: 'ag-grid-cell', type: 'text', cellRenderer: linkRenderer, onCellClicked: this.onCellClicked },
      { headerName: '性別', field: 'SexName', width: 100, cellClass: 'ag-grid-cell flex-center', type: 'text' },
      { headerName: '生年月日', field: 'Birthday', width: 100, cellClass: 'ag-grid-cell flex-end', type: 'date' },
      { headerName: '年齢', field: 'Age', width: 100, cellClass: 'ag-grid-cell flex-center', type: 'number', cellRenderer: ageRenderer },
      { headerName: '登録日', field: 'CreateDate', width: 100, cellClass: 'ag-grid-cell flex-end', type: 'date' }
    ];
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

  ngAfterViewInit() {
    
  }

  onCellClicked(e): void {
    let obj = e.context.thisComponent.paramInfo.objSearch;
    obj.page = e.context.thisComponent.page;
    obj.pageSize = e.context.thisComponent.pageSize;
    e.context.componentParent.tableCustomerService.paramInfo = obj;

    let customerSelect = {
      CustommerFullName: e.data.CustommerFullName,
      FamilyNo: e.data.FamilyNo,
      UserNo: e.data.UserNo,
      IqCustomerNo: e.data.IqCustomerNo
    };
    e.context.componentParent.customerService.objData = customerSelect;
    localStorage.setItem('cus-select', JSON.stringify(customerSelect));
    
    localStorage.setItem('prev-page-tab', e.context.componentParent.router.url);
    e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.productsFamily]);
  }

  onViewportChanged(e): void {
    e.api.sizeColumnsToFit();
  }

  doSearch() {
    let arrKaniShindan = [];
    if (this.kaniShindanCheck.option1) {
      arrKaniShindan.push("0");
    }
    if (this.kaniShindanCheck.option2) {
      arrKaniShindan.push("2");
    }
    if (this.kaniShindanCheck.option3) {
      arrKaniShindan.push("1");
    }
    if (arrKaniShindan.length > 0) {
      this.paramInfo.objSearch.kani_shindan_filter = "," + arrKaniShindan.join() + ",";
    }
    else {
      this.paramInfo.objSearch.kani_shindan_filter = "";
    }

    let arrShokenBunseki = [];
    if (this.shokenBunsekiCheck.option1) {
      arrShokenBunseki.push("0");
    }
    if (this.shokenBunsekiCheck.option2) {
      arrShokenBunseki.push("2");
    }
    if (this.shokenBunsekiCheck.option3) {
      arrShokenBunseki.push("1");
    }
    if (arrShokenBunseki.length > 0) {
      this.paramInfo.objSearch.shoken_bunseki_filter = "," + arrShokenBunseki.join() + ",";
    }
    else {
      this.paramInfo.objSearch.shoken_bunseki_filter = "";
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
    console.log(this.paramInfo.objSearch);
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

var ageRenderer = function(params) {
  return parseInt(params.value) + " 歳";
}
var linkRenderer = function(params) {
  return '<span class="link-label">' + params.value + '</span>';
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid/main";
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

import { Ultils } from '../../core/common/ultils';
import { DateDiff } from '../../core/common/dateDiff';
import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { GridCommonComponent } from '../common/grid-common/grid-common.component';
import { MatDatepicker } from '../../../../node_modules/@angular/material';
import { HttpService } from '../../core/service/http.service';
import { CustomerService } from '../../core/service/customer.service';
import { TableMessageAwaitService } from '../../core/service/table-message-await.service';
import { ConfirmDialogComponent } from '../../components/common/popup/confirm-dialog/confirm-dialog.component'

@Component({
  selector: 'app-ocr-request',
  templateUrl: './ocr-request.component.html',
  styleUrls: ['./ocr-request.component.css'],
  providers: [DatePipe]
})
export class OCRRequestComponent extends BaseCpnComponent implements OnInit {  
  public checked=true;
  public objMenu = {
    currentMenu: 'menu-3',
  }  
  public gridOptions: GridOptions;  
  public paramInfo = {
    id: "ocrRequestTable",
    style: {'height': '350px'},
    apiUrl: this.API_URLS.ocrRequest,
    objSearch: {
      from_date: null,
      to_date: null,
      taiou_joukyou: ",0,2,1,",      
      filter: [],
      sort: [],
      page: 1,
      pageSize: 20
    },
    objDel: {
      keiyaku_no: null
    },
    Del_apiUrl: this.API_URLS.delOcrList
  }
  public messageTypeOption = {
    option1: true,
    option2: true,
    option3: true
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
    public ultils: Ultils,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog,
    public httpService: HttpService,
    public customerService: CustomerService,
    public tableMessageAwaitService: TableMessageAwaitService,
    public translate: TranslateService
  ) {    
    super(translate, 'ocr-request');    

    if (typeof this.tableMessageAwaitService.paramInfo !== "undefined") {
      this.paramInfo.objSearch = this.tableMessageAwaitService.paramInfo;
      
      if (this.paramInfo.objSearch.taiou_joukyou.indexOf(',0,') >= 0) {
        this.messageTypeOption.option1 = true;
      }
      if (this.paramInfo.objSearch.taiou_joukyou.indexOf(',2,') >= 0) {
        this.messageTypeOption.option2 = true;
      }
      if (this.paramInfo.objSearch.taiou_joukyou.indexOf(',1,') >= 0) {
        this.messageTypeOption.option3 = true;
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
      rowSelection: 'multiple',
      onViewportChanged: this.onViewportChanged
    };

    this.gridOptions.columnDefs = [
      { headerName: '', field: '', width: 10, cellClass: 'ag-grid-cell flex-center', type: 'none', checkboxSelection: true, headerCheckboxSelection: true },
      { headerName: '対応状況', field: 'TypeName', width: 20, cellClass: 'ag-grid-cell flex-center text-label', type: 'text', cellRenderer: labelRenderer},
      { headerName: '証券枚数', field: 'count_img', width: 15, cellClass: 'ag-grid-cell flex-center', type: 'number' },
      { headerName: 'タイトル', field: 'Title', width: 55, cellClass: 'ag-grid-cell', type: 'text', cellRenderer: linkRenderer, onCellClicked: this.onCellClicked},
      { headerName: '送信者', field: 'FamilyName', width: 15, cellClass: 'ag-grid-cell', type: 'text' },
      { headerName: '受信日時', field: 'CreateDate', width: 15, cellClass: 'ag-grid-cell flex-end', type: 'date', cellRenderer: JPdateRenderer}
    ];

    this.gridOptions.suppressRowClickSelection = true;    
    this.gridOptions.rowData = [];
    this.gridOptions.rowStyle = {border: '1px solid rgb(233, 224, 223)'};
  }

  ngOnInit() {
    window["OCRRequestComponent"] = this;    
  }

  onCellClicked(e): void {    
    e.context.componentParent.router.navigate(['/' + e.context.componentParent.ROUTER_URL.ocrDetail + '/' + e.data.KeiyakuNo]);
  }

  onViewportChanged(e): void {    
    e.api.sizeColumnsToFit();
  }

  doSearch(): void {
    let arrTaiouJoukyou = [];
    if (this.messageTypeOption.option1) {
      arrTaiouJoukyou.push("0");
    }
    if (this.messageTypeOption.option2) {
      arrTaiouJoukyou.push("2");
    }
    if (this.messageTypeOption.option3) {
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

  clickMethod() {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: this.translate.instant("本当に削除しますか。") },
      panelClass: []
    });
    dialogConfirm.afterClosed().subscribe(result => {      
      if (result.action =="ok") {        
        let array = this.tableResult.getSelectedData()
        array.forEach(element => {          
          this.paramInfo.objDel.keiyaku_no = element.data.KeiyakuNo;
          this.tableResult.DelSelectedRow(this.paramInfo.objDel);
        });
        
        this.doSearch();
      }
    });      
  }

  updatechecked(e:boolean): void {
    this.checked = e;
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
  if (params.value === "変換済") {
    classLabel = "blue-label";
  }
  // Kanishindan
  else if (params.value === "画像補正") {
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

var JPdateRenderer = function(params) {
  let date = new Date(params.value);    
  return (date.getUTCFullYear() + "年" + (date.getUTCMonth() + 1) + "月" + date.getUTCDate() + "日");  
}
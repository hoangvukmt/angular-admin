import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import '../../../../assets/lib/ag-grid-enterprise'

import { HttpService } from '../../../core/service/http.service';
import { RESULT_CODE, API_URLS } from '../../../core/const';
import { DatePipe } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-grid-common',
  templateUrl: './grid-common.component.html',
  styleUrls: ['./grid-common.component.css'],
  providers: [DatePipe]
})
export class GridCommonComponent implements OnInit {
  @Output() checked = new EventEmitter<boolean>();
  @Input() paramInfo = {
    id: "",
    style: ""
  };
  @Input() gridOptions: any;
  public page = 1;
  public pageSize = 0;
  public totalRecord = 0;
  public totalPage = 0;
  public sortData = this.loadSortData;
  public pagination = [];
  public pageSizeRange = [];
  public disabled = {
    first: false,
    last: false
  }

  public localeText = {
    // for filter panel
    page: '',
    more: '',
    to: '',
    of: '',
    next: '',
    last: '',
    first: '',
    previous: '',
    loadingOoo: '...',

    // for set filter
    selectAll: '',
    searchOoo: '',
    blanks: '',

    // for number filter and text filter
    filterOoo: '絞り込み',
    applyFilter: '適用',
    clearFilter: 'クリア',

    // for number filter
    equals: '等しい',
    notEqual: '等しくない',
    lessThan: 'より小さい',
    greaterThan: 'より大きい',
    inRange: '期間内',

    // for text filter
    contains: '含む',
    notContains: '含まない',
    startsWith: 'で始まる',
    endsWith: 'で終わる',
    lessThanOrEqual: '以下',
    greaterThanOrEqual: '以上',

    // the header of the default group column
    group: '',

    // tool panel
    columns: '<i class="fas fa-cog"></i>',
    rowGroupColumns: '',
    rowGroupColumnsEmptyMessage: '',
    valueColumns: '',
    pivotMode: '',
    groups: '',
    values: '',
    pivots: '',
    valueColumnsEmptyMessage: '',
    pivotColumnsEmptyMessage: '',
    toolPanelButton: '',

    // other
    noRowsToShow: 'データがありません。',

    // enterprise menu
    pinColumn: '',
    valueAggregation: '',
    autosizeThiscolumn: '',
    autosizeAllColumns: '',
    groupBy: '',
    ungroupBy: '',
    resetColumns: '',
    expandAll: '',
    collapseAll: '',
    toolPanel: '',
    export: '',
    csvExport: '',
    excelExport: '',

    // enterprise menu pinning
    pinLeft: '',
    pinRight: '',
    noPin: '',

    // enterprise menu aggregation and status panel
    sum: '',
    min: '',
    max: '',
    none: '',
    count: '',
    average: '',

    // standard menu
    copy: '',
    copyWithHeaders: '',
    ctrlC: '',
    paste: '',
    ctrlV: ''
  };

  constructor(
    private datePipe: DatePipe,
    public httpService: HttpService
  ) {
    
  }

  ngOnInit() {
    window[this.paramInfo["id"]] = {
      componentFn: (param) => this.doFilter(param), 
      component: this
    };

    this.gridOptions.overlayNoRowsTemplate = "";
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 40;
    //this.gridOptions.rowSelection = "single";
    this.gridOptions.enableFilter = true;
    this.gridOptions.enableSorting = true;
    this.gridOptions.toolPanelSuppressRowGroups = true;
    this.gridOptions.toolPanelSuppressValues = true;
    this.gridOptions.toolPanelSuppressPivotMode = true;
    this.gridOptions.suppressContextMenu = true;
    this.gridOptions.onSortChanged = this.onSortChanged;
    this.gridOptions.objSearch = {};
    this.gridOptions.sortData = this.sortData;
    this.gridOptions.context.thisComponent = this;
    this.gridOptions.enableServerSideFilter = true;
    this.gridOptions.enableServerSideSorting = true;
    this.gridOptions.suppressCellSelection = true;
    this.gridOptions.suppressCopyRowsToClipboard = false;
    this.gridOptions.processCellForClipboard = this.processCellForClipboard;

    this.gridOptions.localeText = this.localeText;

    for (let i = 0; i < this.gridOptions.columnDefs.length; i++) {
      let item = this.gridOptions.columnDefs[i];
      item.menuTabs = ["filterMenuTab"];
      item.headerClass = 'ag-grid-head';
      item.suppressMovable = true;
      item.comparator = this.customComparator;
      
      switch (item.type) {
        case "number":
          item.filter = "agNumberColumnFilter";
          break;
        case "date": 
          item.filter = "agDateColumnFilter";
          item.valueFormatter = this.dateFormatter;
          break;
        case "JPdate": 
          item.filter = "agDateColumnFilter";
          item.valueFormatter = this.JPdateFormatter;
          break;         
        case "time":
          item.filter = "agDateColumnFilter";
          item.valueFormatter = this.timeFormatter;
          break;
        case "none":
          item.headerClass = 'ag-grid-head ag-grid-none-filter';
          item.suppressFilter = true;
          break;
        default:
          item.filter = "agTextColumnFilter";
          break;
      }

      item.filterParams = {
        clearButton: true,
        applyButton: true,
        newRowsAction: 'keep'
      }
    }

    this.gridOptions.objSearch = this.paramInfo["objSearch"];

    var formData = {
      sel_type: 20
    };
    this.httpService.post(API_URLS.getSelectItem, formData).subscribe(res => {
      if (res.code === RESULT_CODE.success) {
        this.pageSizeRange = [];
        for (var i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          this.pageSizeRange.push(parseInt(item.name));
        }
        this.pageSize = this.pageSizeRange[0];
        this.initData();
      } else {
        console.log(res);
      }
    });
  }

  ngAfterViewInit() {
    window['editAgGrid'](this.paramInfo["id"]);
  }

  processCellForClipboard(params) {
    if (window.getSelection().toString() !== "") {
      return window.getSelection().toString();
    }
    else {
      return params.value;
    }
  }

  initData(): void {
    this.page = this.gridOptions.objSearch["page"];
    this.pageSize = this.gridOptions.objSearch["pageSize"];
    this.httpService.post(this.paramInfo["apiUrl"], this.gridOptions.objSearch).subscribe(res => {
      if (res.code === RESULT_CODE.success) {
        this.gridOptions.api.setRowData(res.data);
        this.genPagination(res.totalRecord);
      } else {
        console.log(res);
      }
    });
  }

  reloadData(param: Object, page: number): void {
    this.page = page;
    param["sort"] = this.gridOptions.objSearch.sort;
    param["filter"] = this.gridOptions.objSearch.filter;
    this.gridOptions.objSearch = param;
    this.gridOptions.objSearch["page"] = this.page;
    this.gridOptions.objSearch["pageSize"] = Number(this.pageSize);
    this.httpService.post(this.paramInfo["apiUrl"], this.gridOptions.objSearch).subscribe(res => {
      if (res.code === RESULT_CODE.success) {
        console.log(res.data);
        this.gridOptions.api.setRowData(res.data);
        this.genPagination(res.totalRecord);
      } else {
        console.log(res);
      }
    });    
  }

  getSelectedData(): any {
    return this.gridOptions.api.getSelectedNodes();
  }

  DelSelectedRow(param: Object): void {
    this.gridOptions.objDel = param;
    this.httpService.post(this.paramInfo["Del_apiUrl"], this.gridOptions.objDel).subscribe(res => {      
      console.log (res);
    });
  }

  loadSortData(param: Object): void {
    this["context"].thisComponent.httpService.post(this["context"].thisComponent.paramInfo["apiUrl"], param).subscribe(res => {
      if (res.code === RESULT_CODE.success) {
        this["context"].thisComponent.gridOptions.api.setRowData(res.data);
        this["context"].thisComponent.genPagination(res.totalRecord);
      } else {
        console.log(res);
      }
    });
  }

  onPageSizeChanged(): void {
    let totalPage = parseInt((this.totalRecord / this.pageSize).toString()) + (this.totalRecord % this.pageSize > 0 ? 1 : 0);
    if (this.page > totalPage) {
      this.page = totalPage;
    }
    if (this.page === 0) {
      this.page = 1;
    }
    this.reloadData(this.gridOptions.objSearch, this.page);
  }

  onPageChange(page: number): void {
    if (page !== -1) {
      this.page = page;
      this.reloadData(this.gridOptions.objSearch, this.page);
    }
  }

  onRowSelected(e:Event): void {
    if (this.gridOptions.api.getSelectedNodes().length > 0) {
      this.checked.emit(false);
    }
    else {
      this.checked.emit(true);
    }
  }

  onPaginationControl(type: string): void {
    switch (type) {
      case "first":
        if (this.page !== 1) {
          this.page = 1;
          this.reloadData(this.gridOptions.objSearch, this.page);
        }
        break;
      case "prev":
        if (this.page > 1) {
          this.page--;
          this.reloadData(this.gridOptions.objSearch, this.page);
        }
        break;
      case "next":
        if (this.page < this.totalPage) {
          this.page++;
          this.reloadData(this.gridOptions.objSearch, this.page);
        }
        break;
      case "last":
        if (this.page !== this.totalPage) {
          this.page = this.totalPage;
          this.reloadData(this.gridOptions.objSearch, this.page);
        }
        break;
    }
  }

  customComparator() {
    return null;
  }

  onSortChanged(e): void {
    this["objSearch"]["sort"] = [];
    let columns = e.columnApi.getAllColumns();
    for (let i = 0; i < columns.length; i++) {
      let item = columns[i];
      if (typeof item.sort !== "undefined") {
        let complete = false;
        for (let j = 0; j < this["objSearch"]["sort"].length; j++) {
          let obj = this["objSearch"]["sort"][j];
          if (obj.field === item.colId) {
            obj.type = item.sort;
            complete = true;
            break;
          }
        }
        if (!complete) {
          let objSort = {
            field: item.colId,
            type: item.sort
          };
          this["objSearch"]["sort"].push(objSort);
        }
        break;
      }
    }
    this.sortData(this["objSearch"]);
  }

  doFilter(param): void {
    let columns = this.gridOptions.columnApi.getAllColumns();
    for (let i = 0; i < columns.length; i++) {
      let item = columns[i];
      if (item.menuVisible) {
        param.field = item.colId;
        param.type = item.colDef.type;
        break;
      }
    }
    let _done = false;
    for (let i = 0; i < this.gridOptions.objSearch.filter.length; i++) {
      let item = this.gridOptions.objSearch.filter[i];
      if (item.field === param.field) {
        item.condition1 = param.condition1;
        item.value1 = param.value1;
        item.operator = param.operator;
        item.condition2 = param.condition2;
        item.value2 = param.value2;

        _done = true;
        break;
      }
    }
    if (!_done) {
      this.gridOptions.objSearch.filter.push(param);
    }
    console.log(this.gridOptions.objSearch);
    console.log(param);
    this.reloadData(this.gridOptions.objSearch, this.page);
  }

  genPagination(totalRecord: number): void {
    this.totalRecord = totalRecord;
    this.pagination = [];
    this.totalPage = parseInt((this.totalRecord / this.pageSize).toString()) + (this.totalRecord % this.pageSize > 0 ? 1 : 0);

    if (this.page === 1) {
      this.disabled.first = true;
    }
    else {
      this.disabled.first = false;
    }
    if (this.page === this.totalPage) {
      this.disabled.last = true;
    }
    else {
      this.disabled.last = false;
    }

    if (this.totalPage === 0) {
      this.disabled.first = true;
      this.disabled.last = true;
    }
    for (let i = 0; i < this.totalPage; i++) {
      if (this.totalPage > 7) {
        if (this.page < 4) {
          if (i === 4) {
            this.pagination.push(-1);
          }
          else if (i < 4) {
            this.pagination.push(i + 1);
          }
          else if (i > this.totalPage - 3) {
            this.pagination.push(i + 1);
          }
        }
        else if (this.page >= 4 && this.page < this.totalPage - 3) {
          if (i === 0) {
            this.pagination.push(-1);
          }
          else if (i === this.page - 1 || i === this.page - 2) {
            this.pagination.push(i + 1);
          }
          else if (i === this.page) {
            this.pagination.push(i + 1);
          }
          else if (i === this.page + 1) {
            this.pagination.push(-1);
          }
          else if (i > this.totalPage - 3) {
            this.pagination.push(i + 1);
          }
        }
        else {
          if (i === this.totalPage - 7) {
            this.pagination.push(-1);
          }
          else if (i > this.totalPage - 7) {
            this.pagination.push(i + 1);
          }
        }
      }
      else {
        this.pagination.push(i + 1);
      }
    }


    
    setTimeout(function() {
      $('div.ag-tab-header').click();
    }, 50);
  }

  dateFormatter(e) {
    let date = new Date(e.value);
    var datewithouttimezone = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());    
    return e.context.componentParent.datePipe.transform(datewithouttimezone, 'yyyy/MM/dd');;
  }

  JPdateFormatter(e) {
    let date = new Date(e.value);    
    var datewithouttimezone = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());    
    return e.context.componentParent.datePipe.transform(datewithouttimezone, 'yyyy年MM月dd日');;
  }

  timeFormatter(e) {    
    let date = new Date(e.value);
    var datewithouttimezone = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());    
    return e.context.componentParent.datePipe.transform(datewithouttimezone, 'yyyy/MM/dd HH:mm');;
  }
}

/*
function customFilter() {

}

customFilter.prototype.init = function (params) {
  this.valueGetter = params.valueGetter;
  this.filterText = null;
  this.setupGui(params);
};
// not called by ag-Grid, just for us to help setup
customFilter.prototype.setupGui = function (params) {
  this.gui = document.createElement('div');
  this.gui.innerHTML =
      '<div style="padding: 4px; width: 200px;">' +
      '<div><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="Full name search..."/></div>' +
      '</div>';

  this.eFilterText = this.gui.querySelector('#filterText');
  this.eFilterText.addEventListener("changed", listener);
  this.eFilterText.addEventListener("paste", listener);
  this.eFilterText.addEventListener("input", listener);
  this.eFilterText.addEventListener("keydown", listener);
  this.eFilterText.addEventListener("keyup", listener);

  var that = this;
  function listener(event) {
    that.filterText = event.target.value;
    params.filterChangedCallback();
  }
};

customFilter.prototype.getGui = function () {
  return this.gui;
};

customFilter.prototype.doesFilterPass = function (params) {
  var passed = true;
  var valueGetter = this.valueGetter;

  this.filterText.toLowerCase().split(" ").forEach(function(filterWord) {
      var value = valueGetter(params);
      if (value.toString().toLowerCase().indexOf(filterWord)<0) {
          passed = false;
      }
  });
  return passed;
};

customFilter.prototype.isFilterActive = function () {
  return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
};

customFilter.prototype.getModel = function() {
  var model = {value: this.filterText.value};
  return model;
};

customFilter.prototype.setModel = function(model) {
  this.eFilterText.value = model.value;
};
*/
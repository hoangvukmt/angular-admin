import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Ultils } from '../../../../core/common/ultils';
import { HttpService } from '../../../../core/service/http.service';
import { API_URLS, RESULT_CODE } from '../../../../core/const';
import { SelectItemCommonComponent } from '../../popup/select-item-common/select-item-common.component';

declare var $: any;
@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.css']
})
export class AddTextComponent implements OnInit {
  keiyakuDetail = {
    agent_name: null,
    company_name: null,
    product_name: null,
    foreign_f_name: null,
    user_no: null,
    company_cd: null
  };
  fieldDisplay = {
    name: 'Hosho', 
    display: true, 
    text: '', 
    type: 0, 
    required: 0, 
    selType: 0, 
    listData: [], 
    maxlength: null
  };
  mainFormControl = new FormControl('', [
    Validators.required
  ]);
  noneFormControl = new FormControl('', []);
  lsData = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    public ultils: Ultils,
    public httpService: HttpService
  ) {
    this.keiyakuDetail.foreign_f_name = this.data.currencyName;
    this.keiyakuDetail.user_no = this.data.keiyakuData.user_no;
    this.keiyakuDetail.company_cd = this.data.keiyakuData.company_cd;
  }

  ngOnInit() {
    this.fieldDisplay.type = this.data.hosho.TypeF;
    this.fieldDisplay.required = this.data.hosho.requiredF;
    this.fieldDisplay.selType = this.data.hosho.SelType;

    if (this.fieldDisplay.type.toString() === '20' || this.fieldDisplay.type.toString() === '90' || this.fieldDisplay.type.toString() === '80') {
      const objSearch = {
        sel_type: this.fieldDisplay.selType
      };
      this.httpService.post(API_URLS.getSelectItem, objSearch).subscribe(res => {
        if (res.code === RESULT_CODE.success) {
          this.lsData = res.data;
        } else {
          console.log(res);
        }
      });
    }

    if (this.data.hosho.TypeF.toString() === '30' || this.data.hosho.TypeF.toString() === '35') {
      if (typeof this.data.hosho.ColumnVal !== 'undefined' && this.data.hosho.ColumnVal !== null && this.data.hosho.ColumnVal.toString().trim() !== '') {
        this.mainFormControl.setValue(new Date(this.data.hosho.ColumnVal));
      }
      this.mainFormControl.disable();
    }
    else if (this.data.hosho.TypeF.toString() === '70') {
      this.mainFormControl.setValue(this.data.hosho.ColumnVal);
      this.keiyakuDetail.agent_name = this.data.hosho.ColumnValText;
    }
    else if (this.data.hosho.TypeF.toString() === '50') {
      this.mainFormControl.setValue(this.data.hosho.ColumnVal);
      this.keiyakuDetail.company_name = this.data.hosho.ColumnValText;
    }
    else if (this.data.hosho.TypeF.toString() === '60') {
      this.mainFormControl.setValue(this.data.hosho.ColumnVal);
      this.keiyakuDetail.product_name = this.data.hosho.ColumnValText;
    }
    else if (this.data.hosho.TypeF.toString() === '80') {
      this.mainFormControl.setValue(this.data.hosho.ColumnVal);
      let columnOption = (typeof this.data.hosho.ColumnOption !== 'undefined' && this.data.hosho.ColumnOption !== null) ? parseInt(this.data.hosho.ColumnOption) : null;
      this.noneFormControl.setValue(columnOption);

      this.changeEvent();
    }
    else if (this.data.hosho.TypeF.toString() === '40') {
      let objSelected = {
        id: this.data.hosho.ColumnVal,
        title: this.data.hosho.ColumnValText
      }
      this.mainFormControl.setValue(objSelected);
    }
    else {
      this.mainFormControl.setValue(this.data.hosho.ColumnVal);
    }
  }

  saveData() {
    if (this.data.hosho.TypeF.toString() === '10') {
      this.data.hosho.ColumnVal = (typeof this.mainFormControl.value !== 'undefined' && this.mainFormControl.value !== null) ? this.mainFormControl.value.toString().replace(/,/g, '').replace(/円/g, '') : "";
    }
    else if (this.data.hosho.TypeF.toString() === '30' || this.data.hosho.TypeF.toString() === '35') {
      if (typeof this.mainFormControl.value !== 'undefined' && this.mainFormControl.value !== null && this.mainFormControl.value.toString() !== 'Invalid Date' && this.mainFormControl.value.toString().trim() !== '') {
        this.data.hosho.ColumnVal = this.ultils.dateToyyyyMMdd(this.mainFormControl.value);
      }
      else {
        this.data.hosho.ColumnVal = null;
      }
    }
    else if (this.data.hosho.TypeF.toString() === '20') {
      for(let i = 0; i < this.lsData.length; i++) {
        let item = this.lsData[i];
        if (this.mainFormControl.value.toString() === item.selNo.toString()) {
          this.data.hosho.ColumnValText = item.name;
          break;
        }
      }
      this.data.hosho.ColumnVal = this.mainFormControl.value;
    }
    else if (this.data.hosho.TypeF.toString() === '3') {
      this.data.hosho.ColumnVal = $('#' + this.fieldDisplay.name + 'Phone').val();
    }
    else if (this.data.hosho.TypeF.toString() === '40') {
      let objSelected = this.mainFormControl.value;
      if (typeof objSelected === 'string') {
        this.data.hosho.ColumnVal = objSelected;
        this.data.hosho.ColumnValText = objSelected;
      }
      else {
        this.data.hosho.ColumnVal = objSelected.id;
        this.data.hosho.ColumnValText = objSelected.title;
      }
    }
    else if (this.data.hosho.TypeF.toString() === '70') {
      this.data.hosho.ColumnValText = this.keiyakuDetail.agent_name;
      this.data.hosho.ColumnVal = this.mainFormControl.value;
    }
    else if (this.data.hosho.TypeF.toString() === '50') {
      this.data.hosho.ColumnValText = this.keiyakuDetail.company_name;
      this.data.hosho.ColumnVal = this.mainFormControl.value;
    }
    else if (this.data.hosho.TypeF.toString() === '90') {
      this.data.hosho.ColumnVal = this.mainFormControl.value;
      for (let i = 0; i < this.lsData.length; i++) {
        let item = this.lsData[i];
        if (item.selNo.toString() === this.mainFormControl.value) {
          this.data.hosho.ColumnValText = item.name;
          break;
        }
      }
    }
    else if (this.data.hosho.TypeF.toString() === '60') {
      this.data.hosho.ColumnValText = this.keiyakuDetail.product_name;
      this.data.hosho.ColumnVal = this.mainFormControl.value;
    }
    else if (this.data.hosho.TypeF.toString() === '80') {
      this.data.hosho.ColumnVal = this.mainFormControl.value;
      this.data.hosho.ColumnOption = this.noneFormControl.value;
      if (typeof this.noneFormControl.value !== 'undefined' && this.noneFormControl.value !== null) {
        for (let i = 0; i < this.lsData.length; i++) {
          let item = this.lsData[i];
          if (item.selNo.toString() === this.noneFormControl.value.toString()) {
            this.data.hosho.ColumnValText = (typeof this.mainFormControl.value !== 'undefined' && this.mainFormControl.value !== null ? this.mainFormControl.value : '') + item.name;
            break;
          }
        }
      }
    }
    else {
      this.data.hosho.ColumnVal = this.mainFormControl.value;
    }
    this.dialogRef.close(this.data);
  }

  changeEvent() {
    if (this.data.hosho.TypeF.toString() === '70') {
      const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
        width: '400px',
        data: { popupTitle: '代理店選択', category: 'AGENCY', userNo: this.keiyakuDetail.user_no },
        panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
      });
      dialogCommon.afterClosed().subscribe(result => {
        if (result) {
          this.keiyakuDetail.agent_name = result.AgentName;
          this.mainFormControl.setValue(result.AgentNo);
        }
      });
    }
    if (this.data.hosho.TypeF.toString() === '50') {
      const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
        width: '400px',
        data: { popupTitle: '保険会社ー覧', category: 'COMPANY' },
        panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
      });
      dialogCommon.afterClosed().subscribe(resultAfterClosed => {
        if (resultAfterClosed && resultAfterClosed.key === 'HANDLE') {
          this.mainFormControl.setValue(null);
          this.fieldDisplay.type = 1;
          this.data.hosho.TypeF = 1;
        }
        if (resultAfterClosed && resultAfterClosed.key !== 'HANDLE') {
          this.keiyakuDetail.company_name = resultAfterClosed.COMPANYNAME;
          this.mainFormControl.setValue(resultAfterClosed.COMPANYCD);
        }
      });
    }
    if (this.data.hosho.TypeF.toString() === '60') {
      const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
        width: '400px',
        data: { popupTitle: '保険商品名選択', category: 'INSURANCY-TYPE', company_cd: this.keiyakuDetail.company_cd },
        panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
      });
      dialogCommon.afterClosed().subscribe(result => {
        if (result && result.key === 'HANDLE') {
          this.mainFormControl.setValue(null);
          this.fieldDisplay.type = 1;
          this.data.hosho.TypeF = 1;
        }
        if (result && result.key !== 'HANDLE') {
          this.mainFormControl.setValue(result.PRODUCTCD);
          this.keiyakuDetail.product_name = result.PRODUCTNAME;
        }
      });
    }
    if (this.data.hosho.TypeF.toString() === '80') {
      if (typeof this.noneFormControl.value !== 'undefined' && this.noneFormControl.value !== null) {
        if (this.noneFormControl.value.toString() === '8' || this.noneFormControl.value.toString() === '3') {
          this.mainFormControl.setValue(null);
          this.mainFormControl.disable();
          return;
        }
        else {
          if (typeof this.mainFormControl.value !== 'undefined' && this.mainFormControl.value !== null && this.mainFormControl.value.toString() === '0') {
            this.mainFormControl.setValue(null);
          }
        }
        this.mainFormControl.enable();
      }
    }
  }

  checkRequired() {
    if (this.data.option.isShukeiyaku) {
      if (
        (typeof this.data.hosho.HoshoName === 'undefined' || this.data.hosho.HoshoName === null || this.data.hosho.HoshoName.trim() === '') &&
        (typeof this.data.hosho.Comment === 'undefined' || this.data.hosho.Comment === null || this.data.hosho.Comment.trim() === '') &&
        (typeof this.mainFormControl.value === 'undefined' || this.mainFormControl.value === null || this.mainFormControl.value.toString().trim() === '') &&
        (
          this.data.hosho.TypeF.toString() !== '80' || (this.data.hosho.TypeF.toString() === '80' && (typeof this.noneFormControl.value === 'undefined' || this.noneFormControl.value === null || this.noneFormControl.value.toString().trim() === ''))
        )
      ) {
        return true;
      }
    }
    else {
      if (
        (typeof this.data.tokuyaku.TokuyakuName === 'undefined' || this.data.tokuyaku.TokuyakuName === null || this.data.tokuyaku.TokuyakuName.trim() === '') &&
        (typeof this.data.hosho.HoshoName === 'undefined' || this.data.hosho.HoshoName === null || this.data.hosho.HoshoName.trim() === '') &&
        (typeof this.data.hosho.Comment === 'undefined' || this.data.hosho.Comment === null || this.data.hosho.Comment.trim() === '') &&
        (typeof this.mainFormControl.value === 'undefined' || this.mainFormControl.value === null || this.mainFormControl.value.toString().trim() === '') &&
        (
          this.data.hosho.TypeF.toString() !== '80' || (this.data.hosho.TypeF.toString() === '80' && (typeof this.noneFormControl.value === 'undefined' || this.noneFormControl.value === null || this.noneFormControl.value.toString().trim() === ''))
        )
      ) {
        return true;
      }
    }

    return false;
  }
}

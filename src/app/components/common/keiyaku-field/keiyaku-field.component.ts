import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from './../../../core/service/http.service';
import { API_URLS, RESULT_CODE } from '../../../core/const';

declare var $: any;
@Component({
  selector: 'app-keiyaku-field',
  templateUrl: './keiyaku-field.component.html',
  styleUrls: ['./keiyaku-field.component.css']
})
export class KeiyakuFieldComponent implements OnInit {
  @Input() keiyakuDetail: any;
  @Input() fieldDisplay = {
    name: '', 
    display: false, 
    text: '', 
    type: 0, 
    required: 0, 
    selType: 0,
    listData: []
  };
  @Input() formModel: FormControl;
  @Input() secondModel: FormControl;
  @Output() eventOut = new EventEmitter<any>();

  public moneyNumber: number;

  constructor(
    private toastr: ToastrService,
    public httpService: HttpService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.fieldDisplay.type.toString() === '20' || this.fieldDisplay.type.toString() === '90' || this.fieldDisplay.type.toString() === '80' || this.fieldDisplay.type.toString() === '100') {
      const objSearch = {
        sel_type: this.fieldDisplay.selType
      };
      this.httpService.post(API_URLS.getSelectItem, objSearch).subscribe(res => {
        if (res.code === RESULT_CODE.success) {
          this.fieldDisplay.listData = res.data;
        } else {
          console.log(res);
          this.toastr.error('', res.message);
        }
      });
      this.convertToCurrency();
    }
    if (this.fieldDisplay.type.toString() === '10') {
      this.convertToMoney();
    }
    if (this.fieldDisplay.name === "Hosho" && this.fieldDisplay.type.toString() === '40') {
      this.httpService.post(API_URLS.getListFamily, { user_no: this.keiyakuDetail.user_no }).subscribe(res => {
        if (res.code === RESULT_CODE.success) {
          this.fieldDisplay.listData = [];
          res.data.forEach(person => {
            this.fieldDisplay.listData.push({ id: person.FamilyNo, title: person.LastName + ' ' + person.FirstName });
          });
        } else {
          console.log(res);
          this.toastr.error('', res.message);
        }
      });
    }
  }

  doEventOut() {
    localStorage.setItem("ls-item-for-get", JSON.stringify(this.fieldDisplay.listData));
    this.eventOut.emit();
  }

  convertToMoney() {
    if (typeof $('#moneyOf' + this.fieldDisplay.name).val() !== "undefined") {
      this.moneyNumber = Number($('#moneyOf' + this.fieldDisplay.name).val()) !== 0 ? Number($('#moneyOf' + this.fieldDisplay.name).val()) : null;
    }
    $('#moneyOf' + this.fieldDisplay.name).attr('type', 'text');
    if (typeof this.formModel.value === "undefined" || this.formModel.value === null || this.formModel.value.toString() === '') {
      this.formModel.setValue(this.moneyNumber);
    }
    else {
      if (typeof this.formModel.value !== "undefined") {
        let value = this.formModel.value.toString();
        if (value.length > 12) {
          value = value.substr(0, 12);
        }
        value = value.replace(/,/g, '').replace(/円/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this,this.formModel.setValue(value);
      }
    }
  }

  convertToCurrency() {
    if (typeof $('#moneyOf' + this.fieldDisplay.name).val() !== "undefined") {
      this.moneyNumber = Number($('#moneyOf' + this.fieldDisplay.name).val()) !== 0 ? Number($('#moneyOf' + this.fieldDisplay.name).val()) : null;
    }
    $('#moneyOf' + this.fieldDisplay.name).attr('type', 'text');
    if (typeof this.formModel.value === "undefined" || this.formModel.value === null || this.formModel.value.toString() === '') {
      this.formModel.setValue(this.moneyNumber);
    }
    else {
      if (typeof this.formModel.value !== "undefined") {
        let value = this.formModel.value.toString();
        if (value.length > 12) {
          value = value.substr(0, 12);
        }
        value = value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this,this.formModel.setValue(value);
      }
    }
  }

  convertToNumber() {
    $('#moneyOf' + this.fieldDisplay.name).attr('type', 'number');
    if (typeof this.formModel.value !== "undefined" && this.formModel.value !== null) {
      let value = this.formModel.value.toString();
      value = value.replace(/,/g, '');
      value = value.replace('円', '');
      this.formModel.setValue(value);
    }
  }

  changeOption() {
    if (this.fieldDisplay.name === 'HKikanF' || this.fieldDisplay.name === 'PKikanF') {
      if (this.formModel.value.toString() === '3') {
        this.formModel.disable();
        if (this.fieldDisplay.name === 'HKikanF') {
          this.keiyakuDetail.h_kikan = null;
        }
        else if (this.fieldDisplay.name === 'PKikanF') {
          this.keiyakuDetail.p_kikan = null;
        }
        return;
      }
      this.formModel.enable();
    }
  }

  displayFn(state) {
    return state.title;
  }

}

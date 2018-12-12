import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Ultils } from '../../../../core/common/ultils';

@Component({
  selector: 'app-add-insurance-company',
  templateUrl: './add-insurance-company.component.html',
  styleUrls: ['./add-insurance-company.component.css']
})
export class AddInsuranceCompanyComponent implements OnInit {
  companyData = {
    companyName: "",
    tantoName: "",
    phone: "",
    url: ""
  };
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  tantoNameFormControl = new FormControl('', [
  ]);
  phoneFormControl = new FormControl('', [
  ]);
  urlFormControl = new FormControl('', [
    Ultils.ValidURL
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddInsuranceCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService
  ) {
    this.companyData = data;
  }

  ngOnInit() {
    this.nameFormControl.setValue(this.companyData.companyName);
    this.tantoNameFormControl.setValue(this.companyData.tantoName);
    this.phoneFormControl.setValue(typeof this.companyData.phone !== "undefined" && this.companyData.phone !== null ? this.companyData.phone.trim() : "");
    this.urlFormControl.setValue(this.companyData.url);
  }

  ngAfterViewInit() {
    
  }

  choseCompany(): void {
    this.dialogRef.close({ key: 'CHOSE-COMPANY' });
  }

  doSave(): void {
    if (this.data.type === 'auto') {
      this.dialogRef.close({
        tantoName: this.tantoNameFormControl.value, 
        phone: (this.phoneFormControl.value !== null ? this.phoneFormControl.value.toString() : null), 
        url: this.urlFormControl.value, 
        memo: this.data.memo
      });
    } else {
      this.dialogRef.close({
        name: this.nameFormControl.value,
        tantoName: this.tantoNameFormControl.value, 
        phone: (this.phoneFormControl.value !== null ? this.phoneFormControl.value.toString() : null),
        url: this.urlFormControl.value,
        memo: this.data.memo
      });
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }

}

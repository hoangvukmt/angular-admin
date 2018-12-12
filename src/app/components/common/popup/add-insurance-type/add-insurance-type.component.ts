import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-insurance-type',
  templateUrl: './add-insurance-type.component.html',
  styleUrls: ['./add-insurance-type.component.css']
})
export class AddInsuranceTypeComponent implements OnInit {
  productNameFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddInsuranceTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  saveProduct(): void {
    this.dialogRef.close({key: this.productNameFormControl.value});
  }

}

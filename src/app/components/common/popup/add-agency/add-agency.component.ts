import { HttpService } from '../../../../core/service/http.service';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { API_URLS, ROUTER_URL, RESULT_CODE } from '../../../../core/const';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Ultils } from "./../../../../core/common/ultils";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})
export class AddAgencyComponent implements OnInit {
  protected API_URLS = API_URLS;
  public ROUTER_URL = ROUTER_URL;
  protected RESULT_CODE = RESULT_CODE;
  public requestResult = {
    err: false,
    msg: ''
  };
  agentNameFormControl = new FormControl('', [
    Validators.required
  ]);
  tantoNameFormControl = new FormControl('', [
  ]);
  phoneFormControl = new FormControl('', [
  ]);
  keiyakuPageFormControl = new FormControl('', [
    Ultils.ValidURL
  ]);

  constructor(
    private toastr: ToastrService,
    public translate: TranslateService,
    public httpService: HttpService,
    public dialogRef: MatDialogRef<AddAgencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  createAgent() {
    let formData = {
      user_no: this.data.userNo,
      agent_name: this.agentNameFormControl.value,
      tanto_name: this.tantoNameFormControl.value,
      phone: this.phoneFormControl.value,
      keiyaku_page: this.keiyakuPageFormControl.value
    }
    this.httpService.post(this.API_URLS.createAgent, formData).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.dialogRef.close({ AgentNo: res.data, agentName: this.agentNameFormControl.value });
      } else {
        this.toastr.error('', res.message);
      }
    });
  }
}

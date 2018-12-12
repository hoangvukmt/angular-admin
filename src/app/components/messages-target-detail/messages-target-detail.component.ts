import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { ViewImageComponent } from '../common/popup/view-image/view-image.component';
import { HttpService } from '../../core/service/http.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-messages-target-detail',
  templateUrl: './messages-target-detail.component.html',
  styleUrls: ['./messages-target-detail.component.css']
})
export class MessagesTargetDetailComponent extends BaseCpnComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public id: number;
  public objMenu = {
    currentMenu: 'menu-2',
  }
  public objTab = {
    currentTab: 'tab-1',
    hasBack: true,
    backToPage: true,
    backTitle: 'ターゲット一覧',
    tabList: [
      { title: 'ターゲット配信詳細', id: 'tab-1', url: 'no-url' }
    ]
  }
  public haishinLogDetail = {
    TargetF: 0,
    TargetSex: null,
    MarriageF: null,
    HasChildF: null,
    TargetAge: null,
    TargetName: "",
    KanyuShiteiF: 0,
    KanyuShiteiName: "",
    KanyuHoshoCategoryName: "",
    KanyuF: 0,
    KikanDays: 0,
    KikanF: 2,
    KikanName: "",
    TargetCount: 0,
    MessageTitle: "",
    Message: "",
    GroupID: 0
  };
  public lsImages = [];
  
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public httpService: HttpService,
    public translate: TranslateService
  ) {
    super(translate, 'messages-target-detail');

    this.route.params.subscribe(paramsId => {
      this.id = Number(paramsId.id);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  doBack() {
    this.router.navigate(['/' + this.ROUTER_URL.messagesTarget]);
  }

  loadData(): void {
    let objSearch = {
      haishin_id: this.id
    }
    this.httpService.post(this.API_URLS.getHaishinLogDetail, objSearch).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.haishinLogDetail = res.data;
        if (this.haishinLogDetail.KikanF === 0) {
          this.haishinLogDetail.KikanName = this.translate.instant("all");
        } else if (this.haishinLogDetail.KikanF === 2) {
          this.haishinLogDetail.KikanName = this.haishinLogDetail.KikanDays + " " + this.translate.instant("notActiveManyDay");
        }
        else {
          this.haishinLogDetail.KikanName = this.haishinLogDetail.KikanDays + " " + this.translate.instant("notActiveOneDay");
        }

        if (this.haishinLogDetail.KanyuShiteiF === 0) {
          this.haishinLogDetail.KanyuShiteiName = this.translate.instant("statusRegis.notDefinition");
        }
        else {
          if (this.haishinLogDetail.KanyuF === 0) {
            this.haishinLogDetail.KanyuShiteiName = this.haishinLogDetail.KanyuHoshoCategoryName + " " + this.translate.instant("statusRegis.notAccess");
          }
          else {
            this.haishinLogDetail.KanyuShiteiName = this.haishinLogDetail.KanyuHoshoCategoryName + " " + this.translate.instant("statusRegis.access");
          }
        }

        if (this.haishinLogDetail.TargetF === 0) {
          this.haishinLogDetail.TargetName = this.translate.instant("targetOption.all");
        }
        else {
          this.haishinLogDetail.TargetName = "";
          if (this.haishinLogDetail.TargetSex === 0) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.men") + ", ";
          }
          else if (this.haishinLogDetail.TargetSex === 1) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.women") + ", ";
          }
          else if (this.haishinLogDetail.TargetSex === 2) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.men") + ", " + this.translate.instant("targetOption.women") + ", ";
          }

          if (this.haishinLogDetail.MarriageF === 0) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.married") + ", ";
          }
          else if (this.haishinLogDetail.MarriageF === 1) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.single") + ", ";
          }
          else if (this.haishinLogDetail.MarriageF === 2) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.married") + ", " + this.translate.instant("targetOption.single") + ", ";
          }

          if (this.haishinLogDetail.HasChildF === 0) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.hasChild") + ", ";
          }
          else if (this.haishinLogDetail.HasChildF === 1) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.noChild") + ", ";
          }
          else if (this.haishinLogDetail.HasChildF === 2) {
            this.haishinLogDetail.TargetName += this.translate.instant("targetOption.hasChild") + ", " + this.translate.instant("targetOption.noChild") + ", ";
          }

          if (this.haishinLogDetail.TargetAge !== null) {
            switch (this.haishinLogDetail.TargetAge) {
              case 1:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", ";
                break;
              case 2:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", ";
                break;
              case 3:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", ";
                break;
              case 4:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.40") + ", ";
                break;
              case 5:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.40") + ", ";
                break;
              case 6:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", ";
                break;
              case 7:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", ";
                break;
              case 8:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.50") + ", ";
                break;
              case 9:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 10:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 11:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 12:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 13:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 14:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 15:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", ";
                break;
              case 16:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.60") + ", ";
                break;
              case 17:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 18:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 19:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 20:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 21:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 22:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 23:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 24:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 25:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 26:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 27:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 28:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 29:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 30:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
              case 31:
                this.haishinLogDetail.TargetName += this.translate.instant("targetOption.20") + ", " + this.translate.instant("targetOption.30") + ", " + this.translate.instant("targetOption.40") + ", " + this.translate.instant("targetOption.50") + ", " + this.translate.instant("targetOption.60") + ", ";
                break;
            }
          }
        }

        if (this.haishinLogDetail.GroupID !== null && this.haishinLogDetail.GroupID.toString() !== "0") {
          let objSearch = {
            group_id: this.haishinLogDetail.GroupID
          }
          this.httpService.post(this.API_URLS.getListFileUpload, objSearch).subscribe(res => {
            if (res.code === this.RESULT_CODE.success) {
              this.lsImages = res.data;
            } else {
              console.log(res);
            }
          });
        }
      } else {
        console.log(res);
      }
    });
  }

  viewImage(data, type): void {
    const dialogView = this.dialog.open(ViewImageComponent, {
      width: '800px',
      data: { type: type, data: data },
      panelClass: []
    });
    dialogView.afterClosed().subscribe(result => {
      
    });
  }

}

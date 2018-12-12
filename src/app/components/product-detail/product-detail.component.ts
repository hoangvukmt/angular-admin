import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { HttpService } from '../../core/service/http.service'
import {$BACKSLASH} from "codelyzer/angular/styles/chars";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent extends BaseCpnComponent implements OnInit {
  public id: number;
  public objMenu = {
    currentMenu: 'menu-1',
  }
  public objTab = {};

  public keiyakuData = {
    Address: null,
    AgentName: null,
    AgentNo: null,
    CarName: null,
    CategoryCd: null,
    CompanyCd: null,
    CompanyName: null,
    ContactAccident: null,
    ContactCarFailure: null,
    ContractDate: null,
    CreateDate: null,
    CurrencyF: null,
    CurrencyFName: null,
    DelF: null,
    FamilyName: null,
    FamilyNo: null,
    FirstName: null,
    ForeignF: null,
    ForeignFName: null,
    GroupID: null,
    HKikan: null,
    HKikanF: null,
    HKikanName: null,
    Haraikata: null,
    HaraikataName: null,
    HihoFamilyName: null,
    HihoFamilyNo: null,
    HokenEndDate: null,
    HokenP: null,
    HoshoCategoryF: null,
    KaniShindanF: null,
    KeiyakuNo: null,
    LastName: null,
    Memo: null,
    NyuryokuF: null,
    PKikan: null,
    PKikanF: null,
    PKikanName: null,
    Phone: null,
    PolicyNo: null,
    ProductCd: null,
    ProductName: null,
    RegistNo: null,
    ShokenBunsekiF: null,
    Status: null,
    TantoNameCompany: null,
    TantoNameKeiyaku: null,
    URL: null,
    UpdateDate: null,
    UserNo: null,
    registeredF: null,
    StatusName: null,
    HoshoCategoryFName: null
  }
  public shukeiyakuData = [];
  public tokuyakuData = [];
  public previousUrl = '';
  public hokenPMounth = '';
  public hokenPYear = '';
  public objectKeys = Object.keys;
  public lsKeiyakuHosho = [];

  private sub: any

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public httpService: HttpService
  ) {
    super(translate, 'product-detail');

    this.sub = this.route.params.subscribe(paramsId => {
      this.id = Number(paramsId.id);
    });

    if (localStorage.getItem('previousUrl') == 'PC') {
        this.previousUrl = "カテゴリー別"
    } else if (localStorage.getItem('previousUrl') == 'PF') {
        this.previousUrl = "家族別商品一覧"
    }


    this.objTab = {
      currentTab: 'tab-1',
      hasBack: true,
      backToPage: true,
      backTitle: this.previousUrl,
      tabList: [
        { title: '商品情報詳細', id: 'tab-1', url: 'no-url' },
        { title: '画像一覧', id: 'tab-2', url: this.ROUTER_URL.productImage + "/" + this.id }
      ]
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    let params = {
      keiyaku_no: this.id
    }

    this.httpService.post(this.API_URLS.getProductByKeiyakuno, params).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          this.keiyakuData = res.data.keiyaku;
          this.shukeiyakuData = res.data.shukeiyaku;
          this.tokuyakuData = res.data.tokuyaku;
          
          this.caculatorHokenP(this.keiyakuData.HokenP, this.keiyakuData.Haraikata);
          this.loadKeiyakuHosho();
        } else {
          console.log(res);
          this.toastr.error('', 'ERROR');
        }
    });
  }

  loadKeiyakuHosho(): void {
    let params = {
      hosho_category_f: this.keiyakuData.HoshoCategoryF
    }
    this.httpService.post(this.API_URLS.getListKeiyakuHosho, params).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        this.lsKeiyakuHosho = res.data;
      } else {
        console.log(res);
        this.toastr.error('', 'ERROR');
      }
    });
  }

  doBack(): void {
    this.router.navigate([localStorage.getItem('tab-back-to-page')]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  convertToMoney(str, alowZero): string {
    if (str !== null && str.toString() !== "" && str.toString() !== "0") {
      return str.toString().replace(this.keiyakuData.CurrencyFName, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
    }
    if (alowZero) {
      return '0' + this.keiyakuData.CurrencyFName;;
    }
    else {
      return ''; 
    }
  }

  caculatorHokenP(hokenP, haraikata): void {
    if (hokenP !== null && hokenP.toString() !== '' && hokenP.toString() !== '0') {
      switch (haraikata) {
        case 1:
          this.hokenPMounth = (Math.round(parseFloat(hokenP)/12)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
          this.hokenPYear = hokenP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;
          break;
        case 2:
          this.hokenPMounth = (Math.round(parseFloat(hokenP)/6)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
          this.hokenPYear = (Math.round(parseFloat(hokenP)*2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
          break;
        case 3:
          this.hokenPMounth = hokenP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
          this.hokenPYear = (parseFloat(hokenP)*12).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.CurrencyFName;;
          break;
        default:
          this.hokenPMounth = '0' + this.keiyakuData.CurrencyFName;;
          this.hokenPYear = '0' + this.keiyakuData.CurrencyFName;;
          break;
      }
    }
    else {
      this.hokenPMounth = '0' + this.keiyakuData.CurrencyFName;;
      this.hokenPYear = '0' + this.keiyakuData.CurrencyFName;;
    }
  }

  strToArr(str): any {
    let arrReturn = JSON.parse(str.replace(/(\r\n\t|\n|\r\t)/gm,"<br />"));
    return arrReturn;
  }

  mapValueToViewValueHosho(data) {
    if(data.TypeF.toString() === '10') {
      if (!isNaN(data.ColumnVal) && data.HoshoNo !== null && data.HoshoNo.toString() !== '0') {
        return data.ColumnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuData.ForeignFName;
      } else {
        return data.ColumnVal;
      }
    }
    else if (
      data.TypeF.toString() === '20' || 
      data.TypeF.toString() === '40' || 
      data.TypeF.toString() === '50' || 
      data.TypeF.toString() === '60' || 
      data.TypeF.toString() === '70' || 
      data.TypeF.toString() === '90' ||
      data.TypeF.toString() === '80'
    ){
      return data.ColumnValText;
    }
    else if (data.TypeF.toString() === '35') {
      if (data.ColumnVal !== null) {
        let arrDate = data.ColumnVal.split('-');
        if (arrDate.length >= 2) {
          return arrDate[0] + '年' + arrDate[1] + '月';
        }
      }
      return '';
    }
    else {
      return data.ColumnVal;
    }
  }
}

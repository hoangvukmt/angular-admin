import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { BaseCpnComponent } from '../../core/base-cpn/base-cpn.component';
import { HttpService } from '../../core/service/http.service';
import { Ultils } from '../../core/common/ultils';
import { SelectItemCommonComponent } from '../common/popup/select-item-common/select-item-common.component';
import { AddAgencyComponent } from '../common/popup/add-agency/add-agency.component';
import { AddInsuranceCompanyComponent } from '../common/popup/add-insurance-company/add-insurance-company.component';
import { AddInsuranceTypeComponent } from '../common/popup/add-insurance-type/add-insurance-type.component';
import { AddTextComponent } from '../common/popup/add-text/add-text.component';
import { ConfirmDialogComponent } from '../common/popup/confirm-dialog/confirm-dialog.component';
import { SendMessageComponent } from '../common/popup/send-message/send-message.component';

declare var $: any;
@Component({
  selector: 'app-ocr-detail',
  templateUrl: './ocr-detail.component.html',
  styleUrls: ['./ocr-detail.component.css']
})
export class OcrDetailComponent extends BaseCpnComponent implements OnInit, OnDestroy {
  //#region Define variable -----------------------------------------------------------------------
  agentFormControl = new FormControl('', [
    Validators.required
  ]);
  companyFormControl = new FormControl('', [
    Validators.required
  ]);
  categoryFormControl = new FormControl('', [
    Validators.required
  ]);
  productFormControl = new FormControl('', [
    Validators.required
  ]);
  policyNoFormControl = new FormControl('', [
    Validators.required
  ]);
  statusFormControl = new FormControl('', [
    Validators.required
  ]);
  familyNoFormControl = new FormControl('', [
    Validators.required
  ]);
  hihoFamilyNoFormControl = new FormControl('', [
    Validators.required
  ]);
  contractDateFormControl = new FormControl('', [
    Validators.required
  ]);
  hokenEndDateFormControl = new FormControl('', [
    Validators.required
  ]);
  hKikanFormControl = new FormControl('', [
    Validators.required
  ]);
  hKikanFFormControl = new FormControl('', [
    Validators.required
  ]);
  hokenPFormControl = new FormControl('', [
    Validators.required
  ]);
  haraikataFormControl = new FormControl('', [
    Validators.required
  ]);
  pKikanFormControl = new FormControl('', [
    Validators.required
  ]);
  pKikanFFormControl = new FormControl('', [
    Validators.required
  ]);
  foreignFFormControl = new FormControl('0', [
    Validators.required
  ]);
  contactAccidentFormControl = new FormControl('', [
    Validators.required
  ]);
  contactCarFailureFormControl = new FormControl('', [
    Validators.required
  ]);
  carNameFormControl = new FormControl('', [
    Validators.required
  ]);
  registNoFormControl = new FormControl('', [
    Validators.required
  ]);
  addressFormControl = new FormControl('', [
    Validators.required
  ]);
  currencyFFormControl = new FormControl('0', [
    Validators.required
  ]);

  noneFormControl = new FormControl('', []);

  public listFamily = [];
  public listShukeiyaku = [];
  public listTokuyaku = [];
  public isPopupShow = false;
  public invalidType = false;
  public lsMainItem = [];

  public fieldOfKeiyaku = {
    Agent: {name: 'Agent', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    Company: {name: 'Company', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    Category: {name: 'Category', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    Product: {name: 'Product', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    PolicyNo: {name: 'PolicyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 30},
    Status: {name: 'Status', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    FamilyNo: {name: 'FamilyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    HihoFamilyNo: {name: 'HihoFamilyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    ContractDate: {name: 'ContractDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    StartDate: {name: 'StartDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    HokenEndDate: {name: 'HokenEndDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    HKikan: {name: 'HKikan', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 2},
    HokenP: {name: 'HokenP', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    Haraikata: {name: 'Haraikata', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    PKikan: {name: 'PKikan', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 2},
    ForeignF: {name: 'ForeignF', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    ContactAccident: {name: 'ContactAccident', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    ContactCarFailure: {name: 'ContactCarFailure', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    CarName: {name: 'CarName', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    RegistNo: {name: 'RegistNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
    Address: {name: 'Address', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null}
  };
  public keiyakuDetail = {
    keiyaku_no: 0,
    hosho_category_f: null,
    group_id: 0,
    agent_no: null,
    agent_name: null,
    company_cd: null,
    company_name: null,
    tanto_name_company: null,
    phone: null,
    url: null,
    memo: null,
    product_cd: null,
    product_name: null,
    category_cd: null,
    policy_no: null,
    status: null,
    h_kikan: null,
    h_kikan_f: null,
    hoken_p: null,
    p_kikan: null,
    p_kikan_f: null,
    haraikata: null,
    family_no: null,
    family_name: null,
    hiho_family_no: null,
    hiho_family_name: null,
    contract_date: null,
    hoken_end_date: null,
    nyuryoku_f: null,
    foreign_f: null,
    contact_accident: null,
    contact_car_failure: null,
    car_name: null,
    regist_no: null,
    address: null,
    currency_f: null,
    foreign_f_name: '円',
    shukeiyaku: [],
    tokuyakus: [],
    shukeiyaku_delete: [],
    tokuyakus_delete: [],
    file_uploads: [],
    user_no: null
  };

  public objMenu = {
    currentMenu: 'menu-3'
  };
  imageClose = 'backToListOcr';
  heightBody = 0;
  //#endregion

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
    public translate: TranslateService,
    public httpService: HttpService,
    private route: ActivatedRoute,
    public router: Router,
    public ultils: Ultils
  ) {
    super(translate, 'ocr-detail');
  }

  ngOnInit() {
    this.route.params.subscribe(paramsId => {
      this.keiyakuDetail.keiyaku_no = Number(paramsId.id);
      this.initData();
    });
    this.heightBody = $(window).height() - 140;

    (window as any).forceKatakana();
    (window as any).forceKatakanaNumber();

    window['backToListOcr'] = {
      componentFn: (param) => this.backToListOcr(), 
      component: this
    };
  }

  ngOnDestroy() {
    (window as any).stopForceKatakana();
    (window as any).stopForceKatakanaNumber();
  }

  onResize(event: any) {
    this.heightBody = $(window).height() - 140;
    this.checkWindow();
  }

  checkWindow() {
    setTimeout(function() {
      let checkRegions = $('.checkRegion');
      for (let j = 0; j < checkRegions.length; j++) {
        let checkRegion = checkRegions[j];
        let regionItem = $(checkRegion).find('.form-row');
        for (let i = 0; i < regionItem.length; i++) {
          let item = regionItem[i];
          let rowContent = $(item).find('.row-content');
          let rowTitle = $(rowContent).find('.row-title');
          let rowValue = $(rowContent).find('.row-value');
          if (($(rowTitle).width() + $(rowValue).width()) > $(rowContent).width()) {
            $(rowValue).css("float", "left");
          }
          else {
            $(rowValue).css("float", "right");
          }
        }
      }
    }, 500);
  }

  initData(): void {
    if (this.keiyakuDetail.keiyaku_no > 0) {
      this.httpService.post(this.API_URLS.getProductByKeiyakuno, { keiyaku_no: this.keiyakuDetail.keiyaku_no }).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          let keiData = res.data;

          this.keiyakuDetail.keiyaku_no = keiData.keiyaku.KeiyakuNo;
          this.keiyakuDetail.hosho_category_f = keiData.keiyaku.HoshoCategoryF;
          this.keiyakuDetail.group_id = keiData.keiyaku.GroupID;
          this.keiyakuDetail.agent_no = keiData.keiyaku.AgentNo;
          this.keiyakuDetail.agent_name = keiData.keiyaku.AgentName;
          this.keiyakuDetail.company_cd = keiData.keiyaku.CompanyCd;
          this.keiyakuDetail.company_name = keiData.keiyaku.CompanyName;
          this.keiyakuDetail.tanto_name_company = keiData.keiyaku.TantoNameCompany;
          this.keiyakuDetail.phone = keiData.keiyaku.Phone;
          this.keiyakuDetail.url = keiData.keiyaku.URL;
          this.keiyakuDetail.memo = keiData.keiyaku.Memo;
          this.keiyakuDetail.product_cd = keiData.keiyaku.ProductCd;
          this.keiyakuDetail.product_name = keiData.keiyaku.ProductName;
          this.keiyakuDetail.category_cd = keiData.keiyaku.CategoryCd;
          this.keiyakuDetail.policy_no = keiData.keiyaku.PolicyNo;
          this.keiyakuDetail.status = keiData.keiyaku.Status;
          this.keiyakuDetail.h_kikan = keiData.keiyaku.HKikan;
          this.keiyakuDetail.h_kikan_f = keiData.keiyaku.HKikanF;
          this.keiyakuDetail.hoken_p = keiData.keiyaku.HokenP;
          this.keiyakuDetail.p_kikan = keiData.keiyaku.PKikan;
          this.keiyakuDetail.p_kikan_f = keiData.keiyaku.PKikanF;
          this.keiyakuDetail.haraikata = keiData.keiyaku.Haraikata;
          this.keiyakuDetail.family_no = keiData.keiyaku.FamilyNo;
          this.keiyakuDetail.family_name = keiData.keiyaku.FamilyName;
          this.keiyakuDetail.hiho_family_no = keiData.keiyaku.HihoFamilyNo;
          this.keiyakuDetail.hiho_family_name = keiData.keiyaku.HihoFamilyName;
          this.keiyakuDetail.contract_date = keiData.keiyaku.ContractDate;
          this.keiyakuDetail.hoken_end_date = keiData.keiyaku.HokenEndDate;
          this.keiyakuDetail.nyuryoku_f = keiData.keiyaku.NyuryokuF;
          this.keiyakuDetail.user_no = keiData.keiyaku.UserNo;
          this.keiyakuDetail.foreign_f = keiData.keiyaku.ForeignF;
          this.keiyakuDetail.contact_accident = keiData.keiyaku.ContactAccident;
          this.keiyakuDetail.contact_car_failure = keiData.keiyaku.ContactCarFailure;
          this.keiyakuDetail.car_name = keiData.keiyaku.CarName;
          this.keiyakuDetail.regist_no = keiData.keiyaku.RegistNo;
          this.keiyakuDetail.address = keiData.keiyaku.Address;
          this.keiyakuDetail.currency_f = keiData.keiyaku.CurrencyF;
          this.keiyakuDetail.foreign_f_name = keiData.keiyaku.ForeignFName;

          this.listShukeiyaku = keiData.shukeiyaku;
          this.listTokuyaku = keiData.tokuyaku;
          
          for (let i = 0; i < this.listTokuyaku.length; i ++) {
            let item = this.listTokuyaku[i];
            item.tokuyakuHosho = this.strToArr(item.tokuyakuHosho);
          } 

          this.getKeiyakuHosho(this.keiyakuDetail.hosho_category_f).then(() => {
            this.mapDataFromControll();
            this.callApiGetFamily();
          });
          this.checkWindow();
        }
        else {
          console.log(res);
          this.toastr.error('', res.message);
        }
      });
    }
  }

  choseAgency(): void {
    const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
      width: '400px',
      data: { popupTitle: '代理店選択', category: 'AGENCY', userNo: this.keiyakuDetail.user_no },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });

    dialogCommon.afterClosed().subscribe(result => {
      if (result && result.key === 'HANDLE') {
        const dialogAgency = this.dialog.open(AddAgencyComponent, {
          width: '400px',
          data: {},
          panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
        });

        dialogAgency.afterClosed().subscribe(resultHandle => {
          if (resultHandle) {
            this.keiyakuDetail.agent_name = resultHandle.AgentName;
            this.keiyakuDetail.agent_no = resultHandle.AgentNo;
          }
        });
        return;
      }
      if (result) {
        this.keiyakuDetail.agent_no = result.AgentNo;
        this.keiyakuDetail.agent_name = result.AgentName;
      }
    });
  }

  addInsuranceCompany(): void {
    const dialogCompany = this.dialog.open(AddInsuranceCompanyComponent, {
      width: '400px',
      data: {
        type: 'auto',
        companyName: this.keiyakuDetail.company_name,
        tantoName: this.keiyakuDetail.tanto_name_company,
        phone: this.keiyakuDetail.phone,
        url: this.keiyakuDetail.url,
        memo: this.keiyakuDetail.memo
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });

    dialogCompany.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result.key === 'CHOSE-COMPANY') {
          const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
            width: '400px',
            data: { popupTitle: '保険会社ー覧', category: 'COMPANY' },
            panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
          });
          dialogCommon.afterClosed().subscribe(resultAfterClosed => {
            if (resultAfterClosed && resultAfterClosed.key === 'HANDLE') {
              const dialogHandler = this.dialog.open(AddInsuranceCompanyComponent, {
                width: '400px',
                data: {
                  type: 'handler',
                  name: '',
                  tantoName: '',
                  phone: '',
                  url: '',
                  memo: ''
                },
                panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
              });
              dialogHandler.afterClosed().subscribe(resultHandler => {
                if (resultHandler) {
                  this.keiyakuDetail.company_name = resultHandler.name;
                  this.keiyakuDetail.tanto_name_company = resultHandler.tantoName;
                  this.keiyakuDetail.phone = resultHandler.phone;
                  this.keiyakuDetail.url = resultHandler.url;
                  this.keiyakuDetail.memo = resultHandler.memo;
                }
              });
            }
            if (resultAfterClosed && resultAfterClosed.key !== 'HANDLE') {
              const dialogText = this.dialog.open(AddInsuranceCompanyComponent, {
                width: '400px',
                data: {
                  type: 'auto',
                  companyName: resultAfterClosed.COMPANYNAME,
                  tantoName: resultAfterClosed.TantoName,
                  phone: resultAfterClosed.Phone,
                  url: resultAfterClosed.URL,
                  memo: resultAfterClosed.Memo
                },
                panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
              });
              dialogText.afterClosed().subscribe(resultFinal => {
                if (resultFinal) {
                  this.keiyakuDetail.company_name = resultAfterClosed.COMPANYNAME;
                  this.keiyakuDetail.company_cd = resultAfterClosed.COMPANYCD;
                  this.keiyakuDetail.tanto_name_company = resultFinal.tantoName;
                  this.keiyakuDetail.phone = resultFinal.phone;
                  this.keiyakuDetail.url = resultFinal.url;
                  this.keiyakuDetail.memo = resultFinal.memo;
                }
              });
            }
          });
        } else {
          this.keiyakuDetail.tanto_name_company = result.tantoName;
          this.keiyakuDetail.phone = result.phone;
          this.keiyakuDetail.url = result.url;
          this.keiyakuDetail.memo = result.memo;
        }
      }
    });
  }

  choseInsuranceType(): void {
    if (this.keiyakuDetail.company_cd) {
      this.getListProduct();
    } else {
      const dialogAddInsurance = this.dialog.open(AddInsuranceTypeComponent, {
        width: '400px',
        data: {},
        panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
      });
      dialogAddInsurance.afterClosed().subscribe(result => {
        if (result) {
          this.keiyakuDetail.product_name = result.key;
        }
      });
      return;
    }
  }

  getListProduct() {
    this.httpService.post(this.API_URLS.getListProduct, { company_cd: this.keiyakuDetail.company_cd }).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        if (res.data.length > 0) {
          const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
            width: '400px',
            data: { popupTitle: '保険商品名選択', category: 'INSURANCY-TYPE', company_cd: this.keiyakuDetail.company_cd },
            panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
          });
          dialogCommon.afterClosed().subscribe(result => {
            if (result && result.key === 'HANDLE') {
              const dialogAddInsurance = this.dialog.open(AddInsuranceTypeComponent, {
                width: '400px',
                data: {},
                panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
              });
              dialogAddInsurance.afterClosed().subscribe(resultAddInsurance => {
                if (resultAddInsurance) {
                  this.keiyakuDetail.product_name = resultAddInsurance.key;
                }
              });
              return;
            }
            if (result) {
              this.keiyakuDetail.product_cd = result.PRODUCTCD;
              this.keiyakuDetail.category_cd = result.CATEGORYCD;
              this.keiyakuDetail.product_name = result.PRODUCTNAME;
            }
          });
        } else {
          const dialogAddInsurance = this.dialog.open(AddInsuranceTypeComponent, {
            width: '400px',
            data: {},
            panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
          });
          dialogAddInsurance.afterClosed().subscribe(resultAddInsurance => {
            if (resultAddInsurance) {
              this.keiyakuDetail.product_name = resultAddInsurance.key;
            }
          });
          return;
        }
      } else {
        console.log(res);
        this.toastr.error('', res.message);
      }
    });
  }

  deleteShukeiyaku(isShukeiyaku: boolean, index: number, indexTokuyaku?: number) {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });

    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result !== null && result.action !== "close") {
        if (isShukeiyaku) {
          this.keiyakuDetail.shukeiyaku_delete.push(this.listShukeiyaku[index].KeiyakuHoshoNo);
          if (this.listShukeiyaku.length === 1) {
            this.listShukeiyaku = [];
          }
          else {
            for (let i = 0; i < this.listShukeiyaku.length; i++) {
              if (i === index) {
                this.listShukeiyaku.splice(i, 1);
                break;
              }
            }
            for (let i = 0; i < this.listShukeiyaku.length; i++) {
              this.listShukeiyaku[i].SeqNo = i + 1;
            }
          }
          return;
        }

        this.keiyakuDetail.shukeiyaku_delete.push(this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].KeiyakuHoshoNo);
        if (this.listTokuyaku[indexTokuyaku].tokuyakuHosho.length === 1) {
          this.listTokuyaku[indexTokuyaku].tokuyakuHosho = [];
        }
        else {
          for (let i = 0; i < this.listTokuyaku[indexTokuyaku].tokuyakuHosho.length; i++) {
            if (i === index) {
              this.listTokuyaku[indexTokuyaku].tokuyakuHosho.splice(i, 1);
              break;
            }
          }
          for (let i = 0; i < this.listTokuyaku[indexTokuyaku].tokuyakuHosho.length; i++) {
            this.listTokuyaku[indexTokuyaku].tokuyakuHosho[i].SeqNo = i + 1;
          }
        }
      }
    });
  }

  goDetailHosho(isShukeiyaku: boolean, index: number, indexTokuyaku?: number): void {
    let hosho;
    if (isShukeiyaku) {
      hosho = $.extend({}, this.listShukeiyaku[index]);
    }
    else {
      hosho = $.extend({}, this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index]);
    }
    if (hosho.TypeF === 60) {
      hosho.company_cd = this.keiyakuDetail.company_cd;
    }
    let tokuyaku;
    if (!isShukeiyaku) {
      tokuyaku = $.extend({}, this.listTokuyaku[indexTokuyaku]);
    }
    let dialogText = this.dialog.open(AddTextComponent, {
      width: '400px',
      data: {
        option: {
          isShukeiyaku: isShukeiyaku,
          statusTokuyaku: 'none'
        },
        popupTitle: (isShukeiyaku ? '主契約' : this.listTokuyaku[indexTokuyaku].TokuyakuName), 
        hosho: hosho,
        tokuyaku: (isShukeiyaku ? null : tokuyaku),
        categoryF: this.keiyakuDetail.hosho_category_f,
        currencyName: this.keiyakuDetail.foreign_f_name,
        userNo: this.keiyakuDetail.user_no,
        keiyakuData: this.keiyakuDetail
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });
    dialogText.afterClosed().subscribe(result => {
      if (result) {
        if (isShukeiyaku) {
          this.listShukeiyaku[index] = result.hosho;
        }
        else {
          this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index] = result.hosho;
        }
        this.checkWindow();
      }
    });
  }

  addHosho(isShuKeiyaku: boolean, index: number, newTokuyaku?: any): void {
    if (!this.isPopupShow) {
      this.isPopupShow = true;
      const formData = {
        company_cd: this.keiyakuDetail.company_cd,
        product_cd: this.keiyakuDetail.product_cd,
        hosho_category_f: this.keiyakuDetail.hosho_category_f
      };
      this.httpService.post(this.API_URLS.getListHosho, formData).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          if (res.data.length === 0) {
            this.openPopupHosho(
              {
                HoshoNo: 0,
                HoshoName: '',
                ColumnVal: '',
                TypeF: 0,
                Size: 200,
                SelType: 0,
                SeqNo: 0,
                Comment: '',
                requiredF: 0
              }, 
              isShuKeiyaku,
              index,
              newTokuyaku
            );
          }
          else {
            const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
              width: '400px',
              data: {
                popupTitle: (isShuKeiyaku ? '主契約' : '特約追加'),
                category: 'HOSHO',
                companyCd: this.keiyakuDetail.company_cd,
                productCd: this.keiyakuDetail.product_cd,
                hoshoCategoryF: this.keiyakuDetail.hosho_category_f
                //categoryCd: this.keiyaku.category_cd
              },
              panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
            });
  
            dialogCommon.afterClosed().subscribe(result => {
              this.isPopupShow = false;
              if (result) {
                let hosho;
                if (result.key === "HANDLE") {
                  hosho = {
                    HoshoNo: 0,
                    HoshoName: '',
                    ColumnVal: '',
                    TypeF: 0,
                    Size: 200,
                    SelType: 0,
                    SeqNo: 0,
                    Comment: '',
                    requiredF: 0
                  };
                }
                else {
                  hosho = {
                    HoshoNo: result.HoshoNo,
                    HoshoName: result.HoshoName,
                    ColumnVal: '',
                    TypeF: result.TypeF,
                    Size: result.Size,
                    SelType: result.SelType,
                    SeqNo: result.SeqNo,
                    Comment: '',
                    requiredF: 0
                  };
                }
                this.openPopupHosho(hosho, isShuKeiyaku, index, newTokuyaku);
              }
            });
          }
        } else {
          this.openPopupHosho(
            {
              HoshoNo: 0,
              HoshoName: '',
              ColumnVal: '',
              TypeF: 0,
              Size: 200,
              SelType: 0,
              SeqNo: 0,
              Comment: '',
              requiredF: 0
            }, 
            isShuKeiyaku, 
            index,
            newTokuyaku
          );
        }
      });
    }
  }

  openPopupHosho(hosho: any, isShuKeiyaku: boolean, index: number, newTokuyaku: any): void {
    if (hosho.TypeF === 60) {
      hosho.company_cd = this.keiyakuDetail.company_cd;
    }
    let tokuyaku;
    if (typeof newTokuyaku !== "undefined" && newTokuyaku !== null) {
      tokuyaku = newTokuyaku;
    }
    else if (!isShuKeiyaku) {
      tokuyaku = $.extend({}, this.listTokuyaku[index]);
    }
    let dialogText = this.dialog.open(AddTextComponent, {
      width: '400px',
      data: {
        option: {
          isShukeiyaku: isShuKeiyaku,
          statusTokuyaku: (typeof newTokuyaku !== "undefined" && newTokuyaku !== null) ? 'new' : 'none'
        },
        popupTitle: (isShuKeiyaku ? '主契約' : '特約追加'), 
        hosho: hosho,
        tokuyaku: (isShuKeiyaku ? null : tokuyaku),
        categoryF: this.keiyakuDetail.hosho_category_f,
        currencyName: this.keiyakuDetail.foreign_f_name,
        userNo: this.keiyakuDetail.user_no,
        keiyakuData: this.keiyakuDetail
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });
    dialogText.afterClosed().subscribe(result => {
      this.isPopupShow = false;
      if (result) {
        let countList;
        if (isShuKeiyaku) {
          countList = this.listShukeiyaku.length;
        } else {
          if (typeof newTokuyaku !== "undefined" && newTokuyaku !== null) {
            countList = 1;
          }
          else {
            countList = this.listTokuyaku[index].tokuyakuHosho.length;
          }
        }
        result.hosho.SeqNo = countList + 1;
        if (isShuKeiyaku) {
          this.listShukeiyaku.push(result.hosho);
        }
        else {
          if (typeof newTokuyaku !== "undefined" && newTokuyaku !== null) {
            if (
              (typeof result.hosho.HoshoName !== 'undefined' && result.hosho.HoshoName !== null && result.hosho.HoshoName.toString().trim() !== '') ||
              (typeof result.hosho.ColumnVal !== 'undefined' && result.hosho.ColumnVal !== null && result.hosho.ColumnVal.toString().trim() !== '') ||
              (typeof result.hosho.Comment !== 'undefined' && result.hosho.Comment !== null && result.hosho.Comment.toString().trim() !== '')
            ) {
              result.tokuyaku.tokuyakuHosho.push(result.hosho);
            }
            this.listTokuyaku.push(result.tokuyaku);
          }
          else {
            this.listTokuyaku[index].tokuyakuHosho.push(result.hosho);
          }
        }
        this.checkWindow();
      }
    });
  }

  mapValueToViewValueHosho(isShukeiyaku: boolean, index: number, indexTokuyaku?: number) {
    if (isShukeiyaku) {
      if(this.listShukeiyaku[index].TypeF === 10) {
        if (!isNaN(this.listShukeiyaku[index].ColumnVal) && this.listShukeiyaku[index].HoshoNo !== 0 && this.listShukeiyaku[index].HoshoNo !== '0') {
          return this.listShukeiyaku[index].ColumnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuDetail.foreign_f_name;;
        } else {
          return this.listShukeiyaku[index].ColumnVal;
        }
      }
      else if(this.listShukeiyaku[index].TypeF === 100) {
        if (!isNaN(this.listShukeiyaku[index].ColumnVal) && this.listShukeiyaku[index].HoshoNo !== 0 && this.listShukeiyaku[index].HoshoNo !== '0') {
          return this.listShukeiyaku[index].ColumnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return this.listShukeiyaku[index].ColumnVal;
        }
      }
      else if (
        this.listShukeiyaku[index].TypeF === 20 || 
        this.listShukeiyaku[index].TypeF === 40 || 
        this.listShukeiyaku[index].TypeF === 70 || 
        this.listShukeiyaku[index].TypeF === 50 ||
        this.listShukeiyaku[index].TypeF === 90 ||
        this.listShukeiyaku[index].TypeF === 60 ||
        this.listShukeiyaku[index].TypeF === 80
      ){
        return this.listShukeiyaku[index].ColumnValText;
      }
      else if (this.listShukeiyaku[index].TypeF === 35) {
        if (typeof this.listShukeiyaku[index].ColumnVal !== 'undefined' && this.listShukeiyaku[index].ColumnVal !== null) {
          let arrDate = this.listShukeiyaku[index].ColumnVal.split('-');
          return arrDate[0] + '年' + arrDate[1] + '月';
        }
        else {
          return '';
        }
      }
      else {
        return this.listShukeiyaku[index].ColumnVal;
      }
    } else if (!isShukeiyaku) {
      if (this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '10') {
        if (!isNaN(this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal) && this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].HoshoNo.toString() !== '0') {
          return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + this.keiyakuDetail.foreign_f_name;
        } else {
          return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal;
        }
      }
      else if (this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '100') {
        if (!isNaN(this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal) && this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].HoshoNo !== 0 && this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].HoshoNo !== '0') {
          return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal;
        }
      }
      else if (
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '20' || 
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '40' || 
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '70' || 
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '50' ||
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '90' ||
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '60' ||
        this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '80'
      ){
        return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnValText;
      }
      else if (this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].TypeF.toString() === '35') {
        if (typeof this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal !== 'undefined' && this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal !== null) {
          let arrDate = this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal.split('-');
          return arrDate[0] + '年' + arrDate[1] + '月';
        }
        else {
          return '';
        }
      }
      else {
        return this.listTokuyaku[indexTokuyaku].tokuyakuHosho[index].ColumnVal;
      }
    }
  }

  deleteTokuyaku(index: number): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { message: this.translate.instant("confirmDelete") },
      panelClass: []
    });

    dialogConfirm.afterClosed().subscribe(result => {
      if (typeof result !== "undefined" && result !== null && result.action !== "close") {
        this.keiyakuDetail.tokuyakus_delete.push(this.listTokuyaku[index].KeiyakuTokuyakuNo);
        const tokuyakus = this.listTokuyaku.filter((tokuyaku) => {
          return !((tokuyaku.SeqNo - 1) === index);
        });
        this.listTokuyaku = tokuyakus;
        for (let i = 0; i < this.listTokuyaku.length; i++) {
          this.listTokuyaku[i].SeqNo = i + 1;
        }
      }
    });
  }

  editTokuyaku(index: number): void {
    let tokuyaku = $.extend({}, this.listTokuyaku[index]);
    const dialogText = this.dialog.open(AddTextComponent, {
      width: '400px',
      data: { 
        option: {
          isShukeiyaku: false,
          statusTokuyaku: 'edit'
        },
        popupTitle: '特約追加', 
        hosho: {
          HoshoNo: 0,
          HoshoName: '',
          ColumnVal: '',
          TypeF: 0,
          Size: 200,
          SelType: 0,
          SeqNo: 0,
          Comment: '',
          requiredF: 0
        },
        tokuyaku: tokuyaku,
        categoryF: this.keiyakuDetail.hosho_category_f,
        currencyName: this.keiyakuDetail.foreign_f_name,
        userNo: this.keiyakuDetail.user_no,
        keiyakuData: this.keiyakuDetail
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });
    dialogText.afterClosed().subscribe(result => {
      if (result) {
        this.listTokuyaku[index] = result.tokuyaku;
      }
    });
  }

  addTokuyaku(): void {
    if (!this.isPopupShow) {
      this.isPopupShow = true;
      const formData = {
        company_cd: this.keiyakuDetail.company_cd,
        product_cd: this.keiyakuDetail.product_cd,
        category_cd: this.keiyakuDetail.category_cd,
        category_f: this.keiyakuDetail.hosho_category_f
      };
  
      this.httpService.post(this.API_URLS.getListTokuyaku, formData).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          if (res.data.length === 0) {
            let tokuyaku = {
              CompanyCd: null,
              ProductCd: null,
              CategoryCd: null,
              TokuNo: null,
              TokuyakuName: '',
              SeqNo: this.listTokuyaku.length + 1,
              tokuyakuHosho: []
            };
            this.isPopupShow = false;
            this.addHosho(false, 0, tokuyaku);
          }
          else {
            this.isPopupShow = false;
            this.openSelectTokuyaku();
          }
        } else {
          let tokuyaku = {
            CompanyCd: null,
            ProductCd: null,
            CategoryCd: null,
            TokuNo: null,
            TokuyakuName: '',
            SeqNo: this.listTokuyaku.length + 1,
            tokuyakuHosho: []
          };
          this.isPopupShow = false;
          this.addHosho(false, 0, tokuyaku);
        }
      });
    }
  }

  openSelectTokuyaku(): void {
    if (!this.isPopupShow) {
      this.isPopupShow = true;
      const dialogCommon = this.dialog.open(SelectItemCommonComponent, {
        width: '400px',
        data: {
          popupTitle: '特約追加', category: 'TOKUYAKU',
          companyCd: this.keiyakuDetail.company_cd, 
          productCd: this.keiyakuDetail.product_cd, 
          categoryCd: this.keiyakuDetail.category_cd,
          categoryF: this.keiyakuDetail.hosho_category_f
        },
        panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
      });
  
      dialogCommon.afterClosed().subscribe(result => {
        this.isPopupShow = false;
        if (result) {
          let tokuyaku;
          const countList = this.listTokuyaku.length;
          if (result.key === 'HANDLE') {
            tokuyaku = {
              CompanyCd: null,
              ProductCd: null,
              CategoryCd: null,
              TokuNo: null,
              TokuyakuName: '',
              SeqNo: countList + 1,
              tokuyakuHosho: []
            };
          } else {
            tokuyaku = {
              CompanyCd: result.COMPANYCD,
              ProductCd: result.PRODUCTCD,
              CategoryCd: result.CATEGORYCD,
              TokuNo: result.TOKUNO,
              TokuyakuName: result.NAME,
              SeqNo: countList + 1,
              tokuyakuHosho: []
            };
          }
          this.isPopupShow = false;
          this.addHosho(false, 0, tokuyaku);
        }
      });
    }
  }

  mapDataToSave() {
    if (!this.fieldOfKeiyaku.Agent.display) {
      this.keiyakuDetail.agent_no = null;
      this.keiyakuDetail.agent_name = null;
    }
    else {
      if (this.fieldOfKeiyaku.Agent.type !== 70) {
        this.keiyakuDetail.agent_no = this.agentFormControl.value;
      }
    }

    if (!this.fieldOfKeiyaku.Company.display) {
      this.keiyakuDetail.company_cd = null;
      this.keiyakuDetail.company_name = null;
      this.keiyakuDetail.tanto_name_company = null;
      this.keiyakuDetail.phone = null;
      this.keiyakuDetail.url = null;
      this.keiyakuDetail.memo = null;
    }
    else {
      if (this.fieldOfKeiyaku.Company.type !== 50) {
        this.keiyakuDetail.company_name = this.companyFormControl.value;
      }
    }

    if (!this.fieldOfKeiyaku.Category.display) {
      this.keiyakuDetail.hosho_category_f = Number(localStorage.getItem('categoryID'));
    }
    else {
      this.keiyakuDetail.hosho_category_f = this.categoryFormControl.value;
    }

    if (!this.fieldOfKeiyaku.Product.display) {
      this.keiyakuDetail.product_cd = null;
      this.keiyakuDetail.product_name = null;
    }
    else {
      if (this.fieldOfKeiyaku.Product.type !== 60) {
        this.keiyakuDetail.product_name = this.productFormControl.value;
      }
    }

    if (!this.fieldOfKeiyaku.PolicyNo.display) {
      this.keiyakuDetail.policy_no = null;
    }
    else {
      if (this.fieldOfKeiyaku.PolicyNo.type !== 1) {
        this.keiyakuDetail.policy_no = this.policyNoFormControl.value;
      }
      else {
        this.keiyakuDetail.policy_no = $('.halfSizePolicyNo').val();
      }
    }

    if (!this.fieldOfKeiyaku.Status.display) {
      this.keiyakuDetail.status = null;
    }
    else {
      if (this.fieldOfKeiyaku.Status.type !== 20) {
        this.keiyakuDetail.status = this.statusFormControl.value;
      }
      else {
        this.keiyakuDetail.status = Number(this.statusFormControl.value);
      }
    }

    if (!this.fieldOfKeiyaku.FamilyNo.display) {
      this.keiyakuDetail.family_no = null;
      this.keiyakuDetail.family_name = null;
    }
    else {
      if (this.fieldOfKeiyaku.FamilyNo.type !== 40) {
        this.keiyakuDetail.family_name = this.familyNoFormControl.value;
      }
      else {
        let objSelected = this.familyNoFormControl.value;
        if (typeof objSelected === 'string') {
          this.keiyakuDetail.family_no = 0;
          this.keiyakuDetail.family_name = objSelected;
        }
        else {
          this.keiyakuDetail.family_no = Number(objSelected.id);
          this.keiyakuDetail.family_name = objSelected.title;
        }
      }
    }

    if (!this.fieldOfKeiyaku.HihoFamilyNo.display) {
      this.keiyakuDetail.hiho_family_no = null;
      this.keiyakuDetail.hiho_family_name = null;
    }
    else {
      if (this.fieldOfKeiyaku.HihoFamilyNo.type !== 40) {
        this.keiyakuDetail.hiho_family_name = this.hihoFamilyNoFormControl.value;
      }
      else {
        let objSelected = this.hihoFamilyNoFormControl.value;
        if (typeof objSelected === 'string') {
          this.keiyakuDetail.hiho_family_no = 0;
          this.keiyakuDetail.hiho_family_name = objSelected;
        }
        else {
          this.keiyakuDetail.hiho_family_no = Number(objSelected.id);
          this.keiyakuDetail.hiho_family_name = objSelected.title;
        }
      }
    }

    if (!this.fieldOfKeiyaku.ContractDate.display && !this.fieldOfKeiyaku.StartDate.display) {
      this.keiyakuDetail.contract_date = null;
    }
    else {
      if (this.fieldOfKeiyaku.ContractDate.display) {
        if (this.fieldOfKeiyaku.ContractDate.type !== 30 && this.fieldOfKeiyaku.ContractDate.type !== 35) {
          this.keiyakuDetail.contract_date = this.contractDateFormControl.value;
        }
        else {
          this.keiyakuDetail.contract_date = this.contractDateFormControl.value !== '' ? this.ultils.dateToyyyyMMdd(this.contractDateFormControl.value) : null;
        }
      }
      if (this.fieldOfKeiyaku.StartDate.display) {
        if (this.fieldOfKeiyaku.StartDate.type !== 30 && this.fieldOfKeiyaku.StartDate.type !== 35) {
          this.keiyakuDetail.contract_date = this.contractDateFormControl.value;
        }
        else {
          this.keiyakuDetail.contract_date = this.contractDateFormControl.value !== '' ? this.ultils.dateToyyyyMMdd(this.contractDateFormControl.value) : null;
        }
      }
    }

    if (!this.fieldOfKeiyaku.HokenEndDate.display) {
      this.keiyakuDetail.hoken_end_date = null;
    }
    else {
      if (this.fieldOfKeiyaku.HokenEndDate.type !== 30 && this.fieldOfKeiyaku.HokenEndDate.type !== 35) {
        this.keiyakuDetail.hoken_end_date = this.hokenEndDateFormControl.value;
      }
      else {
        this.keiyakuDetail.hoken_end_date = this.hokenEndDateFormControl.value !== '' ? this.ultils.dateToyyyyMMdd(this.hokenEndDateFormControl.value) : null;
      }
    }

    if (!this.fieldOfKeiyaku.HKikan.display) {
      this.keiyakuDetail.h_kikan = null;
      this.keiyakuDetail.h_kikan_f = null;
    }
    else {
      if (this.fieldOfKeiyaku.HKikan.type !== 80) {
        this.keiyakuDetail.h_kikan = this.hKikanFormControl.value;
      }
      else {
        this.keiyakuDetail.h_kikan = Number(this.hKikanFormControl.value);
        this.keiyakuDetail.h_kikan_f = Number(this.hKikanFFormControl.value);
      }
    }

    if (!this.fieldOfKeiyaku.HokenP.display) {
      this.keiyakuDetail.hoken_p = null;
      this.keiyakuDetail.currency_f = null;
    }
    else {
      this.keiyakuDetail.hoken_p = this.hokenPFormControl.value;
      this.keiyakuDetail.currency_f = this.currencyFFormControl.value;
    }

    if (!this.fieldOfKeiyaku.Haraikata.display) {
      this.keiyakuDetail.haraikata = null;
    }
    else {
      if (this.fieldOfKeiyaku.Haraikata.type !== 20) {
        this.keiyakuDetail.haraikata = this.haraikataFormControl.value;
      }
      else {
        this.keiyakuDetail.haraikata = Number(this.haraikataFormControl.value);
      }
    }

    if (!this.fieldOfKeiyaku.PKikan.display) {
      this.keiyakuDetail.p_kikan = null;
      this.keiyakuDetail.p_kikan_f = null;
    }
    else {
      if (this.fieldOfKeiyaku.PKikan.type !== 80) {
        this.keiyakuDetail.p_kikan = this.pKikanFormControl.value; 
      }
      else {
        this.keiyakuDetail.p_kikan = Number(this.pKikanFormControl.value);
        this.keiyakuDetail.p_kikan_f = Number(this.pKikanFFormControl.value);
      }
    }

    if (!this.fieldOfKeiyaku.ForeignF.display) {
      this.keiyakuDetail.foreign_f = null;
    }
    else {
      this.keiyakuDetail.foreign_f = Number(this.foreignFFormControl.value);
    }

    if (!this.fieldOfKeiyaku.ContactAccident.display) {
      this.keiyakuDetail.contact_accident = null;
    }
    else {
      this.keiyakuDetail.contact_accident = this.contactAccidentFormControl.value; 
    }

    if (!this.fieldOfKeiyaku.ContactCarFailure.display) {
      this.keiyakuDetail.contact_car_failure = null;
    }
    else {
      this.keiyakuDetail.contact_car_failure = this.contactCarFailureFormControl.value; 
    }

    if (!this.fieldOfKeiyaku.CarName.display) {
      this.keiyakuDetail.car_name = null;
    }
    else {
      this.keiyakuDetail.car_name = this.carNameFormControl.value; 
    }

    if (!this.fieldOfKeiyaku.RegistNo.display) {
      this.keiyakuDetail.regist_no = null;
    }
    else {
      this.keiyakuDetail.regist_no = this.registNoFormControl.value; 
    }

    if (!this.fieldOfKeiyaku.Address.display) {
      this.keiyakuDetail.address = null;
    }
    else {
      this.keiyakuDetail.address = this.addressFormControl.value; 
    }

    this.keiyakuDetail.shukeiyaku = this.listShukeiyaku;
    this.keiyakuDetail.tokuyakus = this.listTokuyaku;
  }

  mapDataFromControll() {
    //#region Agent --------------------------------------------------------------------------------------
    if (this.fieldOfKeiyaku.Agent.type !== 70) {
      if (this.fieldOfKeiyaku.Agent.type === 30 || this.fieldOfKeiyaku.Agent.type === 35) {
        this.agentFormControl.setValue(new Date(this.keiyakuDetail.agent_name));
      }
      else {
        this.agentFormControl.setValue(this.keiyakuDetail.agent_name);
      }
    }
    if (this.fieldOfKeiyaku.Agent.type === 30 || this.fieldOfKeiyaku.Agent.type === 35) {
      this.agentFormControl.disable();
    }
    //#endregion

    //#region Company ------------------------------------------------------------------------------------
    if (this.fieldOfKeiyaku.Company.type !== 50) {
      if (this.fieldOfKeiyaku.Company.type === 30 || this.fieldOfKeiyaku.Company.type === 35) {
        this.companyFormControl.setValue(new Date(this.keiyakuDetail.company_name));
      }
      else {
        this.companyFormControl.setValue(this.keiyakuDetail.company_name);
      }
    }
    if (this.fieldOfKeiyaku.Company.type === 30 || this.fieldOfKeiyaku.Company.type === 35) {
      this.companyFormControl.disable();
    }
    //#endregion

    //#region Category -----------------------------------------------------------------------------------
    if (this.keiyakuDetail.hosho_category_f !== null) {
      if (this.fieldOfKeiyaku.Category.type === 30 || this.fieldOfKeiyaku.Category.type === 35) {
        this.categoryFormControl.setValue(new Date(this.keiyakuDetail.hosho_category_f));
      }
      else {
        this.categoryFormControl.setValue(this.keiyakuDetail.hosho_category_f.toString());
      }
    }
    if (this.fieldOfKeiyaku.Category.type === 30 || this.fieldOfKeiyaku.Category.type === 35) {
      this.categoryFormControl.disable();
    }
    //#endregion

    //#region Product ------------------------------------------------------------------------------------
    if (this.fieldOfKeiyaku.Product.type !== 60) {
      if (this.fieldOfKeiyaku.Product.type === 30 || this.fieldOfKeiyaku.Product.type === 35) {
        this.productFormControl.setValue(new Date(this.keiyakuDetail.product_name));
      }
      else {
        this.productFormControl.setValue(this.keiyakuDetail.product_name);
      }
    }
    if (this.fieldOfKeiyaku.Product.type === 30 || this.fieldOfKeiyaku.Product.type === 35) {
      this.productFormControl.disable();
    }
    //#endregion

    //#region Policy no ----------------------------------------------------------------------------------
    if (this.keiyakuDetail.policy_no !== null) {
      if (this.fieldOfKeiyaku.PolicyNo.type === 30 || this.fieldOfKeiyaku.PolicyNo.type === 35) {
        this.policyNoFormControl.setValue(new Date(this.keiyakuDetail.policy_no));
      }
      else {
        this.policyNoFormControl.setValue(this.keiyakuDetail.policy_no.toString());
      }
    }
    if (this.fieldOfKeiyaku.PolicyNo.type === 30 || this.fieldOfKeiyaku.PolicyNo.type === 35) {
      this.policyNoFormControl.disable();
    }
    //#endregion

    //#region Status -------------------------------------------------------------------------------------
    if (this.keiyakuDetail.status !== null) {
      if (this.fieldOfKeiyaku.Status.type === 30 || this.fieldOfKeiyaku.Status.type === 35) {
        this.statusFormControl.setValue(new Date(this.keiyakuDetail.status));
      }
      else {
        this.statusFormControl.setValue(this.keiyakuDetail.status.toString());
      }
    }
    if (this.fieldOfKeiyaku.Status.type === 30 || this.fieldOfKeiyaku.Status.type === 35) {
      this.statusFormControl.disable();
    }
    //#endregion

    //#region Family -------------------------------------------------------------------------------------
    if (this.keiyakuDetail.family_no !== null) {
      if (this.fieldOfKeiyaku.FamilyNo.type !== 40) {
        if (this.fieldOfKeiyaku.FamilyNo.type === 30 || this.fieldOfKeiyaku.FamilyNo.type === 35) {
          this.familyNoFormControl.setValue(new Date(this.keiyakuDetail.family_name));
        }
        else {
          this.familyNoFormControl.setValue(this.keiyakuDetail.family_name);
        }
      }
      else {
        let objSelected = {
          id: this.keiyakuDetail.family_no.toString(),
          title: this.keiyakuDetail.family_name
        }
        this.familyNoFormControl.setValue(objSelected);
      }
    }
    if (this.fieldOfKeiyaku.FamilyNo.type === 30 || this.fieldOfKeiyaku.FamilyNo.type === 35) {
      this.familyNoFormControl.disable();
    }
    //#endregion

    //#region Hihofamily ---------------------------------------------------------------------------------
    if (this.keiyakuDetail.hiho_family_no !== null) {
      if (this.fieldOfKeiyaku.HihoFamilyNo.type !== 40) {
        if (this.fieldOfKeiyaku.HihoFamilyNo.type === 30 || this.fieldOfKeiyaku.HihoFamilyNo.type === 35) {
          this.hihoFamilyNoFormControl.setValue(new Date(this.keiyakuDetail.hiho_family_name));
        }
        else {
          this.hihoFamilyNoFormControl.setValue(this.keiyakuDetail.hiho_family_name);
        }
      }
      else {
        let objSelected = {
          id: this.keiyakuDetail.hiho_family_no.toString(),
          title: this.keiyakuDetail.hiho_family_name
        }
        this.hihoFamilyNoFormControl.setValue(objSelected);
      }
    }
    if (this.fieldOfKeiyaku.HihoFamilyNo.type === 30 || this.fieldOfKeiyaku.HihoFamilyNo.type === 35) {
      this.hihoFamilyNoFormControl.disable();
    }
    //#endregion

    //#region Contract date ------------------------------------------------------------------------------
    if (this.keiyakuDetail.contract_date !== null) {
      if (this.fieldOfKeiyaku.ContractDate.display) {
        if (this.fieldOfKeiyaku.ContractDate.type !== 30 && this.fieldOfKeiyaku.ContractDate.type !== 35) {
          this.contractDateFormControl.setValue(this.keiyakuDetail.contract_date);
        }
        else {
          this.contractDateFormControl.setValue(new Date(this.keiyakuDetail.contract_date));
        }
      }
      if (this.fieldOfKeiyaku.StartDate.display) {
        if (this.fieldOfKeiyaku.StartDate.type !== 30 && this.fieldOfKeiyaku.StartDate.type !== 35) {
          this.contractDateFormControl.setValue(this.keiyakuDetail.contract_date);
        }
        else {
          this.contractDateFormControl.setValue(new Date(this.keiyakuDetail.contract_date));
        }
      }
    }
    if (this.fieldOfKeiyaku.ContractDate.display) {
      if (this.fieldOfKeiyaku.ContractDate.type === 30 || this.fieldOfKeiyaku.ContractDate.type === 35) {
        this.contractDateFormControl.disable();
      }
    }
    if (this.fieldOfKeiyaku.StartDate.display) {
      if (this.fieldOfKeiyaku.StartDate.type === 30 || this.fieldOfKeiyaku.StartDate.type === 35) {
        this.contractDateFormControl.disable();
      }
    }
    //#endregion

    //#region Hoken end date -----------------------------------------------------------------------------
    if (this.keiyakuDetail.hoken_end_date !== null) {
      if (this.fieldOfKeiyaku.HokenEndDate.type !== 30 && this.fieldOfKeiyaku.HokenEndDate.type !== 35) {
        this.hokenEndDateFormControl.setValue(this.keiyakuDetail.hoken_end_date);
      }
      else {
        this.hokenEndDateFormControl.setValue(new Date(this.keiyakuDetail.hoken_end_date));
      }
    }
    if (this.fieldOfKeiyaku.HokenEndDate.type === 30 || this.fieldOfKeiyaku.HokenEndDate.type === 35) {
      this.hokenEndDateFormControl.disable();
    }
    //#endregion

    //#region Hkikan -------------------------------------------------------------------------------------
    if (this.keiyakuDetail.h_kikan !== null) {
      if (this.fieldOfKeiyaku.HKikan.type === 30 || this.fieldOfKeiyaku.HKikan.type === 35) {
        this.hKikanFormControl.setValue(new Date(this.keiyakuDetail.h_kikan));
      }
      else {
        this.hKikanFormControl.setValue(this.keiyakuDetail.h_kikan);
      }
    }
    if (this.fieldOfKeiyaku.HKikan.type === 30 || this.fieldOfKeiyaku.HKikan.type === 35) {
      this.hKikanFormControl.disable();
    }
    //#endregion

    //#region HkikanF ------------------------------------------------------------------------------------
    if (this.keiyakuDetail.h_kikan_f !== null) {
      this.hKikanFFormControl.setValue(this.keiyakuDetail.h_kikan_f);
      this.changeOption('hKikanF');
    }
    //#endregion

    //#region HokenP -------------------------------------------------------------------------------------
    if (this.keiyakuDetail.hoken_p !== null) {
      if (this.fieldOfKeiyaku.HokenP.type === 30 || this.fieldOfKeiyaku.HokenP.type === 35) {
        this.hokenPFormControl.setValue(new Date(this.keiyakuDetail.hoken_p));
      }
      else {
        if (this.fieldOfKeiyaku.HokenP.type === 100) {
          this.hokenPFormControl.setValue(this.keiyakuDetail.hoken_p);
          if (this.keiyakuDetail.currency_f !== null) {
            this.currencyFFormControl.setValue(this.keiyakuDetail.currency_f.toString());
          }
        }
        else {
          this.hokenPFormControl.setValue(this.keiyakuDetail.hoken_p);
        }
      }
    }
    else {
      this.currencyFFormControl.setValue(null);
    }
    if (this.fieldOfKeiyaku.HokenP.type === 30 || this.fieldOfKeiyaku.HokenP.type === 35) {
      this.hokenPFormControl.disable();
    }
    //#endregion

    //#region Haraikata ----------------------------------------------------------------------------------
    if (this.keiyakuDetail.haraikata !== null) {
      if (this.fieldOfKeiyaku.Haraikata.type === 30 || this.fieldOfKeiyaku.Haraikata.type === 35) {
        this.haraikataFormControl.setValue(new Date(this.keiyakuDetail.haraikata));
      }
      else {
        this.haraikataFormControl.setValue(this.keiyakuDetail.haraikata.toString());
      }
    }
    if (this.fieldOfKeiyaku.Haraikata.type === 30 || this.fieldOfKeiyaku.Haraikata.type === 35) {
      this.haraikataFormControl.disable();
    }
    //#endregion

    //#region Pkikan -------------------------------------------------------------------------------------
    if (this.keiyakuDetail.p_kikan !== null) {
      if (this.fieldOfKeiyaku.PKikan.type === 30 || this.fieldOfKeiyaku.PKikan.type === 35) {
        this.pKikanFormControl.setValue(new Date(this.keiyakuDetail.p_kikan));
      }
      else {
        this.pKikanFormControl.setValue(this.keiyakuDetail.p_kikan);
      }
    }
    if (this.fieldOfKeiyaku.PKikan.type === 30 || this.fieldOfKeiyaku.PKikan.type === 35) {
      this.pKikanFormControl.disable();
    }
    //#endregion
    
    //#region PkikanF ------------------------------------------------------------------------------------
    if (this.keiyakuDetail.p_kikan_f !== null) {
      this.pKikanFFormControl.setValue(this.keiyakuDetail.p_kikan_f);
      this.changeOption('pKikanF');
    }
    this.changeOption('haraikata');
    //#endregion
  
    //#region ForeignF -----------------------------------------------------------------------------------
    if (this.keiyakuDetail.foreign_f !== null) {
      if (this.fieldOfKeiyaku.ForeignF.type === 30 || this.fieldOfKeiyaku.ForeignF.type === 35) {
        this.foreignFFormControl.setValue(new Date(this.keiyakuDetail.foreign_f));
      }
      else {
        this.foreignFFormControl.setValue(this.keiyakuDetail.foreign_f.toString());
      }
    }
    if (this.fieldOfKeiyaku.ForeignF.type === 30 || this.fieldOfKeiyaku.ForeignF.type === 35) {
      this.foreignFFormControl.disable();
    }
    //#endregion

    //#region ContactAccident ----------------------------------------------------------------------------
    if (this.keiyakuDetail.contact_accident !== null) {
      if (this.fieldOfKeiyaku.ContactAccident.type === 30 || this.fieldOfKeiyaku.ContactAccident.type === 35) {
        this.contactAccidentFormControl.setValue(new Date(this.keiyakuDetail.contact_accident));
      }
      else {
        this.contactAccidentFormControl.setValue(this.keiyakuDetail.contact_accident.toString());
      }
    }
    if (this.fieldOfKeiyaku.ContactAccident.type === 30 || this.fieldOfKeiyaku.ContactAccident.type === 35) {
      this.contactAccidentFormControl.disable();
    }
    //#endregion

    //#region ContactCarFailure --------------------------------------------------------------------------
    if (this.keiyakuDetail.contact_car_failure !== null) {
      if (this.fieldOfKeiyaku.ContactCarFailure.type === 30 || this.fieldOfKeiyaku.ContactCarFailure.type === 35) {
        this.contactCarFailureFormControl.setValue(new Date(this.keiyakuDetail.contact_car_failure));
      }
      else {
        this.contactCarFailureFormControl.setValue(this.keiyakuDetail.contact_car_failure.toString());
      }
    }
    if (this.fieldOfKeiyaku.ContactCarFailure.type === 30 || this.fieldOfKeiyaku.ContactCarFailure.type === 35) {
      this.contactCarFailureFormControl.disable();
    }
    //#endregion

    //#region CarName ------------------------------------------------------------------------------------
    if (this.keiyakuDetail.car_name !== null) {
      if (this.fieldOfKeiyaku.CarName.type === 30 || this.fieldOfKeiyaku.CarName.type === 35) {
        this.carNameFormControl.setValue(new Date(this.keiyakuDetail.car_name));
      }
      else {
        this.carNameFormControl.setValue(this.keiyakuDetail.car_name.toString());
      }
    }
    if (this.fieldOfKeiyaku.CarName.type === 30 || this.fieldOfKeiyaku.CarName.type === 35) {
      this.carNameFormControl.disable();
    }
    //#endregion

    //#region RegistNo -----------------------------------------------------------------------------------
    if (this.keiyakuDetail.regist_no !== null) {
      if (this.fieldOfKeiyaku.RegistNo.type === 30 || this.fieldOfKeiyaku.RegistNo.type === 35) {
        this.registNoFormControl.setValue(new Date(this.keiyakuDetail.regist_no));
      }
      else {
        this.registNoFormControl.setValue(this.keiyakuDetail.regist_no.toString());
      }
    }
    if (this.fieldOfKeiyaku.RegistNo.type === 30 || this.fieldOfKeiyaku.RegistNo.type === 35) {
      this.registNoFormControl.disable();
    }
    //#endregion

    //#region Address ------------------------------------------------------------------------------------
    if (this.keiyakuDetail.address !== null) {
      if (this.fieldOfKeiyaku.Address.type === 30 || this.fieldOfKeiyaku.Address.type === 35) {
        this.addressFormControl.setValue(new Date(this.keiyakuDetail.address));
      }
      else {
        this.addressFormControl.setValue(this.keiyakuDetail.address.toString());
      }
    }
    if (this.fieldOfKeiyaku.Address.type === 30 || this.fieldOfKeiyaku.Address.type === 35) {
      this.addressFormControl.disable();
    }
    //#endregion
  }

  callApiGetFamily() {
    this.httpService.post(this.API_URLS.getListFamily, { user_no: this.keiyakuDetail.user_no }).subscribe(res => {
      if (res.code === this.RESULT_CODE.success) {
        res.data.forEach(person => {
          this.listFamily.push({ id: person.FamilyNo, title: person.LastName + ' ' + person.FirstName });
        });
      } else {
        console.log(res);
        this.toastr.error('', res.message);
      }
    });
  }

  getKeiyakuHosho(hoshoCategoryF: any) {
    let objSearch = {
      hosho_category_f: hoshoCategoryF
    };
    var promise = new Promise((resolve, reject) => {
      this.httpService.post(this.API_URLS.getListKeiyakuHosho, objSearch).subscribe(res => {
        if (res.code === this.RESULT_CODE.success) {
          this.fieldOfKeiyaku = {
            Agent: {name: 'Agent', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            Company: {name: 'Company', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            Category: {name: 'Category', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            Product: {name: 'Product', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            PolicyNo: {name: 'PolicyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 30},
            Status: {name: 'Status', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            FamilyNo: {name: 'FamilyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            HihoFamilyNo: {name: 'HihoFamilyNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            ContractDate: {name: 'ContractDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            StartDate: {name: 'StartDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            HokenEndDate: {name: 'HokenEndDate', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            HKikan: {name: 'HKikan', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 2},
            HokenP: {name: 'HokenP', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 12},
            Haraikata: {name: 'Haraikata', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            PKikan: {name: 'PKikan', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: 2},
            ForeignF: {name: 'ForeignF', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            ContactAccident: {name: 'ContactAccident', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            ContactCarFailure: {name: 'ContactCarFailure', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            CarName: {name: 'CarName', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            RegistNo: {name: 'RegistNo', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null},
            Address: {name: 'Address', display: false, text: '', type: 0, required: 0, selType: 0, listData: [], maxlength: null}
          };
          this.lsMainItem = res.data;
          for (let i = 0; i < this.lsMainItem.length; i++) {
            let item = this.lsMainItem[i];
            switch (item.HoshoNo) {
              case "1":
              this.fieldOfKeiyaku.Agent.display = true;
              this.fieldOfKeiyaku.Agent.text = item.HoshoName;
              this.fieldOfKeiyaku.Agent.required = item.requiredF;
              this.fieldOfKeiyaku.Agent.selType = item.SelType;
              this.fieldOfKeiyaku.Agent.type = item.TypeF;
              break;
              case "2":
              this.fieldOfKeiyaku.Company.display = true;
              this.fieldOfKeiyaku.Company.text = item.HoshoName;
              this.fieldOfKeiyaku.Company.required = item.requiredF;
              this.fieldOfKeiyaku.Company.selType = item.SelType;
              this.fieldOfKeiyaku.Company.type = item.TypeF;
              break;
              case "3":
              this.fieldOfKeiyaku.Category.display = true;
              this.fieldOfKeiyaku.Category.text = item.HoshoName;
              this.fieldOfKeiyaku.Category.required = item.requiredF;
              this.fieldOfKeiyaku.Category.selType = item.SelType;
              this.fieldOfKeiyaku.Category.type = item.TypeF;
              break;
              case "4":
              this.fieldOfKeiyaku.Product.display = true;
              this.fieldOfKeiyaku.Product.text = item.HoshoName;
              this.fieldOfKeiyaku.Product.required = item.requiredF;
              this.fieldOfKeiyaku.Product.selType = item.SelType;
              this.fieldOfKeiyaku.Product.type = item.TypeF;
              break;
              case "5":
              this.fieldOfKeiyaku.PolicyNo.display = true;
              this.fieldOfKeiyaku.PolicyNo.text = item.HoshoName;
              this.fieldOfKeiyaku.PolicyNo.required = item.requiredF;
              this.fieldOfKeiyaku.PolicyNo.selType = item.SelType;
              this.fieldOfKeiyaku.PolicyNo.type = item.TypeF;
              break;
              case "6":
              this.fieldOfKeiyaku.Status.display = true;
              this.fieldOfKeiyaku.Status.text = item.HoshoName;
              this.fieldOfKeiyaku.Status.required = item.requiredF;
              this.fieldOfKeiyaku.Status.selType = item.SelType;
              this.fieldOfKeiyaku.Status.type = item.TypeF;
              break;
              case "7":
              this.fieldOfKeiyaku.FamilyNo.display = true;
              this.fieldOfKeiyaku.FamilyNo.text = item.HoshoName;
              this.fieldOfKeiyaku.FamilyNo.required = item.requiredF;
              this.fieldOfKeiyaku.FamilyNo.selType = item.SelType;
              this.fieldOfKeiyaku.FamilyNo.listData = this.listFamily;
              this.fieldOfKeiyaku.FamilyNo.type = item.TypeF;
              break;
              case "8":
              this.fieldOfKeiyaku.HihoFamilyNo.display = true;
              this.fieldOfKeiyaku.HihoFamilyNo.text = item.HoshoName;
              this.fieldOfKeiyaku.HihoFamilyNo.required = item.requiredF;
              this.fieldOfKeiyaku.HihoFamilyNo.selType = item.SelType;
              this.fieldOfKeiyaku.HihoFamilyNo.listData = this.listFamily;
              this.fieldOfKeiyaku.HihoFamilyNo.type = item.TypeF;
              break;
              case "9":
              this.fieldOfKeiyaku.ContractDate.display = true;
              this.fieldOfKeiyaku.ContractDate.text = item.HoshoName;
              this.fieldOfKeiyaku.ContractDate.required = item.requiredF;
              this.fieldOfKeiyaku.ContractDate.selType = item.SelType;
              this.fieldOfKeiyaku.ContractDate.type = item.TypeF;
              break;
              case "10":
              this.fieldOfKeiyaku.StartDate.display = true;
              this.fieldOfKeiyaku.StartDate.text = item.HoshoName;
              this.fieldOfKeiyaku.StartDate.required = item.requiredF;
              this.fieldOfKeiyaku.StartDate.selType = item.SelType;
              this.fieldOfKeiyaku.StartDate.type = item.TypeF;
              break;
              case "11":
              this.fieldOfKeiyaku.HokenEndDate.display = true;
              this.fieldOfKeiyaku.HokenEndDate.text = item.HoshoName;
              this.fieldOfKeiyaku.HokenEndDate.required = item.requiredF;
              this.fieldOfKeiyaku.HokenEndDate.selType = item.SelType;
              this.fieldOfKeiyaku.HokenEndDate.type = item.TypeF;
              break;
              case "12":
              this.fieldOfKeiyaku.HKikan.display = true;
              this.fieldOfKeiyaku.HKikan.text = item.HoshoName;
              this.fieldOfKeiyaku.HKikan.required = item.requiredF;
              this.fieldOfKeiyaku.HKikan.selType = item.SelType;
              this.fieldOfKeiyaku.HKikan.type = item.TypeF;
              break;
              case "13":
              this.fieldOfKeiyaku.HokenP.display = true;
              this.fieldOfKeiyaku.HokenP.text = item.HoshoName;
              this.fieldOfKeiyaku.HokenP.required = item.requiredF;
              this.fieldOfKeiyaku.HokenP.selType = item.SelType;
              this.fieldOfKeiyaku.HokenP.type = item.TypeF;
              break;
              case "14":
              this.fieldOfKeiyaku.Haraikata.display = true;
              this.fieldOfKeiyaku.Haraikata.text = item.HoshoName;
              this.fieldOfKeiyaku.Haraikata.required = item.requiredF;
              this.fieldOfKeiyaku.Haraikata.selType = item.SelType;
              this.fieldOfKeiyaku.Haraikata.type = item.TypeF;
              break;
              case "15":
              this.fieldOfKeiyaku.PKikan.display = true;
              this.fieldOfKeiyaku.PKikan.text = item.HoshoName;
              this.fieldOfKeiyaku.PKikan.required = item.requiredF;
              this.fieldOfKeiyaku.PKikan.selType = item.SelType;
              this.fieldOfKeiyaku.PKikan.type = item.TypeF;
              break;
              case "16":
              this.fieldOfKeiyaku.ForeignF.display = true;
              this.fieldOfKeiyaku.ForeignF.text = item.HoshoName;
              this.fieldOfKeiyaku.ForeignF.required = item.requiredF;
              this.fieldOfKeiyaku.ForeignF.selType = item.SelType;
              this.fieldOfKeiyaku.ForeignF.type = item.TypeF;
              break;
              case "17":
              this.fieldOfKeiyaku.ContactAccident.display = true;
              this.fieldOfKeiyaku.ContactAccident.text = item.HoshoName;
              this.fieldOfKeiyaku.ContactAccident.required = item.requiredF;
              this.fieldOfKeiyaku.ContactAccident.selType = item.SelType;
              this.fieldOfKeiyaku.ContactAccident.type = item.TypeF;
              break;
              case "18":
              this.fieldOfKeiyaku.ContactCarFailure.display = true;
              this.fieldOfKeiyaku.ContactCarFailure.text = item.HoshoName;
              this.fieldOfKeiyaku.ContactCarFailure.required = item.requiredF;
              this.fieldOfKeiyaku.ContactCarFailure.selType = item.SelType;
              this.fieldOfKeiyaku.ContactCarFailure.type = item.TypeF;
              break;
              case "19":
              this.fieldOfKeiyaku.CarName.display = true;
              this.fieldOfKeiyaku.CarName.text = item.HoshoName;
              this.fieldOfKeiyaku.CarName.required = item.requiredF;
              this.fieldOfKeiyaku.CarName.selType = item.SelType;
              this.fieldOfKeiyaku.CarName.type = item.TypeF;
              break;
              case "20":
              this.fieldOfKeiyaku.RegistNo.display = true;
              this.fieldOfKeiyaku.RegistNo.text = item.HoshoName;
              this.fieldOfKeiyaku.RegistNo.required = item.requiredF;
              this.fieldOfKeiyaku.RegistNo.selType = item.SelType;
              this.fieldOfKeiyaku.RegistNo.type = item.TypeF;
              break;
              case "21":
              this.fieldOfKeiyaku.Address.display = true;
              this.fieldOfKeiyaku.Address.text = item.HoshoName;
              this.fieldOfKeiyaku.Address.required = item.requiredF;
              this.fieldOfKeiyaku.Address.selType = item.SelType;
              this.fieldOfKeiyaku.Address.type = item.TypeF;
              break;
            }
          }
          resolve();
        }
        else {
          console.log(res);
          this.toastr.error('', res.message);
          reject();
        }
      });
    });
    return promise;
  }

  changeCategoryF() {
    this.getKeiyakuHosho(this.categoryFormControl.value).then(() => {
      this.keiyakuDetail.hosho_category_f = this.categoryFormControl.value;
    });
  }

  checkRequired() {
    if (this.fieldOfKeiyaku.Agent.required === 1) {
      if (this.fieldOfKeiyaku.Agent.type !== 70) {
        return true;
        /*
        if (this.agentFormControl.hasError('required')) {
          return true;
        }
        */
      }
      else if (typeof this.keiyakuDetail.agent_name === "undefined" || this.keiyakuDetail.agent_name === null || this.keiyakuDetail.agent_name.toString().trim() === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.Company.required === 1){
      if (this.fieldOfKeiyaku.Company.type !== 50) {
        return true;
        /*
        if (this.companyFormControl.hasError('required')) {
          return true;
        }
        */
      }
      else if (typeof this.keiyakuDetail.company_name === "undefined" || this.keiyakuDetail.company_name === null || this.keiyakuDetail.company_name.toString().trim() === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.Category.required === 1){
      if (this.fieldOfKeiyaku.Category.type !== 90) {
        return true;
      }
      else if (this.categoryFormControl.hasError('required')) {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.Product.required === 1){
      if (this.fieldOfKeiyaku.Product.type !== 60) {
        return true;
        /*
        if (this.productFormControl.hasError('required')) {
          return true;
        }
        */
      }
      else if (typeof this.keiyakuDetail.product_name === "undefined" || this.keiyakuDetail.product_name === null || this.keiyakuDetail.product_name.toString().trim() === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.PolicyNo.required === 1){
      if (this.fieldOfKeiyaku.PolicyNo.type !== 1) {
        return true;
      }
      else if (this.policyNoFormControl.hasError('required')) {
        return true;
      }
    }
    
    if (this.fieldOfKeiyaku.Status.required === 1){
      if (this.fieldOfKeiyaku.Status.type !== 20) {
        return true;
      }
      else if (this.statusFormControl.hasError('required')) {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.FamilyNo.required === 1){
      if (this.fieldOfKeiyaku.FamilyNo.type !== 40) {
        return true;
      }
      else if (this.familyNoFormControl.hasError('required')) {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.HihoFamilyNo.required === 1){
      if (this.fieldOfKeiyaku.HihoFamilyNo.type !== 40) {
        return true;
      }
      else if (this.hihoFamilyNoFormControl.hasError('required')) {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.ContractDate.required === 1){
      if (this.fieldOfKeiyaku.ContractDate.type !== 30) {
        return true;
      }
      else if (typeof this.contractDateFormControl.value === "undefined" || this.contractDateFormControl.value === null || this.contractDateFormControl.value === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.StartDate.required === 1){
      if (this.fieldOfKeiyaku.StartDate.type !== 30) {
        return true;
      }
      else if (typeof this.contractDateFormControl.value === "undefined" || this.contractDateFormControl.value === null || this.contractDateFormControl.value === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.HokenEndDate.required === 1){
      if (this.fieldOfKeiyaku.HokenEndDate.type !== 30) {
        return true;
      }
      else if (typeof this.hokenEndDateFormControl.value === "undefined" || this.hokenEndDateFormControl.value === null || this.hokenEndDateFormControl.value === "") {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.HKikan.required === 1){
      if (this.fieldOfKeiyaku.HKikan.type !== 80) {
        return true;
        /*
        if (this.hKikanFormControl.hasError('required')) {
          return true;
        }
        */
      }
      else {
        if (this.hKikanFormControl.hasError('required') || this.hKikanFFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.HokenP.required === 1){
      if (this.fieldOfKeiyaku.HokenP.type !== 100) {
        return true;
      }
      else {
        if (this.hokenPFormControl.hasError('required') || this.currencyFFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.Haraikata.required === 1){
      if (this.fieldOfKeiyaku.Haraikata.type !== 20) {
        return true;
      }
      else if (this.haraikataFormControl.hasError('required')) {
        return true;
      }
    }

    if (this.fieldOfKeiyaku.PKikan.required === 1){
      if (this.fieldOfKeiyaku.PKikan.type !== 80) {
        return true;
        /*
        if (this.pKikanFormControl.hasError('required')) {
          return true;
        }
        */
      }
      else {
        if (this.pKikanFormControl.hasError('required') || this.pKikanFFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.ForeignF.required === 1){
      if (this.fieldOfKeiyaku.ForeignF.type !== 20) {
        return true;
      }
      else {
        if (this.foreignFFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.ContactAccident.required === 1){
      if (this.fieldOfKeiyaku.ContactAccident.type !== 3) {
        return true;
      }
      else {
        if (this.contactAccidentFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.ContactCarFailure.required === 1){
      if (this.fieldOfKeiyaku.ContactCarFailure.type !== 3) {
        return true;
      }
      else {
        if (this.contactCarFailureFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.CarName.required === 1){
      if (this.fieldOfKeiyaku.CarName.type !== 0) {
        return true;
      }
      else {
        if (this.carNameFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.RegistNo.required === 1){
      if (this.fieldOfKeiyaku.RegistNo.type !== 0) {
        return true;
      }
      else {
        if (this.registNoFormControl.hasError('required')) {
          return true;
        }
      }
    }

    if (this.fieldOfKeiyaku.Address.required === 1){
      if (this.fieldOfKeiyaku.Address.type !== 0) {
        return true;
      }
      else {
        if (this.addressFormControl.hasError('required')) {
          return true;
        }
      }
    }
    return false;
  }

  changeOption(fieldName) {
    let lsItem = JSON.parse(localStorage.getItem('ls-item-for-get'));
    localStorage.removeItem('ls-item-for-get');
    if (fieldName === 'hKikanF' && typeof this.hKikanFFormControl.value !== 'undefined' && this.hKikanFFormControl.value !== null) {
      if (this.hKikanFFormControl.value.toString() === '8' || this.hKikanFFormControl.value.toString() === '3') {
        this.hKikanFormControl.setValue(null);
        this.hKikanFormControl.disable();
        return;
      }
      else {
        if (typeof this.hKikanFormControl.value !== 'undefined' && this.hKikanFormControl.value !== null && this.hKikanFormControl.value.toString() === '0') {
          this.hKikanFormControl.setValue(null);
        }
      }
      this.hKikanFormControl.enable();
    }
    if (fieldName === 'pKikanF' && typeof this.pKikanFFormControl.value !== 'undefined' && this.pKikanFFormControl.value !== null) {
      if (this.pKikanFFormControl.value.toString() === '8' || this.pKikanFFormControl.value.toString() === '3') {
        this.pKikanFormControl.setValue(null);
        this.pKikanFormControl.disable();
        return;
      }
      else {
        if (typeof this.pKikanFormControl.value !== 'undefined' && this.pKikanFormControl.value !== null && this.pKikanFormControl.value.toString() === '0') {
          this.pKikanFormControl.setValue(null);
        }
      }
      this.pKikanFormControl.enable();
    }
    if (fieldName === 'haraikata') {
      if (typeof this.haraikataFormControl.value !== 'undefined' && this.haraikataFormControl.value !== null && this.haraikataFormControl.value.toString() === '6') {
        this.pKikanFormControl.setValue(null);
        this.pKikanFormControl.disable();
        this.pKikanFFormControl.setValue(null);
        this.pKikanFFormControl.disable();
      }
      else {
        if (typeof this.pKikanFFormControl.value !== 'undefined' && this.pKikanFFormControl.value !== null) {
          if (this.pKikanFFormControl.value.toString() === '8' || this.pKikanFFormControl.value.toString() === '3') {
            this.pKikanFormControl.setValue(null);
            this.pKikanFormControl.disable();
            return;
          }
        }
        else {
          this.pKikanFormControl.enable();
        }
        this.pKikanFFormControl.enable();
      }
    }
    if (fieldName === 'foreignF') {
      for (let i = 0; i < lsItem.length; i++) {
        let item = lsItem[i];
        if (this.foreignFFormControl.value.toString() === item.selNo.toString()) {
          this.keiyakuDetail.foreign_f_name = item.name;
          break;
        }
      }
    }
  }

  checkTypeOfField(): boolean {
    this.invalidType = true;
    if (this.fieldOfKeiyaku.Agent.display && this.fieldOfKeiyaku.Agent.type !== 70) {
      return false;
    }
    if (this.fieldOfKeiyaku.Company.display && this.fieldOfKeiyaku.Company.type !== 50){
      return false;
    }
    if (this.fieldOfKeiyaku.Category.display && this.fieldOfKeiyaku.Category.type !== 90) {
      return false;
    }
    if (this.fieldOfKeiyaku.Product.display && this.fieldOfKeiyaku.Product.type !== 60) {
      return false;
    }
    if (this.fieldOfKeiyaku.PolicyNo.display && this.fieldOfKeiyaku.PolicyNo.type !== 1) {
      return false;
    }
    if (this.fieldOfKeiyaku.Status.display && this.fieldOfKeiyaku.Status.type !== 20) {
      return false;
    }
    if (this.fieldOfKeiyaku.FamilyNo.display && this.fieldOfKeiyaku.FamilyNo.type !== 40) {
      return false;
    }
    if (this.fieldOfKeiyaku.HihoFamilyNo.display && this.fieldOfKeiyaku.HihoFamilyNo.type !== 40) {
      return false;
    }
    if (this.fieldOfKeiyaku.ContractDate.display && this.fieldOfKeiyaku.ContractDate.type !== 30) {
      return false;
    }
    if (this.fieldOfKeiyaku.StartDate.display && this.fieldOfKeiyaku.StartDate.type !== 30) {
      return false;
    }
    if (this.fieldOfKeiyaku.HokenEndDate.display && this.fieldOfKeiyaku.HokenEndDate.type !== 30) {
      return false;
    }
    if (this.fieldOfKeiyaku.HKikan.display && this.fieldOfKeiyaku.HKikan.type !== 80) {
      return false;
    }
    if (this.fieldOfKeiyaku.HokenP.display && this.fieldOfKeiyaku.HokenP.type !== 100) {
      return false;
    }
    if (this.fieldOfKeiyaku.Haraikata.display && this.fieldOfKeiyaku.Haraikata.type !== 20) {
      return false;
    }
    if (this.fieldOfKeiyaku.PKikan.display && this.fieldOfKeiyaku.PKikan.type !== 80) {
      return false;
    }
    if (this.fieldOfKeiyaku.ForeignF.display && this.fieldOfKeiyaku.ForeignF.type !== 20) {
      return false;
    }
    if (this.fieldOfKeiyaku.ContactAccident.display && this.fieldOfKeiyaku.ContactAccident.type !== 3) {
      return false;
    }
    if (this.fieldOfKeiyaku.ContactCarFailure.display && this.fieldOfKeiyaku.ContactCarFailure.type !== 3) {
      return false;
    }
    if (this.fieldOfKeiyaku.CarName.display && this.fieldOfKeiyaku.CarName.type !== 0) {
      return false;
    }
    if (this.fieldOfKeiyaku.RegistNo.display && this.fieldOfKeiyaku.RegistNo.type !== 0) {
      return false;
    }
    if (this.fieldOfKeiyaku.Address.display && this.fieldOfKeiyaku.Address.type !== 0) {
      return false;
    }

    return true;
  }

  backToListOcr(): void {
    this.router.navigate(['/' + this.ROUTER_URL.ocrRequest]);
  }

  strToArr(str): any {
    let arrReturn = JSON.parse(str.replace(/(\r\n\t|\n|\r\t)/gm,"<br />"));
    return arrReturn;
  }

  doReject(): void {
    const dialogMessage = this.dialog.open(SendMessageComponent, {
      width: '500px',
      data: {
        type: 'reject',
        popupTitle: this.translate.instant('rejectPopupTitle'),
        messageTitle: this.translate.instant('rejectMessageTitle'),
        messageContent: this.translate.instant('rejectMessageContent')
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });
    dialogMessage.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined' && result.action !== 'close') {
        const objData = {
          keiyaku_info: {
            KeiyakuNo: this.keiyakuDetail.keiyaku_no
          },
          message_info: {
            UserNo: this.keiyakuDetail.user_no,
            MessageTitle: '画像読み取りエラー',
            MessageContent: result.value,
            TantoName: localStorage.getItem('Clerkname')
          },
          type: 'REJECT'
        };
        this.httpService.post(this.API_URLS.processKeiyakuAuto, objData).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            this.toastr.success('', this.translate.instant('sendMessageSuccess'));
            this.router.navigate(['/' + this.ROUTER_URL.ocrRequest]);
          } else {
            console.log(res);
            this.toastr.error('', res.message);
          }
        });
      }
    });
  }

  doAccess(): void {
    const dialogMessage = this.dialog.open(SendMessageComponent, {
      width: '500px',
      data: {
        type: 'access',
        popupTitle: this.translate.instant('accessPopupTitle'),
        messageTitle: this.translate.instant('accessMessageTitle'),
        messageContent: this.translate.instant('accessMessageContent')
      },
      panelClass: ['remodal-wrapper', 'remodal-is-opened', 'custom-modal']
    });
    dialogMessage.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined' && result.action !== 'close') {
        this.mapDataToSave();
        console.log(this.keiyakuDetail);
        const objData = {
          keiyaku_info: {
            KeiyakuNo: this.keiyakuDetail.keiyaku_no,
            HokenP: this.keiyakuDetail.hoken_p,
            AgentName: this.keiyakuDetail.agent_name,
            AgentNo: this.keiyakuDetail.agent_no,
            TantoNameCompany: this.keiyakuDetail.tanto_name_company,
            ProductName: this.keiyakuDetail.product_name,
            PolicyNo: this.keiyakuDetail.policy_no,
            Status: this.keiyakuDetail.status,
            FamilyNo: this.keiyakuDetail.family_no,
            FamilyName: this.keiyakuDetail.family_name,
            HihoFamilyNo: this.keiyakuDetail.hiho_family_no,
            HihoFamilyName: this.keiyakuDetail.hiho_family_name,
            HKikan: this.keiyakuDetail.h_kikan,
            HKikanF: this.keiyakuDetail.h_kikan_f,
            Haraikata: this.keiyakuDetail.haraikata,
            PKikan: this.keiyakuDetail.p_kikan,
            PKikanF: this.keiyakuDetail.p_kikan_f,
            CompanyName: this.keiyakuDetail.company_name,
            ContractDate: this.keiyakuDetail.contract_date,
            HokenEndDate: this.keiyakuDetail.hoken_end_date,
            URL: this.keiyakuDetail.url,
            Phone: this.keiyakuDetail.phone,
            Memo: this.keiyakuDetail.memo,
            CompanyCd: this.keiyakuDetail.company_cd,
            CategoryCd: this.keiyakuDetail.category_cd,
            ProductCd: this.keiyakuDetail.product_cd,
            ForeignF: this.keiyakuDetail.foreign_f,
            ContactAccident: this.keiyakuDetail.contact_accident,
            ContactCarFailure: this.keiyakuDetail.contact_car_failure,
            CarName: this.keiyakuDetail.car_name,
            RegistNo: this.keiyakuDetail.regist_no,
            Address: this.keiyakuDetail.address,
            CurrencyF: this.keiyakuDetail.currency_f,
            shuKeiyaku: this.listShukeiyaku,
            tokuyakus: this.listTokuyaku,
            shukeiyakuDelete: this.keiyakuDetail.shukeiyaku_delete,
            tokuyakusDelete: this.keiyakuDetail.tokuyakus_delete
          },
          message_info: {
            UserNo: this.keiyakuDetail.user_no,
            MessageTitle: '自動入力による登録が完了しました',
            MessageContent: result.value,
            TantoName: localStorage.getItem('Clerkname')
          },
          type: 'ACCESS'
        };
        this.httpService.post(this.API_URLS.processKeiyakuAuto, objData).subscribe(res => {
          if (res.code === this.RESULT_CODE.success) {
            this.toastr.success('', this.translate.instant('sendMessageSuccess'));
            this.router.navigate(['/' + this.ROUTER_URL.ocrRequest]);
          } else {
            this.toastr.error('', res.message);
          }
        });
      }
    });
  }
}

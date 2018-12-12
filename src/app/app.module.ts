import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FileDropModule } from 'ngx-file-drop';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatDatepickerModule
  , MatNativeDateModule
  , MatFormFieldModule
  , MatInputModule
  , MatSelectModule
  , MAT_DATE_LOCALE
  , MatDialogModule
  , MatIconModule
  , DateAdapter
  , MAT_DATE_FORMATS
  , MatAutocompleteModule
} from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';

import { HttpIntercepter } from './core/intercepter/http-intercepter';
import { CoreModule } from './core/core.module';
import { authGuard } from './core/common/authGuard';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { CustomerSearchComponent } from './components/customer-search/customer-search.component';
import { HeaderComponent } from './components/common/header/header.component';
import { MenuComponent } from './components/common/menu/menu.component';
import { GridCommonComponent } from './components/common/grid-common/grid-common.component';
import { ProductsFamilyComponent } from './components/products-family/products-family.component';
import { ProductsCategoryComponent } from './components/products-category/products-category.component';
import { TabCommonComponent } from './components/common/tab-common/tab-common.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { AnalyzerInfoComponent } from './components/analyzer-info/analyzer-info.component';
import { HistoryInfoComponent } from './components/history-info/history-info.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { MessageSendComponent } from './components/message-send/message-send.component';
import { MessagesAwaitComponent } from './components/messages-await/messages-await.component';
import { MessageDetailComponent } from './components/message-detail/message-detail.component';
import { MessagesTargetComponent } from './components/messages-target/messages-target.component';
import { MessagesTargetChoseComponent } from './components/messages-target-chose/messages-target-chose.component';
import { MessagesTargetDetailComponent } from './components/messages-target-detail/messages-target-detail.component';
import { UploadImageComponent } from './components/common/popup/upload-image/upload-image.component';
import { ViewImageComponent } from './components/common/popup/view-image/view-image.component';
import { ConfirmDialogComponent } from './components/common/popup/confirm-dialog/confirm-dialog.component';
import { OcrDetailComponent } from './components/ocr-detail/ocr-detail.component';
import { SelectItemCommonComponent } from './components/common/popup/select-item-common/select-item-common.component';
import { AddAgencyComponent } from './components/common/popup/add-agency/add-agency.component';
import { OCRRequestComponent } from './components/ocr-request/ocr-request.component';
import { AddInsuranceCompanyComponent } from './components/common/popup/add-insurance-company/add-insurance-company.component';
import { AddInsuranceTypeComponent } from './components/common/popup/add-insurance-type/add-insurance-type.component';
import { AddTextComponent } from './components/common/popup/add-text/add-text.component';
import { SendMessageComponent } from './components/common/popup/send-message/send-message.component';
import { ImageEditorComponent } from './components/ocr-detail/image-editor/image-editor.component';
import { KeiyakuFieldComponent } from './components/common/keiyaku-field/keiyaku-field.component';
import { YearMonthComponent } from './components/common/year-month/year-month.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerSearchComponent,
    HeaderComponent,
    MenuComponent,
    GridCommonComponent,
    ProductsFamilyComponent,
    ProductsCategoryComponent,
    TabCommonComponent,
    MessageListComponent,
    AnalyzerInfoComponent,
    HistoryInfoComponent,
    ProductDetailComponent,
    ProductImageComponent,
    MessageSendComponent,
    MessagesAwaitComponent,
    MessageDetailComponent,
    MessagesTargetComponent,
    MessagesTargetChoseComponent,
    MessagesTargetDetailComponent,
    UploadImageComponent,
    ViewImageComponent,
    ConfirmDialogComponent,
    OcrDetailComponent,
    SelectItemCommonComponent,
    AddAgencyComponent,
    OCRRequestComponent,
    AddInsuranceCompanyComponent,
    AddInsuranceTypeComponent,
    AddTextComponent,
    SendMessageComponent,
    ImageEditorComponent,
    KeiyakuFieldComponent,
    YearMonthComponent
  ],
  imports: [
    ToastrModule.forRoot({
      // positionClass: 'toast-bottom-right'
    }),
    FileDropModule,
    BrowserModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    AppRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [
    authGuard,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepter, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UploadImageComponent
    , ViewImageComponent
    , ConfirmDialogComponent
    , SelectItemCommonComponent
    , AddAgencyComponent
    , AddInsuranceCompanyComponent
    , AddInsuranceTypeComponent
    , AddTextComponent
    , SendMessageComponent
  ]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // return new TranslateHttpLoader(http);
}

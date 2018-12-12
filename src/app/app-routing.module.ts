import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { CustomerSearchComponent } from './components/customer-search/customer-search.component';
import { ProductsFamilyComponent } from './components/products-family/products-family.component';
import { ProductsCategoryComponent } from './components/products-category/products-category.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageSendComponent } from './components/message-send/message-send.component';
import { AnalyzerInfoComponent } from './components/analyzer-info/analyzer-info.component';
import { HistoryInfoComponent } from './components/history-info/history-info.component';
import { MessagesAwaitComponent } from './components/messages-await/messages-await.component';
import { MessageDetailComponent } from './components/message-detail/message-detail.component';
import { MessagesTargetComponent } from './components/messages-target/messages-target.component';
import { MessagesTargetChoseComponent } from './components/messages-target-chose/messages-target-chose.component';
import { MessagesTargetDetailComponent } from './components/messages-target-detail/messages-target-detail.component';
import { OcrDetailComponent } from './components/ocr-detail/ocr-detail.component';
import { OCRRequestComponent } from './components/ocr-request/ocr-request.component';

import { ROUTER_URL } from './core/const';
import { authGuard } from './core/common/authGuard';

const routes: Routes = [
    { path: '', redirectTo: ROUTER_URL.login, pathMatch: 'full' },
    { path: ROUTER_URL.login, component: LoginComponent },
    { path: ROUTER_URL.customerSearch, component: CustomerSearchComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.productsFamily, component: ProductsFamilyComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.productsCategory, component: ProductsCategoryComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.productDetail + '/:id', component: ProductDetailComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.productImage + '/:id', component: ProductImageComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messageList, component: MessageListComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messageSend + '/:type' + '/:id', component: MessageSendComponent, data: { menu: 1 }, canActivate: [authGuard] },
    { path: ROUTER_URL.analyzerInfo, component: AnalyzerInfoComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.historyInfo, component: HistoryInfoComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messagesAwait, component: MessagesAwaitComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messagesDetail + '/:id', component: MessageDetailComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messageReply + '/:type' + '/:id', component: MessageSendComponent, data: { menu: 2 }, canActivate: [authGuard] },
    { path: ROUTER_URL.messagesTarget, component: MessagesTargetComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messagesTargetChose, component: MessagesTargetChoseComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.messagesTargetDetail + '/:id', component: MessagesTargetDetailComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.ocrDetail + '/:id', component: OcrDetailComponent, canActivate: [authGuard] },
    { path: ROUTER_URL.ocrRequest, component: OCRRequestComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: ROUTER_URL.login }
   
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}

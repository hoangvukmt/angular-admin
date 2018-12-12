import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './service/loading.service';
import { BaseCpnComponent } from './base-cpn/base-cpn.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BaseCpnComponent],
  providers: [
    LoadingService
  ],
})
export class CoreModule { }

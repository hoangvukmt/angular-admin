import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-common',
  templateUrl: './tab-common.component.html',
  styleUrls: ['./tab-common.component.css']
})
export class TabCommonComponent implements OnInit {
  @Input() objTab = {
    hasBack: false,
    tabList: []
  };
  @Input() tabClass: string;
  public backTitle = "";

  constructor(
    private router: Router
  ) {
    
  }

  ngOnInit() {
    if (typeof this.objTab["backTitle"] !== "undefined") {
      this.backTitle = this.objTab["backTitle"];
    }
    else {
      this.backTitle = "顧客検索";
    }
  }

  goURL(url: string): void {
    if (url !== "no-url") {
      this.router.navigate(['/' + url]);
    }
  }

  doBack(): void {
    if (this.objTab["backToPage"]) {
      this.router.navigate([localStorage.getItem('tab-back-to-page')]);
    }
    else {
      this.router.navigate([localStorage.getItem('prev-page-tab')]);
    }
  }

}

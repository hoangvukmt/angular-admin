import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTER_URL } from '../../../core/const';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() objMenu = {
    currentMenu: ""
  };

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goUrl(type: string): void {
    switch (type) {
      case 'menu-1':
        this.router.navigate(['/' + ROUTER_URL.customerSearch]);
        break;
      case 'menu-2':
        this.router.navigate(['/' + ROUTER_URL.messagesAwait]);
        break;
      case 'menu-3':
        this.router.navigate(['/' + ROUTER_URL.ocrRequest]);
        break;
    }
  }
}

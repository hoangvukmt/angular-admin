import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTER_URL } from '../../../core/const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public ROUTER_URL = ROUTER_URL;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  doLogOff(): void {
    localStorage.clear();
    this.router.navigate(['/' + this.ROUTER_URL.login]);
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { environment } from './../../../../../environments/environment';

declare var $: any;
@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {
  public urlAPI = environment.apiUrl;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor((Math.random() * 100000) + 1);
  public isImage = true;
  public isLocal = false;
  public isImageMessage = false;
  public ROOT_URL = environment.webUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit() {
    if (this.data.type === "image") {
      this.isImage = true;
    }
    else if (this.data.type === "message-image") {
      this.isLocal = true;
    }
    else if (this.data.type === "message") {
      this.isLocal = false;
      this.isImageMessage = true;
    }
    else {
      this.isImage = false;
    }
  }

  genImage() {
    if (this.isLocal) {
      let filePreview = this.data.data;
      const fileSize = filePreview.size/1024/1024;
      if (fileSize <= 5) {
        (window as any).loadImage('#messageImagePreview', filePreview, this.ROOT_URL);
      }
    }
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { environment } from '../../../../../environments/environment';
import { CONST_CODE } from "../../../../core/const";

declare var $: any;
@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  noFile: boolean = true;
  fileSelect: any;
  fileChose: any;
  public ROOT_URL = environment.webUrl;

  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadImageComponent>
  ) {
  }

  ngOnInit() {
  }

  dropped(event: UploadEvent): void {
    let files = event.files;
    if (files.length > 1) {
      this.toastr.warning('', '一度に画像を一つだけ選択してください。');
      return;
    }
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const fileSize = file.size/1024/1024;
          if (fileSize > 5) {
            this.toastr.warning('', '5MB以内の画像を選択してください。');
            return;
          }
          if ((this.data.totalSize + fileSize) > 20) {
            this.toastr.warning('', '添付画像の合計サイズが最大20MBです。');
            return;
          }
          (window as any).loadImage('#previewImage', file, this.ROOT_URL);
          this.fileChose = file;
          this.noFile = false;
        });
      }
    }
  }

  choseFile(): void {
    this.fileChose = (<HTMLInputElement>document.getElementById('choseFile')).files[0];
    if (this.data.fileFilter === CONST_CODE.imagePdf) {
      if (!this.fileChose.name.match(/\.(pdf)$/) && !this.fileChose.name.match(/\.(jpg)$/) && !this.fileChose.name.match(/\.(jpeg)$/)) {
        this.toastr.warning('', 'アップロードファイルの形式が正しくありません。');
        return;
      }
    }
    if (this.data.fileFilter === CONST_CODE.imageUpload) {
      if (!this.fileChose.name.match(/\.(jpg)$/) && !this.fileChose.name.match(/\.(jpeg)$/)) {
        this.toastr.warning('', 'アップロードファイルの形式が正しくありません。');
        return;
      }
    }
    const fileSize = this.fileChose.size/1024/1024;
    if (fileSize > 5) {
      this.toastr.warning('', '5MB以内の画像を選択してください。');
      return;
    }
    if ((this.data.totalSize + fileSize) > 20) {
      this.toastr.warning('', '添付画像の合計サイズが最大20MBです。');
      return;
    }
    this.noFile = false;
  }

  doClose(): void {
    this.dialogRef.close({action: 'close'});
  }

  doUpload(): void {
    this.dialogRef.close({
      action: 'ok',
      data: this.fileChose
    });
  }
}

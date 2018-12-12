import { async } from '@angular/core/testing';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';
import { HttpService } from '../../../core/service/http.service';
import { API_URLS, ROUTER_URL, RESULT_CODE } from '../../../core/const';
import { environment } from './../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css']
})
export class ImageEditorComponent implements OnInit, AfterViewInit {
  @Input() keiyakuId: number;
  @Input() actionClose: string;
  public token = localStorage.getItem('id_token');
  public random: number = Math.floor(Math.random() * 100000 + 1);
  // tslint:disable:max-line-length
  // tslint:disable:no-eval
  @ViewChild('canvasEl') canvasEl: ElementRef;
  context: CanvasRenderingContext2D;

  // init image
  isMobile = false;
  canvas: any;
  src = [];
  firstListPoints: any;
  img: any;
  widthImage: any;
  heightImage: any;
  divSize: any;
  miniature = [];
  realWidth = [];
  realHeight = [];
  totalImage = 0;
  indexImage = 0;
  dataListImage = [];
  rotateDegree = [];
  dynamicWidth: number;
  dynamicHeight: number;

  // init box
  boxUpLeft: any;
  boxUpRight: any;
  boxDownLeft: any;
  boxDownRight: any;

  // masking and crop
  croped = false;
  dragok = false;
  dragPointMasking = false;
  enablePolygon = false;
  maskingFocus: number;
  pointMaskings = [];
  maskings = [];
  shapes = [];
  nameList = [];
  dataMasking = [];
  dataRotate = [];
  startX: any;
  startY: any;

  // handle flag button
  editmode = true;
  enableMasking = false;
  isCropDone = false;
  enableButton = true;
  enableGoToRotate = false;
  enableGoToCrop = false;
  enableGoToMasking = false;
  enableBackToList = false;
  enableBackToImage = false;
  enableCrop = false;
  enableAccept = false;
  enableRotate = false;

  // other
  beginWidth: number;
  upLeftX: number;
  upLeftY: number;
  upRightX: number;
  upRightY: number;
  downLeftX: number;
  downLeftY: number;
  downRightX: number;
  downRightY: number;
  
  zoomValue = 100;
  actionAccept: string;
  actionSaveAndClose: string;
  circle_r: number;
  coordinatesMasking = [];
  beginShapesBeforeRotate = [];
  beginMaskingBeforeRotate = [];
  beginRotateDegreeBeforeRotate = 0;
  baseMaskingList = [];
  baseShapeList = [];
  baseDegree = [];
  imagesFirstLoad = [];
  listPointDefault = [];
  beginMiniature: number;
  numberZoomIn = 1.2;
  numberZoomOut = 0.8;
  numberZoom = 1;
  defaultPartWidth = 0;
  defaultPartHeight = 0;
  isChangeEdit = false;
  heightBody = 0;
  constructor(
    private toastr: ToastrService,
    public httpService: HttpService,
  ) {
    this.circle_r = 5;
  }

  async ngOnInit() {
    let searchImage = {
      user_no: -1,
      keiyaku_no: this.keiyakuId
    };
    const _this = this;
    this.httpService.post(API_URLS.getListImage, searchImage).subscribe(async function (res) {
      if (res.code === RESULT_CODE.success) {
        let arrImage = JSON.parse(res.data[0].Images);
        if (arrImage.length === 0) {
          let divCanvas = $('#vnext-editor').parent().parent();
          $(divCanvas).css('height', window.innerHeight);
        }
        for (let i = 0; i < arrImage.length; i++) {
          let item = arrImage[i];
          let url = environment.apiUrl + 'api/getFileImg?group_id=' + item.GroupID + '&file_id=' + item.FileID + '&token=' + _this.token + '&' + _this.random;
          _this.src.push(url);
        }
        //const srcList = ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwQFRsUFRMgIB0iIiAbKB8kMDQwJCY4MB8fLUgwLCwrOkA6Iys/RDM4NygtLisBCgoKDQwNGhAQGysmHSY1KystKysrKysvMS03KystKy4rKysrKystLSsrKysrKysrKysrKysrKysrKysrKysrK//AABEIAEAAQAMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAAEBgMFBwIB/8QANBAAAgECBAMGBAUFAQAAAAAAAQIDBBEABSExBhJBExQiUWGRB3GBoRVCUsHwMjPC0eEj/8QAGAEBAQEBAQAAAAAAAAAAAAAAAgMAAQT/xAAcEQADAQEBAQEBAAAAAAAAAAAAARECITEDExL/2gAMAwEAAhEDEQA/AM/LsTUHtE1Gum+OaOCSrqkhhILtZVHz6Yh7RbSf+Q8W3pho+HjUMWYyzVigtCvOD5Ab/XAgqPHC/wANaGlgStz2dZOzHMYwbIPmeowy19Zl1TA/cpyg5T/QPL0wi8f8XVGZVH4dlTFaWM+K2zW/bAXDtNmPJ3gtI1kLbXA/l8apG/nWvBgOXGSpi7vMYmJJjYeEk/MbYW+IOEK2HN1eUMwrHJWQjQtuQfLe+Gr8Frq6nFSkrmSNgR5aHoMFtm9XFQrBXhS8TkLca+h+mOVMUaMez3LqnKawUdaoim5v6b3v7bjA7kJEFLKCehOpxd8bTvW5pRzvyF2uGJ30OKHMI2E9Pbs7W/Na++C0NNwi7J1QEqQCdL4LpZqijFT2alRLHyNp0OOTI7R2aa4ZuvXBmV04lr1iLC0ng+xxRwgq+BvBrqZ52kUyaAKlrk40HJs87Lmp3pWhiJt4re2mF7hLI4AlUTzk9oyKQfy+H/WL/KMipFzZDEkcYhZXYXABN9B64i42enKaQ0/j8eWcsJpXkDG3hIAHvhX4+mSSopqiJGjEqcrIdCDfDpmeQ5bUzpNPHGQzXXm2BOBeJ+HaOelolQGPklEfh0BViLj7YaQdO+GGZ7Ikud00cUDlEFu013ub4AzeI9/pbQOwCjxC9hri84ky6Ok4pkFOzpHFKU5GN7m5v98V+byFZ4Iyp5So8QHzxn6G8ICLxnm5Cxe+tyf+4kg7WOVpKceOMh/lbrgZRzKtlY2b22xIyjkk8J1I/fDtIrg/8N5uK5ZeSJYnRRcA6E64npENRXiOZiJFYG7EKD9euFThSWSPMeSJGKtFd/p1w70EkU8ygW5jtfEdZjPX891dHZZTFSLG0DVHaWW8dmA9T5DAXG3EcPDGVRPNB3iRlbsgx0BFrE+4xdZPII8vUO6X2AG+M4+NMdQXpHKgxd3ewO1+Zb/a2KIlt9EPvM1bWxTVDrI9QTI79SSSScQ5q5WqiQMgvGp1BuNTriSlWJZKM8tnC7dBviPNWIqYiFU3QA33644/Qp8AGdBy8ruQG0v9PTHKzoGk7VrLzdN+uHrhvh6g/u1h705/VovthE4gi7LOauO1gJDYeXpi/wCbRBao+/CeCPM580Mt7JEkaelyST8/CMX9RRvltcFmTkYk8kg2b+eWKf4Hxg1GZC55isf+WNB4wq6fLshlNRSGqkY8sMYB3/VcagDHNYosbeWFUQp6SngkJM1Q4uqjUm/piLjfLosx4deKvQXYjbdfkcVfw2qo5FnhqYpO+IRad1KhxbZQdRbF1xzKYclDg7Si/scbGY4LeqjHJskqoK+OSMCWJQQSDr16Yos3kYVYiMTcoW+22hw9RSCpqAVktv4fPHldl1LVKTURq5HnuPrimvin4SX0nGf/2Q=='];
        const dataRotate = [0, 0];
        const dataMaskingList = [[], []];
        const listpoint = [[], []];
        const pointDefault = [[], []];
        try {
          //this.src = srcList;
          _this.firstListPoints = listpoint;
          _this.listPointDefault = pointDefault;
          _this.dataMasking = dataMaskingList;
          _this.dataRotate = dataRotate;
          _this.totalImage = _this.src.length;
          for (let i = 0; i < _this.src.length; i++) {
            _this.imagesFirstLoad.push(false);
            _this.miniature.push(1);
            _this.shapes.push([]);
            _this.maskings.push([]);
            _this.rotateDegree.push(0);
            _this.dataListImage.push({ vertex: [], mask: [], rotate: 0, index: i });
            const img = new Image();
            img.setAttribute('src', _this.src[i]);
            img.onload = await function () {
              this.realWidth[i] = img.width;
              this.realHeight[i] = img.height;
            }.bind(_this);
          }
        } catch (err) {
        }
        _this.goEdit();
        _this.goToRotate();

        try {
          _this.indexImage = 0;
          _this.createImage(_this.indexImage);
        } catch (err) {
          
        }
      } else {
        _this.toastr.error('', res.message);
      }
    });
  }

  ngAfterViewInit() {
    // this.actionClose = $('image-editor').attr('data-close');
    // this.actionAccept = $('image-editor').attr('data-accept');
    // this.actionSaveAndClose = $('image-editor').attr('data-save-close');
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  goEdit() {
    this.editmode = false;
    this.enableButton = true;
    this.enableGoToRotate = true;
    this.enableGoToCrop = true;
    this.enableGoToMasking = true;
    this.enableBackToList = true;
    this.enableAccept = true;
  }

  goToRotate(): void {
    this.beginRotateDegreeBeforeRotate = this.rotateDegree[this.indexImage];
    this.beginShapesBeforeRotate = this.shapes[this.indexImage];
    this.beginMaskingBeforeRotate = this.maskings[this.indexImage];
    this.enableRotate = true;
    this.enableBackToImage = true;
    this.enableGoToRotate = false;
    this.enableGoToCrop = false;
    this.enableGoToMasking = false;
    this.enableBackToList = false;
    this.enableAccept = false;
  }

  acceptRotate(): void {
    this.enableRotate = false;
    this.enableBackToImage = false;
    this.enableGoToRotate = true;
    this.enableGoToCrop = true;
    this.enableGoToMasking = true;
    this.enableBackToList = true;
    this.enableAccept = true;
    this.rotate_done();
    this.imagesFirstLoad[this.indexImage] = true;
    this.acceptEditAllImage(true);

  }

  goToCrop(): void {
    this.enableCrop = true;
    this.enableBackToImage = true;
    this.enableGoToRotate = false;
    this.enableGoToCrop = false;
    this.enableGoToMasking = false;
    this.enableBackToList = false;
    this.enableAccept = false;
    this.rotateImage();
    this.drawCirclePolygon();
  }

  acceptCrop(): void {
    this.croped = true;
    this.enableCrop = false;
    this.enableBackToImage = false;
    this.enableGoToRotate = true;
    this.enableGoToCrop = true;
    this.enableGoToMasking = true;
    this.enableBackToList = true;
    this.enableAccept = true;
    this.reDrawMasking(1);
    this.draw();
    this.imagesFirstLoad[this.indexImage] = true;
    this.acceptEditAllImage(true);
  }

  goToMasking(): void {
    this.mapDataBox(this.indexImage);
    this.draw();
    this.enableMasking = true;
    this.enableBackToImage = true;
    this.enableGoToRotate = false;
    this.enableGoToCrop = false;
    this.enableGoToMasking = false;
    this.enableBackToList = false;
    this.enableAccept = false;
  }

  acceptMasking() {
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        const s = this.maskings[this.indexImage][i];
        s.enablePoint = false;
        this.draw();
      }
    }
    this.enableMasking = false;
    this.enableBackToImage = false;
    this.enableGoToRotate = true;
    this.enableGoToCrop = true;
    this.enableGoToMasking = true;
    this.enableBackToList = true;
    this.enableAccept = true;
    this.imagesFirstLoad[this.indexImage] = true;
    this.acceptEditAllImage(true);
    // this.acceptEdit(this.indexImage, true);
  }

  createImage(index: number, isNextBack?: boolean): void {
    if (this.src.length > 0) {
      this.img = new Image();
      this.img.setAttribute('src', this.src[index]);
      this.img.onload = () => {
        this.widthImage = this.img.width;
        this.heightImage = this.img.height;
        this.realWidth[index] = this.img.width;
        this.realHeight[index] = this.img.height;
        this.initCanvas();
        if (isNextBack === true) {
          this.rotateDegree[this.indexImage] = this.dataRotate[this.indexImage];
        } else {
          this.rotateDegree = [];
          this.dataRotate.forEach((rotatedegree) => {
            this.rotateDegree.push(rotatedegree);
          });
        }
        if (this.rotateDegree[index] === 90 || this.rotateDegree[index] === 270) {
          this.changeWidthHeight();
        }
        this.setSizeCanvas();
        this.rotateImage();
        this.convertMasking();
        this.initCircle();
        if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
          this.mapDataBox(this.indexImage);
          this.reDrawMasking(1);
        }
        if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
          for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
            this.drawRect(this.maskings[this.indexImage][i]);
          }
        }
      };
    }
  }

  closeAndBack() {
    window[this.actionClose].componentFn();
  }

  nextImage(): void {
    if (this.indexImage !== this.src.length) {
      this.zoomValue = 100;
      // if (this.enableCrop || this.enableMasking || this.enableRotate) {
      //   if (this.indexImage !== this.totalImage - 1) {
      //     this.confirmationDialogService.confirm('確認してください', '現在の編集は破棄されますがよろしいですか？')
      //       .then((confirmed) => {
      //         if (confirmed) {
      //           if (this.enableCrop) {
      //             this.backToImage();
      //           } else if (this.enableMasking) {
      //             this.backToImage();
      //           } else if (this.enableRotate) {
      //             this.backToImage();
      //           }
      //           this.acceptEditAllImage(false);
      //           // this.acceptEdit(this.indexImage, false);
      //           this.actionNext();
      //         }
      //       })
      //       .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      //   }
      // } else {
        // this.acceptEditAllImage(false);
        this.actionNext();
      // }
    }
  }

  actionNext() {
    this.convertShapeToOldSize();
    this.numberZoom = 1;
    this.indexImage += 1;
    if (this.indexImage > this.src.length - 1) {
      this.indexImage = this.src.length - 1;
    }
    if (!this.imagesFirstLoad[this.indexImage]) {
      this.maskings[this.indexImage] = [];
      this.shapes[this.indexImage] = [];
      this.createImage(this.indexImage, true);
      // this.imagesFirstLoad[this.indexImage] = true;
      return;
    }
    this.img = new Image();
    this.img.setAttribute('src', this.src[this.indexImage]);
    this.img.onload = () => {
      this.widthImage = this.img.width;
      this.heightImage = this.img.height;
      this.realWidth[this.indexImage] = this.img.width;
      this.realHeight[this.indexImage] = this.img.height;
      this.initImage();
      if (this.rotateDegree[this.indexImage] !== 180 && this.rotateDegree[this.indexImage] !== 0) {
        this.changeWidthHeight();
      }
      this.setSizeCanvas();
      this.rotateImage();
      if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
        this.mapDataBox(this.indexImage);
        this.reDrawMasking(1);
        this.draw();
      }
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        this.draw();
      }
    };
  }

  preImage(): void {
    if (this.indexImage !== 0) {
      this.zoomValue = 100;
      // if (this.enableCrop || this.enableMasking || this.enableRotate) {
      //   if (this.indexImage !== 0) {
      //     this.confirmationDialogService.confirm('確認してください', '現在の編集は破棄されますがよろしいですか？')
      //       .then((confirmed) => {
      //         if (confirmed) {
      //           if (this.enableCrop) {
      //             this.backToImage();
      //           } else if (this.enableMasking) {
      //             this.backToImage();
      //           } else if (this.enableRotate) {
      //             this.backToImage();
      //           }
      //           // this.acceptEdit(this.indexImage, false);
      //           this.acceptEditAllImage(false);
      //           this.actionPre();
      //         }
      //       })
      //       .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      //   }
      // } else {
        // this.acceptEdit(this.indexImage, false);
        // this.acceptEditAllImage(false);
        this.actionPre();
      // }
    }
  }

  actionPre() {
    this.convertShapeToOldSize();
    this.numberZoom = 1;
    this.indexImage = this.indexImage - 1;
    if (this.indexImage < 0) {
      this.indexImage = 0;
    }
    if (!this.imagesFirstLoad[this.indexImage]) {
      this.maskings[this.indexImage] = [];
      this.shapes[this.indexImage] = [];
      this.createImage(this.indexImage, true);
      return;
    }
    this.img = new Image();
    this.img.setAttribute('src', this.src[this.indexImage]);
    this.img.onload = () => {
      this.widthImage = this.img.width;
      this.heightImage = this.img.height;
      this.realWidth[this.indexImage] = this.img.width;
      this.realHeight[this.indexImage] = this.img.height;
      this.initImage();
      if (this.rotateDegree[this.indexImage] !== 180 && this.rotateDegree[this.indexImage] !== 0) {
        this.changeWidthHeight();
      }
      this.setSizeCanvas();
      this.rotateImage();
      if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
        this.mapDataBox(this.indexImage);
        this.reDrawMasking(1);
        this.draw();
      }
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        this.draw();
      }
    };

  }


  /**
   * set size of canvas, size of image and draw image to canvas
   *
   * @memberof ShoukenDetailComponent
   */
  initCanvas(): void {
    this.initImage();
    this.setSizeCanvas();
    this.createContext();
  }

  /**
   * set value for width and height of image
   *
   * @memberof ShoukenDetailComponent
   */
  initImage() {
    let clientWidth = document.getElementById('image-editor-inner').clientWidth;
    const clientHeight = document.getElementById('image-editor-inner').clientHeight;
    // change width in size mobile
    if (clientWidth > 1000) {
      clientWidth = 850;
    }
    if (clientWidth < 1000 && clientWidth > 350) {
      clientWidth = clientWidth - 40;
    }
    // create miniature in 2 case
    if (this.realWidth[this.indexImage] >= this.realHeight[this.indexImage]) {
      this.divSize = clientWidth;
      this.miniature[this.indexImage] = clientWidth / this.realWidth[this.indexImage];
      this.beginMiniature = this.miniature[this.indexImage];
      this.widthImage = clientWidth;
      this.heightImage = this.realHeight[this.indexImage] * this.miniature[this.indexImage];
      this.dynamicWidth = this.widthImage;
      this.dynamicHeight = this.heightImage;
      this.defaultPartWidth = Math.round(this.widthImage / 5);
      this.defaultPartHeight = Math.round(this.heightImage / 5);
    } else {
      this.divSize = clientWidth;
      this.miniature[this.indexImage] = clientWidth / this.realHeight[this.indexImage];
      this.beginMiniature = this.miniature[this.indexImage];
      this.heightImage = clientWidth;
      this.widthImage = this.realWidth[this.indexImage] * this.miniature[this.indexImage];
      this.dynamicWidth = this.widthImage;
      this.dynamicHeight = this.heightImage;
      this.defaultPartWidth = Math.round(this.widthImage / 5);
      this.defaultPartHeight = Math.round(this.heightImage / 5);
    }
  }


  /**
   * set size of canvas
   *
   * @memberof ShoukenDetailComponent
   */
  setSizeCanvas(): void {
    this.canvas = this.canvasEl.nativeElement;
    this.canvas.width = this.dynamicWidth + 10;
    this.canvas.height = this.dynamicHeight + 10;
    // if (this.canvas.height >= this.canvas.width) {
    //   this.heightBody = this.canvas.height;
    // }
    // if (this.canvas.height < this.canvas.width) {
    //   this.heightBody = this.canvas.width;
    // }
    this.heightBody = $(window).height() - 140;
  }

  /**
   * create context of canvas, get offsetX, offsetY and draw image
   *
   * @memberof ShoukenDetailComponent
   */
  createContext() {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context.drawImage(this.img, 5, 5, this.widthImage, this.heightImage);
  }

  reset() {
    // this.backToImage();
    this.maskings[this.indexImage] = [];
    this.shapes[this.indexImage] = [];
    // this.rotateDegree[this.indexImage] = 0;
    this.imagesFirstLoad = [];
    for (let i = 0; i < this.src.length; i++) {
      this.imagesFirstLoad.push(false);
    }
    this.zoomValue = 100;
    this.editmode = true;
    this.enableRotate = false;
    this.enableCrop = false;
    this.enableMasking = false;
    this.enableBackToImage = false;
    this.createImage(this.indexImage);
    this.acceptEditAllImage(false, true);
  }

  zoomIn() {
    this.zoomValue = this.zoomValue + 20;
    const beginWidth = this.canvas.width - 10;
    if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
      this.dynamicWidth = this.canvas.width - 10 + this.defaultPartWidth;
      this.dynamicHeight = this.canvas.height - 10 + this.defaultPartHeight;
    } else {
      this.dynamicWidth = this.canvas.width - 10 + this.defaultPartHeight;
      this.dynamicHeight = this.canvas.height - 10 + this.defaultPartWidth;
    }
    this.numberZoomIn = this.dynamicWidth / beginWidth;
    this.numberZoom = this.numberZoom * this.numberZoomIn;
    this.setSizeCanvas();
    if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
      this.widthImage = this.canvas.width - 10;
      this.heightImage = this.canvas.height - 10;
    } else {
      this.widthImage = this.canvas.height - 10;
      this.heightImage = this.canvas.width - 10;
    }
    this.miniature[this.indexImage] = this.miniature[this.indexImage] * this.numberZoomIn;
    this.rotateImage();
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        const circle = this.shapes[this.indexImage][i];
        circle.x = (circle.x - 5) * this.numberZoomIn + 5;
        circle.y = (circle.y - 5) * this.numberZoomIn + 5;
      }
      this.draw();
      if (this.enableCrop) {
        this.mapDataBox(this.indexImage);
        this.reDrawFrame();
        this.reDrawMasking(0.7);
      }
    }

    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        const mask = this.maskings[this.indexImage][i];
        mask.x = (mask.x - 5) * this.numberZoomIn + 5;
        mask.y = (mask.y - 5) * this.numberZoomIn + 5;
        mask.width = mask.width * this.numberZoomIn;
        mask.height = mask.height * this.numberZoomIn;
      }
      this.draw();
      if (this.enableCrop) {
        this.mapDataBox(this.indexImage);
        this.reDrawFrame();
        this.reDrawMasking(0.7);
      }
    }
  }

  zoomOut() {
    if (this.zoomValue > 20) {
      this.zoomValue = this.zoomValue - 20;
      const beginWidth = this.canvas.width - 10;
      if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
        this.dynamicWidth = this.canvas.width - 10 - this.defaultPartWidth;
        this.dynamicHeight = this.canvas.height - 10 - this.defaultPartHeight;
      } else {
        this.dynamicWidth = this.canvas.width - 10 - this.defaultPartHeight;
        this.dynamicHeight = this.canvas.height - 10 - this.defaultPartWidth;
      }
      this.numberZoomOut = this.dynamicWidth / beginWidth;
      this.numberZoom = this.numberZoom * this.numberZoomOut;
      this.setSizeCanvas();
      if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
        this.widthImage = this.canvas.width - 10;
        this.heightImage = this.canvas.height - 10;
      } else {
        this.widthImage = this.canvas.height - 10;
        this.heightImage = this.canvas.width - 10;
      }
      this.miniature[this.indexImage] = this.miniature[this.indexImage] * this.numberZoomOut;
      this.rotateImage();
      if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
        for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
          const circle = this.shapes[this.indexImage][i];
          circle.x = (circle.x - 5) * this.numberZoomOut + 5;
          circle.y = (circle.y - 5) * this.numberZoomOut + 5;
        }
        this.draw();
        if (this.enableCrop) {
          this.mapDataBox(this.indexImage);
          this.reDrawFrame();
          this.reDrawMasking(0.7);
        }
      }

      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          const mask = this.maskings[this.indexImage][i];
          mask.x = (mask.x - 5) * this.numberZoomOut + 5;
          mask.y = (mask.y - 5) * this.numberZoomOut + 5;
          mask.width = mask.width * this.numberZoomOut;
          mask.height = mask.height * this.numberZoomOut;
        }
        this.draw();
        if (this.enableCrop) {
          this.mapDataBox(this.indexImage);
          this.reDrawFrame();
          this.reDrawMasking(0.7);
        }
      }
    }
  }

  resetZoom() {
    this.zoomValue = 100;
    const beginWidth = this.canvas.width - 10;
    if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
      this.dynamicWidth = Math.round(this.defaultPartWidth * 5);
      this.dynamicHeight = Math.round(this.defaultPartHeight * 5);
    } else {
      this.dynamicWidth = Math.round(this.defaultPartHeight * 5);
      this.dynamicHeight = Math.round(this.defaultPartWidth * 5);
    }
    this.numberZoom = this.dynamicWidth / beginWidth;
    this.setSizeCanvas();
    if (this.rotateDegree[this.indexImage] === 0 || this.rotateDegree[this.indexImage] === 180) {
      this.widthImage = this.canvas.width - 10;
      this.heightImage = this.canvas.height - 10;
    } else {
      this.widthImage = this.canvas.height - 10;
      this.heightImage = this.canvas.width - 10;
    }
    this.miniature[this.indexImage] = this.beginMiniature;
    this.rotateImage();
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        const circle = this.shapes[this.indexImage][i];
        circle.x = (circle.x - 5) * this.numberZoom + 5;
        circle.y = (circle.y - 5) * this.numberZoom + 5;
      }
      this.draw();
      if (this.enableCrop) {
        this.mapDataBox(this.indexImage);
        this.reDrawFrame();
        this.reDrawMasking(0.7);
      }
    }

    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        const mask = this.maskings[this.indexImage][i];
        mask.x = (mask.x - 5) * this.numberZoom + 5;
        mask.y = (mask.y - 5) * this.numberZoom + 5;
        mask.width = mask.width * this.numberZoom;
        mask.height = mask.height * this.numberZoom;
      }
      this.draw();
      if (this.enableCrop) {
        this.mapDataBox(this.indexImage);
        this.reDrawFrame();
        this.reDrawMasking(0.7);
      }
    }

    this.numberZoom = 1;
  }

  convertShapeToOldSize() {
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        const circle = this.shapes[this.indexImage][i];
        circle.x = circle.x / this.numberZoom;
        circle.y = circle.y / this.numberZoom;
      }
    }

    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        const mask = this.maskings[this.indexImage][i];
        mask.x = mask.x / this.numberZoom;
        mask.y = mask.y / this.numberZoom;
        mask.width = mask.width / this.numberZoom;
        mask.height = mask.height / this.numberZoom;
      }
    }
  }

  rotate_done() {
    const data = {
      rotate: this.rotateDegree[this.indexImage]
    };
  }

  /**
   * set value for rotateDegree when rotate right and rotate image
   *
   * @memberof ShoukenDetailComponent
   */
  rotateRightImage() {
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      const listCircle0 = this.changePositionToRotate0(true, this.shapes[this.indexImage]);
      this.shapes[this.indexImage] = listCircle0;
    }
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      const listMarsking0 = [];
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        listMarsking0.push(this.changePositionToRotate0(false, this.maskings[this.indexImage][i]));
      }
      this.maskings[this.indexImage] = listMarsking0;
    }
    this.rotateDegree[this.indexImage] += 90;
    if (this.rotateDegree[this.indexImage] > 270) {
      this.rotateDegree[this.indexImage] = 0;
    }
    this.changeWidthHeight();
    this.setSizeCanvas();
    this.rotateImage();
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listCircle = this.changePositionWhenRotateFrom0(this.rotateDegree[this.indexImage], true, this.shapes[this.indexImage]);
        this.shapes[this.indexImage] = listCircle;
      }
      this.mapDataBox(this.indexImage);
      this.reDrawMasking(1);
    }
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listMasking = [];
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          listMasking.push(this.changePositionWhenRotateFrom0(this.rotateDegree[this.indexImage], false, this.maskings[this.indexImage][i]));
        }
        this.maskings[this.indexImage] = listMasking;
      }
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        this.drawRect(this.maskings[this.indexImage][i]);
      }
    }
  }

  /**
   *set value for rotateDegree when rotate left and rotate image
   *
   * @memberof ShoukenDetailComponent
   */
  rotateLeftImage() {
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listCircle0 = this.changePositionToRotate0(true, this.shapes[this.indexImage]);
        this.shapes[this.indexImage] = listCircle0;
      }
    }
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listMarsking0 = [];
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          listMarsking0.push(this.changePositionToRotate0(false, this.maskings[this.indexImage][i]));
        }
        this.maskings[this.indexImage] = listMarsking0;
      }
    }
    if (this.rotateDegree[this.indexImage] === 0) {
      this.rotateDegree[this.indexImage] = 360;
    }
    this.rotateDegree[this.indexImage] = this.rotateDegree[this.indexImage] - 90;
    this.changeWidthHeight();
    this.setSizeCanvas();
    this.rotateImage();
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listCircle = this.changePositionWhenRotateFrom0(this.rotateDegree[this.indexImage], true, this.shapes[this.indexImage]);
        this.shapes[this.indexImage] = listCircle;
      } else {
        const listCircle = this.changePositionToRotate0(true, this.shapes[this.indexImage]);
        this.shapes[this.indexImage] = listCircle;
      }
      this.mapDataBox(this.indexImage);
      this.reDrawMasking(1);
    }
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      if (this.rotateDegree[this.indexImage] !== 0) {
        const listMasking = [];
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          listMasking.push(this.changePositionWhenRotateFrom0(this.rotateDegree[this.indexImage], false, this.maskings[this.indexImage][i]));
        }
        this.maskings[this.indexImage] = listMasking;
      } else {
        const listMarsking0 = [];
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          listMarsking0.push(this.changePositionToRotate0(false, this.maskings[this.indexImage][i]));
        }
        this.maskings[this.indexImage] = listMarsking0;
      }
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        this.drawRect(this.maskings[this.indexImage][i]);
      }
    }
  }


  /**
   * rotate image with existed rotateDegree
   *
   * @memberof ShoukenDetailComponent
   */
  rotateImage(degree?: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    if (!degree) {
      this.context.rotate(this.rotateDegree[this.indexImage] * Math.PI / 180);
    } else {
      this.context.rotate(degree * Math.PI / 180);
    }
    this.context.drawImage(this.img, -this.widthImage / 2, -this.heightImage / 2, this.widthImage, this.heightImage);
    this.context.restore();
  }

  onResize(event: any) {
    // this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // if (this.beginWidth !== document.getElementById('image-editor-inner').clientWidth) {
    //   this.beginWidth = document.getElementById('image-editor-inner').clientWidth;
    //   if (this.beginWidth < 600) {
    //     this.enablePolygon = false;
    //     this.isCropDone = false;
    //     this.initImage();
    //     this.setSizeCanvas();
    //     this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    //     this.context.drawImage(this.img, 0, 0, this.widthImage, this.heightImage);
    //     for (let i = 0; i < this.src.length; i++) {
    //       this.shapes.push([]);
    //       this.maskings.push([]);
    //       // this.rotateDegree.push(0);
    //       // this.dataListImage.push({ vertex: [], mask: [], rotate: 0, index: 0 });
    //     }
    //   }
    // }
    // console.log('abc');
    this.heightBody = $(window).height() - 140;
  }

  /**
 * reset canvas and lag enable button when back to image
 *
 * @memberof ShoukenDetailComponent
 */
  backToImage() {
    this.imagesFirstLoad[this.indexImage] = true;
    if (this.enableRotate) {
      if ((!this.shapes[this.indexImage] || this.shapes[this.indexImage].length === 0) && (!this.maskings[this.indexImage] || this.maskings[this.indexImage].length === 0)) {
        if (this.rotateDegree[this.indexImage] !== 180 && this.rotateDegree[this.indexImage] !== 0) {
          this.changeWidthHeight();
        }
        this.rotateDegree[this.indexImage] = 0;
        this.setSizeCanvas();
        this.rotateImage();
        this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
        this.acceptRotate();
      } else {
        if (((this.rotateDegree[this.indexImage] - this.beginRotateDegreeBeforeRotate) / 90) % 2 !== 0) {
          this.changeWidthHeight();
        }
        this.rotateDegree[this.indexImage] = this.beginRotateDegreeBeforeRotate;
        this.shapes[this.indexImage] = this.beginShapesBeforeRotate;
        this.maskings[this.indexImage] = this.beginMaskingBeforeRotate;
        this.setSizeCanvas();
        this.rotateImage();
        if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
          this.mapDataBox(this.indexImage);
          this.reDrawMasking(1);
        }
        if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
          for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
            this.drawRect(this.maskings[this.indexImage][i]);
          }
        }
        this.acceptRotate();
      }
    }
    if (this.enableCrop) {
      this.shapes[this.indexImage] = [];
      this.setSizeCanvas();
      this.rotateImage();
      this.enableCrop = false;
      this.enableBackToImage = false;
      this.enableGoToRotate = true;
      this.enableGoToCrop = true;
      this.enableGoToMasking = true;
      this.enableBackToList = true;
      this.enableAccept = true;
      this.croped = false;
      if (this.maskings[this.indexImage].length > 0 && this.maskings[this.indexImage]) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          this.drawRect(this.maskings[this.indexImage][i]);
        }
      }
    }

    if (this.enableMasking) {
      this.setSizeCanvas();
      this.enableMasking = false;
      this.enableBackToImage = false;
      this.enableGoToRotate = true;
      this.enableGoToCrop = true;
      this.enableGoToMasking = true;
      this.enableBackToList = true;
      this.enableAccept = true;
      this.maskings[this.indexImage] = [];
      this.rotateImage();
      if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
        this.reDrawMasking(1);
      }
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          this.drawRect(this.maskings[this.indexImage][i]);
        }
      }
    }
  }
  /**
   * swap value of width and height when rotate image
   *
   * @memberof ShoukenDetailComponent
   */
  changeWidthHeight() {
    const temp = this.dynamicWidth;
    this.dynamicWidth = this.dynamicHeight;
    this.dynamicHeight = temp;
  }

  /**
    * draw rectangle
    *
    * @param {*} r
    * @memberof ShoukenDetailComponent
    */
  drawRect(r) {
    this.context.fillStyle = r.fill;
    this.context.fillRect(r.x, r.y, r.width, r.height);
  }

  /**
    * draw circle
    *
    * @param {*} c
    * @memberof ShoukenDetailComponent
    */
  drawCircle(c) {
    this.context.fillStyle = c.fill;
    this.context.beginPath();
    this.context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    this.context.closePath();
    this.context.fill();
  }

  draw() {
    this.rotateImage();
    if (!this.enableMasking && this.enableCrop && this.shapes[this.indexImage]) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        this.drawCircle(this.shapes[this.indexImage][i]);
      }
    } else {
      if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
        this.reDrawMasking(1);
      }
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          this.drawRect(this.maskings[this.indexImage][i]);
        }
      }
    }
  }

  convertMasking() {
    const beginMaskingList = this.dataMasking[this.indexImage];
    if (beginMaskingList) {
      for (let j = 0; j < beginMaskingList.length; j++) {
        const maskingPointList = beginMaskingList[j];
        if (maskingPointList.length >= 4) {
          this.maskings[this.indexImage].push(
            {
              x: (maskingPointList[0].x * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5,
              y: (maskingPointList[0].y * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5,
              width: ((maskingPointList[1].x - maskingPointList[0].x) * parseFloat(this.miniature[this.indexImage].toFixed(5))),
              height: ((maskingPointList[3].y - maskingPointList[0].y) * parseFloat(this.miniature[this.indexImage].toFixed(5))),
              fill: 'black',
              isDragging: false, enablePoint: false, dragTL: false, dragTR: false, dragBL: false, dragBR: false
            });
        }
      }
      if (this.dataRotate[this.indexImage] !== 0) {
        const listMasking = [];
        if (this.maskings[this.indexImage].length > 0 && this.maskings[this.indexImage]) {
          for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
            listMasking.push(this.changePositionWhenRotateFrom0(this.dataRotate[this.indexImage], false, this.maskings[this.indexImage][i]));
          }
        }
        this.maskings[this.indexImage] = listMasking;
      }
    }
  }

  initCircle() {
    const listPoint = [];
    for (let i = 0; i < this.firstListPoints[this.indexImage].length; i++) {
      const p = $.extend(true, {}, this.firstListPoints[this.indexImage][i]);
      p.x = (p.x * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5;
      p.y = (p.y * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5;
      listPoint.push(p);
    }
    const listpointDefault = [];
    for (let i = 0; i < this.listPointDefault[this.indexImage].length; i++) {
      const p = $.extend(true, {}, this.listPointDefault[this.indexImage][i]);
      p.x = (p.x * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5;
      p.y = (p.y * parseFloat(this.miniature[this.indexImage].toFixed(5))) + 5;
      listpointDefault.push(p);
    }
    let points = [];
    if (listPoint.length > 0) {
      points = listPoint;
    } else if (listPoint.length === 0 && this.enableCrop) {
      points = listpointDefault;
    }
    if (points.length > 0) {
      this.shapes[this.indexImage] = [];
      this.shapes[this.indexImage].push({ x: points[0].x, y: points[0].y, r: this.circle_r, fill: 'red', isDragging: false });
      this.shapes[this.indexImage].push({ x: points[1].x, y: points[1].y, r: this.circle_r, fill: 'red', isDragging: false });
      this.shapes[this.indexImage].push({ x: points[2].x, y: points[2].y, r: this.circle_r, fill: 'red', isDragging: false });
      this.shapes[this.indexImage].push({ x: points[3].x, y: points[3].y, r: this.circle_r, fill: 'red', isDragging: false });
    }
    if (this.rotateDegree[this.indexImage] !== 0) {
      const listCircle = this.changePositionWhenRotateFrom0(this.rotateDegree[this.indexImage], true, this.shapes[this.indexImage]);
      this.shapes[this.indexImage] = listCircle;
    }
  }

  reDrawFrame() {
    this.context.beginPath();
    this.context.moveTo(this.boxUpLeft.x, this.boxUpLeft.y);
    this.context.lineTo(this.boxUpRight.x, this.boxUpRight.y);
    this.context.lineTo(this.boxDownRight.x, this.boxDownRight.y);
    this.context.lineTo(this.boxDownLeft.x, this.boxDownLeft.y);
    this.context.lineTo(this.boxUpLeft.x, this.boxUpLeft.y);
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 1;
    this.context.stroke();
  }

  checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) < 15;
  }

  myUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragok = false;
    this.dragPointMasking = false;
    // if enableMasking = false , disable drag when mouse up or touch end
    if (!this.enableMasking && this.shapes[this.indexImage]) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        this.shapes[this.indexImage][i].isDragging = false;
      }
    } else {
      // if enableMasking = true, disable drag 4 point of rectangle when mouse up or touch end
      if (typeof this.maskings[this.indexImage] !== 'undefined' && this.maskings[this.indexImage].length > 0 && this.maskings[this.indexImage]) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          this.maskings[this.indexImage][i].dragTL = false;
          this.maskings[this.indexImage][i].dragTR = false;
          this.maskings[this.indexImage][i].dragBL = false;
          this.maskings[this.indexImage][i].dragBR = false;
          if (this.maskings[this.indexImage][i].enablePoint) {
            this.initPointMasking(this.maskings[this.indexImage][i]);
          }
          this.maskings[this.indexImage][i].isDragging = false;
        }
      }
    }
  }

  myDown(e) {
    let mx, my;
    if (this.isMobile) {
      // get position of hand in mobile
      mx = Math.round(e.touches[0].clientX - $('canvas#vnext-editor').offset().left + window.pageXOffset);
      my = Math.round(e.touches[0].clientY - $('canvas#vnext-editor').offset().top + window.pageYOffset);
    } else {
      mx = Math.round(e.clientX - $('canvas#vnext-editor').offset().left + window.pageXOffset);
      my = Math.round(e.clientY - $('canvas#vnext-editor').offset().top + window.pageYOffset);
    }

    this.dragok = false;
    this.dragPointMasking = false;
    if (typeof this.maskings[this.indexImage] !== 'undefined' && this.maskings[this.indexImage].length > 0 && this.maskings[this.indexImage]) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        const s = this.maskings[this.indexImage][i];
        s.enablePoint = false;
      }
    }
    if (!this.enableMasking && this.shapes[this.indexImage]) {
      // if enableMasking = false, can drag 4 point of polygon crop
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        const s = this.shapes[this.indexImage][i];
        const dx = s.x;
        const dy = s.y;
        let twoPointDistance = Math.sqrt(Math.pow((mx - dx), 2) + Math.pow((my - dy), 2));
        if (this.isMobile) { twoPointDistance -= 8; }
        // test if the mouse is inside this circle
        if (twoPointDistance <= (s.r + 15)) {
          this.dragok = true;
          s.isDragging = true;
        }
      }
    } else {
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        for (let i = this.maskings[this.indexImage].length - 1; i >= 0; i--) {
          const s = this.maskings[this.indexImage][i];
          // if enableMasking = true, can drag masking when mouse down in masking
          if (mx > s.x - 10 && mx < s.x + s.width + 10 && my > s.y - 10 && my < s.y + s.height + 10) {
            // change enablePoint = true, show 4 point of masking when mouse up
            s.enablePoint = true;
            this.dragok = true;
            this.maskingFocus = i;
            s.isDragging = true;
          } else {
            s.enablePoint = false;
            this.draw();
          }
          // check position of mouse close enough with point
          if (this.checkCloseEnough(mx, this.maskings[this.indexImage][i].x) && this.checkCloseEnough(my, this.maskings[this.indexImage][i].y)) {
            this.maskings[this.indexImage][i].dragTL = true;
          } else if (this.checkCloseEnough(mx, this.maskings[this.indexImage][i].x + this.maskings[this.indexImage][i].width)
            && this.checkCloseEnough(my, this.maskings[this.indexImage][i].y)) {
            this.maskings[this.indexImage][i].dragTR = true;
          } else if (this.checkCloseEnough(mx, this.maskings[this.indexImage][i].x)
            && this.checkCloseEnough(my, this.maskings[this.indexImage][i].y + this.maskings[this.indexImage][i].height)) {
            this.maskings[this.indexImage][i].dragBL = true;
          } else if (this.checkCloseEnough(mx, this.maskings[this.indexImage][i].x + this.maskings[this.indexImage][i].width)
            && this.checkCloseEnough(my, this.maskings[this.indexImage][i].y + this.maskings[this.indexImage][i].height)) {
            this.maskings[this.indexImage][i].dragBR = true;
          }
        }
      }
      for (let i = 0; i < this.pointMaskings.length; i++) {
        const s = this.pointMaskings[i];
        const dx = s.x;
        const dy = s.y;
        let twoPointDistance = Math.sqrt(Math.pow((mx - dx), 2) + Math.pow((my - dy), 2));
        if (this.isMobile) { twoPointDistance -= 8; }
        // test if the mouse is inside this circle
        if (twoPointDistance <= s.r) {
          // cannot drag masking, only drag point of masking
          this.dragok = false;
          this.dragPointMasking = true;
          s.isDragging = true;
        }
      }
    }
    this.startX = mx;
    this.startY = my;
  }

  /**
  *event when mouse move or touch move
  *
  * @param {*} e
  * @memberof ShoukenDetailComponent
  */
  myMove(e) {
    if ((this.dragok && this.enableCrop) || (this.dragok && this.enableMasking)) {
      e.preventDefault();
      e.stopPropagation();
      let mx, my;
      if (this.isMobile) {
        mx = Math.round(e.touches[0].clientX - $('canvas#vnext-editor').offset().left + window.scrollX);
        my = Math.round(e.touches[0].clientY - $('canvas#vnext-editor').offset().top + window.scrollY);
      } else {
        mx = Math.round(e.clientX - $('canvas#vnext-editor').offset().left + window.pageXOffset);
        my = Math.round(e.clientY - $('canvas#vnext-editor').offset().top + window.pageYOffset);
      }
      const dx = mx - this.startX;
      const dy = my - this.startY;
      if (!this.enableMasking) {
        this.changePositionShape(this.shapes[this.indexImage], dx, dy);
        this.draw();
        this.startX = mx;
        this.startY = my;
        this.mapDataBox(this.indexImage);
        this.reDrawFrame();
        this.reDrawMasking(0.7);
      } else {
        this.changePositionShape(this.maskings[this.indexImage], dx, dy);
        this.draw();
        this.startX = mx;
        this.startY = my;
      }
    }
    if (this.dragPointMasking) {
      e.preventDefault();
      e.stopPropagation();
      let mx, my;
      if (this.isMobile) {
        mx = Math.round(e.touches[0].clientX - $('canvas#vnext-editor').offset().left + window.scrollX);
        my = Math.round(e.touches[0].clientY - $('canvas#vnext-editor').offset().top + window.scrollY);
      } else {
        mx = Math.round(e.clientX - $('canvas#vnext-editor').offset().left + window.pageXOffset);
        my = Math.round(e.clientY - $('canvas#vnext-editor').offset().top + window.pageYOffset);
      }
      const dx = mx - this.startX;
      const dy = my - this.startY;
      let i;
      // check flag = true, get point moving
      if (this.maskings[this.indexImage][this.maskingFocus].dragTL) {
        i = 0;
      } else if (this.maskings[this.indexImage][this.maskingFocus].dragTR) {
        i = 1;
      } else if (this.maskings[this.indexImage][this.maskingFocus].dragBR) {
        i = 2;
      } else if (this.maskings[this.indexImage][this.maskingFocus].dragBL) {
        i = 3;
      }
      // set new value of point in masking
      const s = this.pointMaskings[i];
      if (s.isDragging) {
        s.x += dx;
        s.y += dy;
      }
      if (s.x >= this.canvas.width - 5) {
        s.x = this.canvas.width - 5;
        this.pointMaskings[i].isDragging = false;
      }
      if (s.x < 5) {
        s.x = 5;
        this.pointMaskings[i].isDragging = false;
      }
      if (s.y >= this.canvas.height - 5) {
        s.y = this.canvas.height - 5;
        this.pointMaskings[i].isDragging = false;
      }
      if (s.y < 5) {
        s.y = 5;
        this.pointMaskings[i].isDragging = false;
      }
      // set new value of x, y, height, width of rect
      if (i === 0) {
        const widthIcre = this.maskings[this.indexImage][this.maskingFocus].x - s.x;
        const heightIcre = this.maskings[this.indexImage][this.maskingFocus].y - s.y;
        this.maskings[this.indexImage][this.maskingFocus].x = s.x;
        this.maskings[this.indexImage][this.maskingFocus].y = s.y;
        this.maskings[this.indexImage][this.maskingFocus].width = this.maskings[this.indexImage][this.maskingFocus].width + widthIcre;
        this.maskings[this.indexImage][this.maskingFocus].height = this.maskings[this.indexImage][this.maskingFocus].height + heightIcre;
      }
      if (i === 1) {
        const widthIcre = s.x - this.maskings[this.indexImage][this.maskingFocus].x - this.maskings[this.indexImage][this.maskingFocus].width;
        const heightIcre = this.maskings[this.indexImage][this.maskingFocus].y - s.y;
        this.maskings[this.indexImage][this.maskingFocus].y = s.y;
        this.maskings[this.indexImage][this.maskingFocus].width = this.maskings[this.indexImage][this.maskingFocus].width + widthIcre;
        this.maskings[this.indexImage][this.maskingFocus].height = this.maskings[this.indexImage][this.maskingFocus].height + heightIcre;
      }
      if (i === 2) {
        const widthIcre = s.x - this.maskings[this.indexImage][this.maskingFocus].x - this.maskings[this.indexImage][this.maskingFocus].width;
        const heightIcre = s.y - this.maskings[this.indexImage][this.maskingFocus].y - this.maskings[this.indexImage][this.maskingFocus].height;
        this.maskings[this.indexImage][this.maskingFocus].width = this.maskings[this.indexImage][this.maskingFocus].width + widthIcre;
        this.maskings[this.indexImage][this.maskingFocus].height = this.maskings[this.indexImage][this.maskingFocus].height + heightIcre;
      }
      if (i === 3) {
        const widthIcre = this.maskings[this.indexImage][this.maskingFocus].x - s.x;
        const heightIcre = s.y - this.maskings[this.indexImage][this.maskingFocus].y - this.maskings[this.indexImage][this.maskingFocus].height;
        this.maskings[this.indexImage][this.maskingFocus].x = s.x;
        this.maskings[this.indexImage][this.maskingFocus].width = this.maskings[this.indexImage][this.maskingFocus].width + widthIcre;
        this.maskings[this.indexImage][this.maskingFocus].height = this.maskings[this.indexImage][this.maskingFocus].height + heightIcre;
      }
      this.draw();
      this.startX = mx;
      this.startY = my;
    }
  }

  changePositionShape(arrayShape: any, dx: number, dy: number) {
    for (let i = 0; i < arrayShape.length; i++) {
      const s = arrayShape[i];
      if (s.isDragging) {
        s.x += dx;
        s.y += dy;
      }
      if (s.r) {
        s.width = 0;
        s.height = 0;
      }
      if (s.x >= this.canvas.width - 5 - s.width) {
        s.x = this.canvas.width - 5 - s.width;
        // s.isDragging = false;
      }
      if (s.y >= this.canvas.height - 5 - s.height) {
        s.y = this.canvas.height - 5 - s.height;
        // s.isDragging = false;
      }
      if (s.x < 5) {
        s.x = 5;
        // s.isDragging = false;
      }
      if (s.y < 5) {
        s.y = 5;
        // s.isDragging = false;
      }
    }
  }

  mapDataBox(index) {
    if (this.shapes[index]) {
      this.boxUpLeft = this.shapes[index][0];
      this.boxUpRight = this.shapes[index][1];
      this.boxDownRight = this.shapes[index][2];
      this.boxDownLeft = this.shapes[index][3];
    }
  }

  /**
   * draw circle point of polygon
   *
   * @memberof ShoukenDetailComponent
   */
  drawCirclePolygon() {
    this.enablePolygon = true;
    this.isCropDone = false;
    if (!this.shapes[this.indexImage] || this.shapes[this.indexImage].length === 0) {
      this.initCircle();
    }
    this.draw();
    this.mapDataBox(this.indexImage);
    this.reDrawFrame();
    this.reDrawMasking(0.7);
  }

  initPointMasking(p: any) {
    this.pointMaskings = [];
    this.pointMaskings.push({ x: p.x, y: p.y, r: 3, fill: 'red', isDragging: false });
    this.pointMaskings.push({ x: p.x + p.width, y: p.y, r: 3, fill: 'red', isDragging: false });
    this.pointMaskings.push({ x: p.x + p.width, y: p.y + p.height, r: 3, fill: 'red', isDragging: false });
    this.pointMaskings.push({ x: p.x, y: p.y + p.height, r: 3, fill: 'red', isDragging: false });
    for (let i = 0; i < this.pointMaskings.length; i++) {
      this.drawCircle(this.pointMaskings[i]);
    }
  }

  initMasking() {
    this.maskings[this.indexImage].push({
      x: Math.round((this.canvas.width - 100) / 2), y: Math.round((this.canvas.height - 50) / 2), width: 100, height: 50, fill: 'black', isDragging: false, enablePoint: false,
      dragTL: false, dragTR: false, dragBL: false, dragBR: false
    });
    this.drawRect(this.maskings[this.indexImage][0]);
  }

  addMasking() {
    const lastIndex = this.maskings[this.indexImage].length - 1;
    if (this.maskings[this.indexImage][lastIndex].y + this.maskings[this.indexImage][lastIndex].height + 60 < this.canvas.height) {
      this.maskings[this.indexImage].push({
        x: this.maskings[this.indexImage][lastIndex].x,
        y: this.maskings[this.indexImage][lastIndex].y + this.maskings[this.indexImage][lastIndex].height + 10,
        width: this.maskings[this.indexImage][lastIndex].width, height: this.maskings[this.indexImage][lastIndex].height, fill: 'black', isDragging: false, enablePoint: false,
        dragTL: false, dragTR: false, dragBL: false, dragBR: false
      });
    } else {
      if (this.maskings[this.indexImage][lastIndex].x + this.maskings[this.indexImage][lastIndex].width + 110 < this.canvas.width) {
        this.maskings[this.indexImage].push({
          x: this.maskings[this.indexImage][lastIndex].x + this.maskings[this.indexImage][lastIndex].width + 10,
          y: this.maskings[this.indexImage][0].y,
          width: this.maskings[this.indexImage][lastIndex].width, height: this.maskings[this.indexImage][lastIndex].height, fill: 'black', isDragging: false, enablePoint: false,
          dragTL: false, dragTR: false, dragBL: false, dragBR: false
        });
      }
    }
    this.drawRect(this.maskings[this.indexImage][this.maskings[this.indexImage].length - 1]);
  }


  drawMasking() {
    if (this.maskings[this.indexImage].length === 0 || !this.maskings[this.indexImage]) {
      this.initMasking();
    } else {
      this.addMasking();
    }
  }

  removeMasking() {
    this.maskings[this.indexImage].pop();
    this.rotateImage();
    if (this.shapes[this.indexImage] && this.shapes[this.indexImage].length > 0) {
      this.mapDataBox(this.indexImage);
      this.reDrawMasking(1);
    }
    if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
      for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
        this.drawRect(this.maskings[this.indexImage][i]);
      }
    }
  }

  reDrawMasking(opacity: number) {
    this.context.globalAlpha = opacity;
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(this.boxUpLeft.x, this.boxUpLeft.y);
    this.context.lineTo(this.boxDownLeft.x, this.boxDownLeft.y);
    this.context.lineTo(0, this.canvas.height);
    if (opacity === 1) {
      this.context.strokeStyle = '#666';
      this.context.stroke();
    }
    this.context.fillStyle = '#666';
    this.context.fill();

    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(this.boxUpLeft.x, this.boxUpLeft.y);
    this.context.lineTo(this.boxUpRight.x, this.boxUpRight.y);
    this.context.lineTo(this.canvas.width, 0);
    if (opacity === 1) {
      this.context.strokeStyle = '#666';
      this.context.stroke();
    }
    this.context.fillStyle = '#666';
    this.context.fill();

    this.context.beginPath();
    this.context.moveTo(this.canvas.width, 0);
    this.context.lineTo(this.boxUpRight.x, this.boxUpRight.y);
    this.context.lineTo(this.boxDownRight.x, this.boxDownRight.y);
    this.context.lineTo(this.canvas.width, this.canvas.height);
    if (opacity === 1) {
      this.context.strokeStyle = '#666';
      this.context.stroke();
    }
    this.context.fillStyle = '#666';
    this.context.fill();

    this.context.beginPath();
    this.context.lineTo(this.canvas.width, this.canvas.height);
    this.context.lineTo(this.boxDownRight.x, this.boxDownRight.y);
    this.context.lineTo(this.boxDownLeft.x, this.boxDownLeft.y);
    this.context.lineTo(0, this.canvas.height);
    if (opacity === 1) {
      this.context.strokeStyle = '#666';
      this.context.stroke();
    }
    this.context.fillStyle = '#666';
    this.context.fill();
    this.context.globalAlpha = 1.0;
  }

  close() {
    this.editmode = true;
    this.enableButton = false;
    this.enableGoToRotate = false;
    this.enableGoToCrop = false;
    this.enableGoToMasking = false;
    this.enableBackToList = false;
    this.enableAccept = false;
    window[this.actionClose].componentFn();
  }

  saveAndClose() {
    this.resetZoom();
    this.imagesFirstLoad = [];
    for (let i = 0; i < this.src.length; i++) {
      this.imagesFirstLoad.push(true);
    }
    if (this.enableRotate) {
      this.enableRotate = false;
      this.enableBackToImage = false;
      this.enableGoToRotate = true;
      this.enableGoToCrop = true;
      this.enableGoToMasking = true;
      this.enableBackToList = true;
      this.enableAccept = true;
      this.rotate_done();
      // this.acceptEdit(this.indexImage, false, true);
      this.acceptEditAllImage(false, true);
    } else if (this.enableCrop) {
      this.croped = true;
      this.enableCrop = false;
      this.enableBackToImage = false;
      this.enableGoToRotate = true;
      this.enableGoToCrop = true;
      this.enableGoToMasking = true;
      this.enableBackToList = true;
      this.enableAccept = true;
      this.reDrawMasking(1);
      this.draw();
      // this.acceptEdit(this.indexImage, false, true);
      this.acceptEditAllImage(false, true);
    } else if (this.enableMasking) {
      if (this.maskings[this.indexImage] && this.maskings[this.indexImage].length > 0) {
        for (let i = 0; i < this.maskings[this.indexImage].length; i++) {
          const s = this.maskings[this.indexImage][i];
          s.enablePoint = false;
          this.draw();
        }
      }
      this.enableMasking = false;
      this.enableBackToImage = false;
      this.enableGoToRotate = true;
      this.enableGoToCrop = true;
      this.enableGoToMasking = true;
      this.enableBackToList = true;
      this.enableAccept = true;
      // this.acceptEdit(this.indexImage, false, true);
      this.acceptEditAllImage(false, true);
    } else {
      // this.acceptEdit(this.indexImage, false, true);
      this.acceptEditAllImage(false, true);
    }
    window[this.actionClose].componentFn();
    this.editmode = true;
  }

  acceptEditAllImage(isAcceptButton: boolean, isSaveAndClose?: boolean) {
    for (let i = 0; i < this.src.length; i++) {
      if (this.imagesFirstLoad[i]) {
        this.acceptEdit(i);
      } else {
        this.dataListImage[i].vertex = this.firstListPoints[i];
        this.dataListImage[i].mask = this.dataMasking[i];
        this.dataListImage[i].rotate = this.dataRotate[i];
      }
    }
    const editdata = this.dataListImage;
    if (isAcceptButton) {
      eval(this.actionAccept);
    }
    if (isSaveAndClose) {
      this.firstListPoints = [];
      this.dataMasking = [];
      this.dataRotate = [];
      this.dataListImage.forEach((dataImage) => {
        this.firstListPoints.push(dataImage.vertex);
        this.dataMasking.push(dataImage.mask);
        this.dataRotate.push(dataImage.rotate);
      });
      console.log('this.firstListPoints', this.firstListPoints);
      const dataSave = this.dataListImage;
      eval(this.actionSaveAndClose);
    }
  }

  acceptEdit(index: number) {
    const data = { vertex: [], mask: [], rotate: 0, index: 0 };
    if (this.shapes[index] && this.shapes[index].length > 0) {
      this.mapDataBox(index);
      if (this.dynamicWidth >= this.dynamicHeight) {
        this.upLeftX = this.boxUpLeft.x - 5;
        this.upLeftY = this.boxUpLeft.y - 5;
        this.upRightX = this.boxUpRight.x - 5;
        this.upRightY = this.boxUpRight.y - 5;
        this.downLeftX = this.boxDownLeft.x - 5;
        this.downLeftY = this.boxDownLeft.y - 5;
        this.downRightX = this.boxDownRight.x - 5;
        this.downRightY = this.boxDownRight.y - 5;
      }
      if (this.dynamicWidth < this.dynamicHeight) {
        this.upLeftX = this.boxUpLeft.x - 5;
        this.upLeftY = this.boxUpLeft.y - 5;
        this.upRightX = this.boxUpRight.x - 5;
        this.upRightY = this.boxUpRight.y - 5;
        this.downLeftX = this.boxDownLeft.x - 5;
        this.downLeftY = this.boxDownLeft.y - 5;
        this.downRightX = this.boxDownRight.x - 5;
        this.downRightY = this.boxDownRight.y - 5;
      }
      const dataVertex = this.setPosition(index, true, this.upLeftX, this.upLeftY, this.upRightX, this.upRightY,
        this.downLeftX, this.downLeftY, this.downRightX, this.downRightY);
      data.vertex = dataVertex;
      this.dataListImage[index].vertex = data.vertex;
    } else {
      if (this.realWidth[index] && this.realHeight[index]) {
        data.vertex.push({ x: 0, y: 0 });
        data.vertex.push({ x: this.realWidth[index], y: 0 });
        data.vertex.push({ x: this.realWidth[index], y: this.realHeight[index] });
        data.vertex.push({ x: 0, y: this.realHeight[index] });
        this.dataListImage[index].vertex = data.vertex;
      }
    }
    this.coordinatesMasking = [];
    for (let i = 0; i < this.maskings[index].length; i++) {
      const m = this.maskings[index][i];
      let upLeftX;
      let upLeftY;
      let upRightX;
      let upRightY;
      let downLeftX;
      let downLeftY;
      let downRightX;
      let downRightY;
      if (this.dynamicWidth >= this.dynamicHeight) {
        upLeftX = m.x - 5;
        upLeftY = m.y - 5;
        upRightX = m.x - 5 + m.width;
        upRightY = m.y - 5;
        downLeftX = m.x - 5;
        downLeftY = m.y - 5 + m.height;
        downRightX = m.x - 5 + m.width;
        downRightY = m.y - 5 + m.height;
      } else {
        upLeftX = m.x - 5;
        upLeftY = m.y - 5;
        upRightX = m.x - 5 + m.width;
        upRightY = m.y - 5;
        downLeftX = m.x - 5;
        downLeftY = m.y - 5 + m.height;
        downRightX = m.x - 5 + m.width;
        downRightY = m.y - 5 + m.height;
      }
      this.setPosition(index, false, upLeftX, upLeftY, upRightX, upRightY, downLeftX, downLeftY, downRightX, downRightY);
    }
    data.mask = this.coordinatesMasking;
    data.rotate = this.rotateDegree[index];
    data.index = index;
    this.dataListImage[index].mask = data.mask;
    this.dataListImage[index].rotate = data.rotate;
    this.dataListImage[index].index = data.index;
  }


  setPosition(index: number, isCrop: boolean, upLeftX, upLeftY, upRightX, upRightY, downLeftX, downLeftY, downRightX, downRightY) {
    let formData;
    if (this.rotateDegree[index] === 0) {
      formData = {
        rotate: this.rotateDegree[index],
        upLeft_x: Math.round(upLeftX / this.miniature[index]),
        upLeft_y: Math.round(upLeftY / this.miniature[index]),
        upRight_x: Math.round(upRightX / this.miniature[index]),
        upRight_y: Math.round(upRightY / this.miniature[index]),
        bottomLeft_x: Math.round(downLeftX / this.miniature[index]),
        bottomLeft_y: Math.round(downLeftY / this.miniature[index]),
        bottomRight_x: Math.round(downRightX / this.miniature[index]),
        bottomRight_y: Math.round(downRightY / this.miniature[index]),
      };
    }
    if (this.rotateDegree[index] === 90) {
      formData = {
        rotate: this.rotateDegree[index],
        upLeft_x: Math.round(upRightY / this.miniature[index]),
        upLeft_y: this.realHeight[index] - Math.round(upRightX / this.miniature[index]),
        upRight_x: Math.round(downRightY / this.miniature[index]),
        upRight_y: this.realHeight[index] - Math.round(downRightX / this.miniature[index]),
        bottomLeft_x: Math.round(upLeftY / this.miniature[index]),
        bottomLeft_y: this.realHeight[index] - Math.round(upLeftX / this.miniature[index]),
        bottomRight_x: Math.round(downLeftY / this.miniature[index]),
        bottomRight_y: this.realHeight[index] - Math.round(downLeftX / this.miniature[index]),
      };
    }
    if (this.rotateDegree[index] === 180) {
      formData = {
        rotate: this.rotateDegree[index],
        upLeft_x: this.realWidth[index] - Math.round(downRightX / this.miniature[index]),
        upLeft_y: this.realHeight[index] - Math.round(downRightY / this.miniature[index]),
        upRight_x: this.realWidth[index] - Math.round(downLeftX / this.miniature[index]),
        upRight_y: this.realHeight[index] - Math.round(downLeftY / this.miniature[index]),
        bottomLeft_x: this.realWidth[index] - Math.round(upRightX / this.miniature[index]),
        bottomLeft_y: this.realHeight[index] - Math.round(upRightY / this.miniature[index]),
        bottomRight_x: this.realWidth[index] - Math.round(upLeftX / this.miniature[index]),
        bottomRight_y: this.realHeight[index] - Math.round(upLeftY / this.miniature[index]),
      };
    }
    if (this.rotateDegree[index] === 270) {
      formData = {
        rotate: this.rotateDegree[index],
        upLeft_x: this.realWidth[index] - Math.round(downLeftY / this.miniature[index]),
        upLeft_y: Math.round(downLeftX / this.miniature[index]),
        upRight_x: this.realWidth[index] - Math.round(upLeftY / this.miniature[index]),
        upRight_y: Math.round(upLeftX / this.miniature[index]),
        bottomLeft_x: this.realWidth[index] - Math.round(downRightY / this.miniature[index]),
        bottomLeft_y: Math.round(downRightX / this.miniature[index]),
        bottomRight_x: this.realWidth[index] - Math.round(upRightY / this.miniature[index]),
        bottomRight_y: Math.round(upRightX / this.miniature[index]),
      };
    }
    const data = [{ x: formData.upLeft_x, y: formData.upLeft_y },
    { x: formData.upRight_x, y: formData.upRight_y },
    { x: formData.bottomRight_x, y: formData.bottomRight_y },
    { x: formData.bottomLeft_x, y: formData.bottomLeft_y }];
    if (isCrop) {
      return data;
    } else {
      this.coordinatesMasking.push(data);
    }
  }

  disableDrag() {
    this.dragok = false;
    if (this.shapes[this.indexImage]) {
      for (let i = 0; i < this.shapes[this.indexImage].length; i++) {
        this.shapes[this.indexImage][i].isDragging = false;
      }
    }
  }

  changePositionWhenRotateFrom0(rotatedegree: number, isCircle: boolean, shapes: any) {
    if (isCircle) {
      if (shapes && shapes.length > 0) {
        const shapesRotate = [];
        if (rotatedegree === 90) {
          shapesRotate.push({
            x: this.canvas.width - shapes[3].y,
            y: shapes[3].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[0].y,
            y: shapes[0].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[1].y,
            y: shapes[1].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[2].y,
            y: shapes[2].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          return shapesRotate;
        }
        if (rotatedegree === 270) {
          shapesRotate.push({
            x: shapes[1].y,
            y: this.canvas.height - shapes[1].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: shapes[2].y,
            y: this.canvas.height - shapes[2].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: shapes[3].y,
            y: this.canvas.height - shapes[3].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: shapes[0].y,
            y: this.canvas.height - shapes[0].x,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          return shapesRotate;
        }

        if (rotatedegree === 180) {
          shapesRotate.push({
            x: this.canvas.width - shapes[2].x,
            y: this.canvas.height - shapes[2].y,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[3].x,
            y: this.canvas.height - shapes[3].y,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[0].x,
            y: this.canvas.height - shapes[0].y,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          shapesRotate.push({
            x: this.canvas.width - shapes[1].x,
            y: this.canvas.height - shapes[1].y,
            r: this.circle_r,
            fill: 'red', isDragging: false
          });
          return shapesRotate;
        }
      }
    } else {
      if (shapes) {
        if (rotatedegree === 90) {
          let shapesRotate;
          shapesRotate = {
            x: this.canvas.width - shapes.y - shapes.height,
            y: shapes.x,
            width: shapes.height, height: shapes.width, fill: 'black', isDragging: false, enablePoint: false,
            dragTL: false, dragTR: false, dragBL: false, dragBR: false
          };
          return shapesRotate;
        }
        if (rotatedegree === 270) {
          let shapesRotate;
          shapesRotate = {
            x: shapes.y,
            y: this.canvas.height - shapes.x - shapes.width,
            width: shapes.height, height: shapes.width, fill: 'black', isDragging: false, enablePoint: false,
            dragTL: false, dragTR: false, dragBL: false, dragBR: false
          };
          return shapesRotate;
        }
        if (rotatedegree === 180) {
          let shapesRotate;
          shapesRotate = {
            x: this.canvas.width - shapes.x - shapes.width,
            y: this.canvas.height - shapes.y - shapes.height,
            width: shapes.width, height: shapes.height, fill: 'black', isDragging: false, enablePoint: false,
            dragTL: false, dragTR: false, dragBL: false, dragBR: false
          };
          return shapesRotate;
        }
      }
    }

  }

  changePositionToRotate0(isCircle: boolean, shapes: any) {
    if (isCircle) {
      const shapesRotate = [];
      if (this.rotateDegree[this.indexImage] === 0) {
        shapesRotate.push({
          x: shapes[0].x,
          y: shapes[0].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[1].x,
          y: shapes[1].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[2].x,
          y: shapes[2].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[3].x,
          y: shapes[3].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        return shapesRotate;
      }
      if (this.rotateDegree[this.indexImage] === 90) {
        shapesRotate.push({
          x: shapes[1].y,
          y: this.canvas.width - shapes[1].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[2].y,
          y: this.canvas.width - shapes[2].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[3].y,
          y: this.canvas.width - shapes[3].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: shapes[0].y,
          y: this.canvas.width - shapes[0].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        return shapesRotate;
      }
      if (this.rotateDegree[this.indexImage] === 270) {
        shapesRotate.push({
          x: this.canvas.height - shapes[3].y,
          y: shapes[3].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.height - shapes[0].y,
          y: shapes[0].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.height - shapes[1].y,
          y: shapes[1].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.height - shapes[2].y,
          y: shapes[2].x,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        return shapesRotate;
      }

      if (this.rotateDegree[this.indexImage] === 180) {
        shapesRotate.push({
          x: this.canvas.width - shapes[2].x,
          y: this.canvas.height - shapes[2].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.width - shapes[3].x,
          y: this.canvas.height - shapes[3].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.width - shapes[0].x,
          y: this.canvas.height - shapes[0].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        shapesRotate.push({
          x: this.canvas.width - shapes[1].x,
          y: this.canvas.height - shapes[1].y,
          r: this.circle_r,
          fill: 'red', isDragging: false
        });
        return shapesRotate;
      }
    } else {
      if (this.rotateDegree[this.indexImage] === 0) {
        let shapesRotate;
        shapesRotate = {
          x: shapes.x,
          y: shapes.y,
          width: shapes.width, height: shapes.height, fill: 'black', isDragging: false, enablePoint: false,
          dragTL: false, dragTR: false, dragBL: false, dragBR: false
        };
        return shapesRotate;
      }
      if (this.rotateDegree[this.indexImage] === 90) {
        let shapesRotate;
        shapesRotate = {
          x: shapes.y,
          y: this.canvas.width - shapes.x - shapes.width,
          width: shapes.height, height: shapes.width, fill: 'black', isDragging: false, enablePoint: false,
          dragTL: false, dragTR: false, dragBL: false, dragBR: false
        };
        return shapesRotate;
      }
      if (this.rotateDegree[this.indexImage] === 270) {
        let shapesRotate;
        shapesRotate = {
          x: this.canvas.height - shapes.y - shapes.height,
          y: shapes.x,
          width: shapes.height, height: shapes.width, fill: 'black', isDragging: false, enablePoint: false,
          dragTL: false, dragTR: false, dragBL: false, dragBR: false
        };
        return shapesRotate;
      }
      if (this.rotateDegree[this.indexImage] === 180) {
        let shapesRotate;
        shapesRotate = {
          x: this.canvas.width - shapes.x - shapes.width,
          y: this.canvas.height - shapes.y - shapes.height,
          width: shapes.width, height: shapes.height, fill: 'black', isDragging: false, enablePoint: false,
          dragTL: false, dragTR: false, dragBL: false, dragBR: false
        };
        return shapesRotate;
      }
    }

  }

}

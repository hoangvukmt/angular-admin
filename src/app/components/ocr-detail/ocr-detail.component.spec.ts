import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrDetailComponent } from './ocr-detail.component';

describe('OcrDetailComponent', () => {
  let component: OcrDetailComponent;
  let fixture: ComponentFixture<OcrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

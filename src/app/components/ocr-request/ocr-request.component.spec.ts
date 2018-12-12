import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OCRRequestComponent } from './ocr-request.component';

describe('OCRRequestComponent', () => {
  let component: OCRRequestComponent;
  let fixture: ComponentFixture<OCRRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OCRRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OCRRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

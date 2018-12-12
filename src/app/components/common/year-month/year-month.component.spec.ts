import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearMonthComponent } from './year-month.component';

describe('YearMonthComponent', () => {
  let component: YearMonthComponent;
  let fixture: ComponentFixture<YearMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

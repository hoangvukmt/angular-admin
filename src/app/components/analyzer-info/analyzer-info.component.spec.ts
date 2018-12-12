import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzerInfoComponent } from './analyzer-info.component';

describe('AnalyzerInfoComponent', () => {
  let component: AnalyzerInfoComponent;
  let fixture: ComponentFixture<AnalyzerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

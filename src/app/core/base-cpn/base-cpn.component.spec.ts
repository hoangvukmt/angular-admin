import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCpnComponent } from './base-cpn.component';

describe('BaseCpnComponent', () => {
  let component: BaseCpnComponent;
  let fixture: ComponentFixture<BaseCpnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseCpnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemCommonComponent } from './select-item-common.component';

describe('SelectItemCommonComponent', () => {
  let component: SelectItemCommonComponent;
  let fixture: ComponentFixture<SelectItemCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectItemCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectItemCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

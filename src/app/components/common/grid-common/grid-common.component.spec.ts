import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCommonComponent } from './grid-common.component';

describe('GridCommonComponent', () => {
  let component: GridCommonComponent;
  let fixture: ComponentFixture<GridCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

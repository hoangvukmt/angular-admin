import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFamilyComponent } from './products-family.component';

describe('ProductsFamilyComponent', () => {
  let component: ProductsFamilyComponent;
  let fixture: ComponentFixture<ProductsFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

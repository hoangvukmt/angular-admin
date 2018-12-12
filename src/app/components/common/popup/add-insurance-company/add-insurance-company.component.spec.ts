import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsuranceCompanyComponent } from './add-insurance-company.component';

describe('AddInsuranceCompanyComponent', () => {
  let component: AddInsuranceCompanyComponent;
  let fixture: ComponentFixture<AddInsuranceCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsuranceCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

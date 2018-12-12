import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeiyakuFieldComponent } from './keiyaku-field.component';

describe('KeiyakuFieldComponent', () => {
  let component: KeiyakuFieldComponent;
  let fixture: ComponentFixture<KeiyakuFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeiyakuFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeiyakuFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

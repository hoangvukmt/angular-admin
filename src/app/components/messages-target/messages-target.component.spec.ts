import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTargetComponent } from './messages-target.component';

describe('MessagesTargetComponent', () => {
  let component: MessagesTargetComponent;
  let fixture: ComponentFixture<MessagesTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

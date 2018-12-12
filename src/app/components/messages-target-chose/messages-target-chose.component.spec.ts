import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTargetChoseComponent } from './messages-target-chose.component';

describe('MessagesTargetChoseComponent', () => {
  let component: MessagesTargetChoseComponent;
  let fixture: ComponentFixture<MessagesTargetChoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesTargetChoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesTargetChoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

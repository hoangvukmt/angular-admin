import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesTargetDetailComponent } from './messages-target-detail.component';

describe('MessagesTargetDetailComponent', () => {
  let component: MessagesTargetDetailComponent;
  let fixture: ComponentFixture<MessagesTargetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesTargetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesTargetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

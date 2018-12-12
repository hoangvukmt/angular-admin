import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesAwaitComponent } from './messages-await.component';

describe('MessagesAwaitComponent', () => {
  let component: MessagesAwaitComponent;
  let fixture: ComponentFixture<MessagesAwaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesAwaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesAwaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

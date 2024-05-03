import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackResponsesComponent } from './feedback-responses.component';

describe('FeedbackResponsesComponent', () => {
  let component: FeedbackResponsesComponent;
  let fixture: ComponentFixture<FeedbackResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

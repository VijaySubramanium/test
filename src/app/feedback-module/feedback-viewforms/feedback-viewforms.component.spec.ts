import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackViewformsComponent } from './feedback-viewforms.component';

describe('FeedbackViewformsComponent', () => {
  let component: FeedbackViewformsComponent;
  let fixture: ComponentFixture<FeedbackViewformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackViewformsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackViewformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

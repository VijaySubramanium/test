import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackModuleComponent } from './feedback-module.component';

describe('FeedbackModuleComponent', () => {
  let component: FeedbackModuleComponent;
  let fixture: ComponentFixture<FeedbackModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

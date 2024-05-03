import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDownloadComponent } from './feedback-download.component';

describe('FeedbackDownloadComponent', () => {
  let component: FeedbackDownloadComponent;
  let fixture: ComponentFixture<FeedbackDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

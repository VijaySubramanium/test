import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AveragefeedbackDashboardComponent } from './averagefeedback-dashboard.component';

describe('AveragefeedbackDashboardComponent', () => {
  let component: AveragefeedbackDashboardComponent;
  let fixture: ComponentFixture<AveragefeedbackDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AveragefeedbackDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AveragefeedbackDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

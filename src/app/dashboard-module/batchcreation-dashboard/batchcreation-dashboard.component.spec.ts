import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchcreationDashboardComponent } from './batchcreation-dashboard.component';

describe('BatchcreationDashboardComponent', () => {
  let component: BatchcreationDashboardComponent;
  let fixture: ComponentFixture<BatchcreationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchcreationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchcreationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

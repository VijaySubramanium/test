import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTrainerComponent } from './attendance-trainer.component';

describe('AttendanceTrainerComponent', () => {
  let component: AttendanceTrainerComponent;
  let fixture: ComponentFixture<AttendanceTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceTrainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

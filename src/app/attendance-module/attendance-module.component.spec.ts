import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceModuleComponent } from './attendance-module.component';

describe('AttendanceModuleComponent', () => {
  let component: AttendanceModuleComponent;
  let fixture: ComponentFixture<AttendanceModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

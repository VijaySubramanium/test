import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassroomComponent } from './course-classroom.component';

describe('CourseClassroomComponent', () => {
  let component: CourseClassroomComponent;
  let fixture: ComponentFixture<CourseClassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseClassroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

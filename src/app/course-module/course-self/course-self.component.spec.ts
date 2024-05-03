import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSelfComponent } from './course-self.component';

describe('CourseSelfComponent', () => {
  let component: CourseSelfComponent;
  let fixture: ComponentFixture<CourseSelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSelfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

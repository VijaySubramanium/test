import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStuProComponent } from './edit-stu-pro.component';

describe('EditStuProComponent', () => {
  let component: EditStuProComponent;
  let fixture: ComponentFixture<EditStuProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStuProComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStuProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

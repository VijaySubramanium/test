import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegescreenComponent } from './collegescreen.component';

describe('CollegescreenComponent', () => {
  let component: CollegescreenComponent;
  let fixture: ComponentFixture<CollegescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegescreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

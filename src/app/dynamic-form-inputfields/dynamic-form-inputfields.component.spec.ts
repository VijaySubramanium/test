import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormInputfieldsComponent } from './dynamic-form-inputfields.component';

describe('DynamicFormInputfieldsComponent', () => {
  let component: DynamicFormInputfieldsComponent;
  let fixture: ComponentFixture<DynamicFormInputfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormInputfieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormInputfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

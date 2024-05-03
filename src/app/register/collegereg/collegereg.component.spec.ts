import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeregComponent } from './collegereg.component';

describe('CollegeregComponent', () => {
  let component: CollegeregComponent;
  let fixture: ComponentFixture<CollegeregComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeregComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

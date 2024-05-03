import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentVerificationComponent } from './admin-document-verification.component';

describe('AdminDocumentVerificationComponent', () => {
  let component: AdminDocumentVerificationComponent;
  let fixture: ComponentFixture<AdminDocumentVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDocumentVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocumentVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

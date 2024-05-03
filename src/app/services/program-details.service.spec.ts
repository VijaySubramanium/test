import { TestBed } from '@angular/core/testing';

import { ProgramDetailsService } from './program-details.service';

describe('ProgramDetailsService', () => {
  let service: ProgramDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

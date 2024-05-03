import { TestBed } from '@angular/core/testing';

import { BatchDetailsService } from './batch-details.service';

describe('BatchDetailsService', () => {
  let service: BatchDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

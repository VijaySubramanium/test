import { TestBed } from '@angular/core/testing';
import { ProfessionalService } from "./professional.service";

describe("ProfessionalService", () => {
  let service: ProfessionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessionalService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(service).toBeTruthy();
    });
  });
});

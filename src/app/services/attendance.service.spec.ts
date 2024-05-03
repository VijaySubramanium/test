import { TestBed } from '@angular/core/testing';
import { AttendanceService } from "./attendance.service";

describe("AttendanceService", () => {
  let service: AttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(service).toBeTruthy();
    });
  });
});

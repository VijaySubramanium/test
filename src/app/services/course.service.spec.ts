import { TestBed } from '@angular/core/testing';
import { CourseService } from "./course.service";

describe("CourseService", () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(service).toBeTruthy();
    });
  });
});

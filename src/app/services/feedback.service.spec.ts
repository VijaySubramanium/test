import { TestBed } from '@angular/core/testing';
import { FeedbackService } from "./feedback.service";

describe("FeedbackService", () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(service).toBeTruthy();
    });
  });
});

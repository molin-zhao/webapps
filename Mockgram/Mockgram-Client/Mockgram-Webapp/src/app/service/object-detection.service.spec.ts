import { TestBed } from '@angular/core/testing';

import { ObjectDetectionService } from './object-detection.service';

describe('ObjectDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectDetectionService = TestBed.get(ObjectDetectionService);
    expect(service).toBeTruthy();
  });
});

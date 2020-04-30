import { TestBed } from '@angular/core/testing';

import { HygieneService } from './hygiene.service';

describe('HygieneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HygieneService = TestBed.get(HygieneService);
    expect(service).toBeTruthy();
  });
});

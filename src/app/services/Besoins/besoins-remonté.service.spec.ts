import { TestBed } from '@angular/core/testing';

import { BesoinsRemontéService } from './besoins-remonté.service';

describe('BesoinsRemontéService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BesoinsRemontéService = TestBed.get(BesoinsRemontéService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { VetementsService } from './vetements.service';

describe('VetementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VetementsService = TestBed.get(VetementsService);
    expect(service).toBeTruthy();
  });
});

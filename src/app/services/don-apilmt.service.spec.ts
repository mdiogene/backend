import { TestBed } from '@angular/core/testing';

import { DonApilmtService } from './don-apilmt.service';

describe('DonApilmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DonApilmtService = TestBed.get(DonApilmtService);
    expect(service).toBeTruthy();
  });
});

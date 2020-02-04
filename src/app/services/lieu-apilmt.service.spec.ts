import { TestBed } from '@angular/core/testing';

import { LieuApilmtService } from './lieu-apilmt.service';

describe('LieuApilmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LieuApilmtService = TestBed.get(LieuApilmtService);
    expect(service).toBeTruthy();
  });
});

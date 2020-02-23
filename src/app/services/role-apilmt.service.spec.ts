import { TestBed } from '@angular/core/testing';

import { RoleApilmtService } from './role-apilmt.service';

describe('RoleApilmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleApilmtService = TestBed.get(RoleApilmtService);
    expect(service).toBeTruthy();
  });
});

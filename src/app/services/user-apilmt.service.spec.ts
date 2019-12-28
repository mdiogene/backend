import { TestBed } from '@angular/core/testing';

import { UserAPILMTService } from './user-apilmt.service';

describe('UserAPILMTService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAPILMTService = TestBed.get(UserAPILMTService);
    expect(service).toBeTruthy();
  });
});

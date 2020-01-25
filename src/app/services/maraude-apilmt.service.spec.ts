import { TestBed } from '@angular/core/testing';

import { MaraudeApilmtService } from './maraude-apilmt.service';

describe('MaraudeApilmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaraudeApilmtService = TestBed.get(MaraudeApilmtService);
    expect(service).toBeTruthy();
  });
});

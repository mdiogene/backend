import { TestBed } from '@angular/core/testing';

import { TypeBesoinsService } from './type-besoins.service';

describe('TypeBesoinsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeBesoinsService = TestBed.get(TypeBesoinsService);
    expect(service).toBeTruthy();
  });
});

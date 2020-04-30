import { TestBed } from '@angular/core/testing';

import { AlimentaireService } from './alimentaire.service';

describe('AlimentaireService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlimentaireService = TestBed.get(AlimentaireService);
    expect(service).toBeTruthy();
  });
});

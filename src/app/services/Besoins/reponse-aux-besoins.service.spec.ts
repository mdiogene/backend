import { TestBed } from '@angular/core/testing';

import { ReponseAuxBesoinsService } from './reponse-aux-besoins.service';

describe('ReponseAuxBesoinsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReponseAuxBesoinsService = TestBed.get(ReponseAuxBesoinsService);
    expect(service).toBeTruthy();
  });
});

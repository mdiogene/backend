import { TestBed } from '@angular/core/testing';

import { MaraudeUsersService } from './maraude-users.service';

describe('MaraudeUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaraudeUsersService = TestBed.get(MaraudeUsersService);
    expect(service).toBeTruthy();
  });
});

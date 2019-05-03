import { TestBed, async, inject } from '@angular/core/testing';

import { MainMenuGuard } from './main-menu.guard';

describe('MainMenuGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainMenuGuard]
    });
  });

  it('should ...', inject([MainMenuGuard], (guard: MainMenuGuard) => {
    expect(guard).toBeTruthy();
  }));
});

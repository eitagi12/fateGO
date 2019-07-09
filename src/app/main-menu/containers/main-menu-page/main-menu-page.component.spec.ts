import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MainMenuPageComponent } from './main-menu-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';

describe('MainMenuPageComponent', () => {
  let component: MainMenuPageComponent;
  let fixture: ComponentFixture<MainMenuPageComponent>;
  const mockTokenService: any = {
    provide: TokenService,
    useValue: {
      getUser: () => {
        return { locationCode: '' };
      }
    }
  };

  setupTestBed({
    imports: [
      RouterTestingModule
    ],
    declarations: [
      MainMenuPageComponent
    ],
    providers: [
      mockTokenService,
      LocalStorageService
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

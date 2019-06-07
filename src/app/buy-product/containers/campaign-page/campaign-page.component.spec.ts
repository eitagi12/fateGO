import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignPageComponent } from './campaign-page.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TokenService } from 'mychannel-shared-libs';

@Pipe({name: 'privilegeToTradeSlider'})
class MockPrivilegeToTradeSlider implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('CampaignPageComponent', () => {
  let component: CampaignPageComponent;
  let fixture: ComponentFixture<CampaignPageComponent>;
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
      RouterTestingModule,
      ReactiveFormsModule,
      HttpClientModule,
      ModalModule.forRoot()
    ],
    providers: [
      LocalStorageService,
      mockTokenService
    ],
    declarations: [
      CampaignPageComponent,
      MockPrivilegeToTradeSlider
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

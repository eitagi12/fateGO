import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpNetworkTypePageComponent } from './order-mnp-network-type-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';

describe('OrderMnpCheckNetworkTypePageComponent', () => {
  let component: OrderMnpNetworkTypePageComponent;
  let fixture: ComponentFixture<OrderMnpNetworkTypePageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, ReactiveFormsModule, HttpClientModule ],
    declarations: [OrderMnpNetworkTypePageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpNetworkTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

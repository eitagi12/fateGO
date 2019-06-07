import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSelectReasonPageComponent } from './order-mnp-select-reason-page.component';
import { Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}
describe('OrderMnpSelectReasonPageComponent', () => {
  let component: OrderMnpSelectReasonPageComponent;
  let fixture: ComponentFixture<OrderMnpSelectReasonPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, ReactiveFormsModule, HttpClientModule],
    declarations: [OrderMnpSelectReasonPageComponent, MockMobileNoPipe],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              channelType: ''
            };
          })
        }
      },
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpSelectReasonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

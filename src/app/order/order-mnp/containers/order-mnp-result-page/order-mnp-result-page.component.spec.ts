import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpResultPageComponent } from './order-mnp-result-page.component';
import { Pipe, PipeTransform } from '@angular/core';
import { TokenService } from 'mychannel-shared-libs';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}
describe('OrderMnpResultPageComponent', () => {
  let component: OrderMnpResultPageComponent;
  let fixture: ComponentFixture<OrderMnpResultPageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule ],
    declarations: [
      OrderMnpResultPageComponent,
      MockMobileNoPipe
    ],
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
    fixture = TestBed.createComponent(OrderMnpResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

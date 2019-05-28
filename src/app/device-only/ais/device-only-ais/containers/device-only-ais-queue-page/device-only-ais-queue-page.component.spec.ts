import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform  } from '@angular/core';
import { DeviceOnlyAisQueuePageComponent } from './device-only-ais-queue-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('DeviceOnlyAisQueuePageComponent', () => {
  let component: DeviceOnlyAisQueuePageComponent;

  const router: any = {
    navigate: jest.fn()
  };
  const transactionService: any = {
    load: jest.fn()
  };
  const homeService: any = {};
  const homeButtonService: any = {};
  const priceOptionService: any = {
    load: jest.fn()
  };
  const createOrderService: any = {};
  const queueService: any = {};
  const pageLoadingService: any = {
    load: jest.fn()
  };
  const fb: any = {};
  const alertService: any = {};
  const sharedTransactionService: any = {};
  const tokenService: any = {
      getUser: jest.fn()
  };

  beforeEach(() => {
    component = new DeviceOnlyAisQueuePageComponent(
      router,
      transactionService,
      homeService,
      homeButtonService,
      priceOptionService,
      createOrderService,
      queueService,
      pageLoadingService,
      fb,
      alertService,
      sharedTransactionService,
      tokenService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

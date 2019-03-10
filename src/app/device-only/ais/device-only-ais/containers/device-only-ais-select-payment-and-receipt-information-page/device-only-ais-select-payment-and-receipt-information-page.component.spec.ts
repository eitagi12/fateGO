import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './device-only-ais-select-payment-and-receipt-information-page.component';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({name: 'translate'})
class MockPipe implements PipeTransform {
    transform(value: number): number {
        return value;
    }
}

describe('DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent', () => {
  let component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent,
        MockPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

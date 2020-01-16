import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainValidateCustomerIdCardPageComponent } from './omni-block-chain-validate-customer-id-card-page.component';

describe('OmniBlockChainValidateCustomerIdCardPageComponent', () => {
  let component: OmniBlockChainValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OmniBlockChainValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

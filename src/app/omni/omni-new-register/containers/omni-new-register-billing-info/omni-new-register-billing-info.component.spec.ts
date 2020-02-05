import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterBillingInfoComponent } from './omni-new-register-billing-info.component';

describe('BillingInfoComponent', () => {
  let component: OmniNewRegisterBillingInfoComponent;
  let fixture: ComponentFixture<OmniNewRegisterBillingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniNewRegisterBillingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterBillingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

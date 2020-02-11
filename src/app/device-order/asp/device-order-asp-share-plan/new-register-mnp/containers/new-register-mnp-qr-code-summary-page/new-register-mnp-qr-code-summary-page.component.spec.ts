import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpQrCodeSummaryPageComponent } from './new-register-mnp-qr-code-summary-page.component';

describe('NewRegisterMnpQrCodeSummaryPageComponent', () => {
  let component: NewRegisterMnpQrCodeSummaryPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpQrCodeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpQrCodeSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpQrCodeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

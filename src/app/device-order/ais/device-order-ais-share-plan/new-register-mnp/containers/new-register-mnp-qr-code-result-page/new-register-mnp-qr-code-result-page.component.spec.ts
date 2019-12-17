import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpQrCodeResultPageComponent } from './new-register-mnp-qr-code-result-page.component';

describe('NewRegisterMnpQrCodeResultPageComponent', () => {
  let component: NewRegisterMnpQrCodeResultPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpQrCodeResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpQrCodeResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpQrCodeResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

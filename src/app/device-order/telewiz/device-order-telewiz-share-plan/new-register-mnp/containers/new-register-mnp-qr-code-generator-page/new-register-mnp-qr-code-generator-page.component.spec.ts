import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpQrCodeGeneratorPageComponent } from './new-register-mnp-qr-code-generator-page.component';

describe('NewRegisterMnpQrCodeGeneratorPageComponent', () => {
  let component: NewRegisterMnpQrCodeGeneratorPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpQrCodeGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpQrCodeGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpQrCodeGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

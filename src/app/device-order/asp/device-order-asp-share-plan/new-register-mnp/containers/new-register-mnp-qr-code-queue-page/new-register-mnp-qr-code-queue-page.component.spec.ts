import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpQrCodeQueuePageComponent } from './new-register-mnp-qr-code-queue-page.component';

describe('NewRegisterMnpQrCodeQueuePageComponent', () => {
  let component: NewRegisterMnpQrCodeQueuePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

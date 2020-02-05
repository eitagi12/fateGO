import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterFaceCapturePageComponent } from './omni-new-register-face-capture-page.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('OmniNewRegisterFaceCapturePageComponent', () => {
  let component: OmniNewRegisterFaceCapturePageComponent;
  let fixture: ComponentFixture<OmniNewRegisterFaceCapturePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [ OmniNewRegisterFaceCapturePageComponent ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

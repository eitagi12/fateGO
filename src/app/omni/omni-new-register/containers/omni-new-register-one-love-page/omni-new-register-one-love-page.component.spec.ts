import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterOneLovePageComponent } from './omni-new-register-one-love-page.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('OmniNewRegisterOneLovePageComponent', () => {
  let component: OmniNewRegisterOneLovePageComponent;
  let fixture: ComponentFixture<OmniNewRegisterOneLovePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [ OmniNewRegisterOneLovePageComponent ]
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

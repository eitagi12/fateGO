import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OmniNewRegisterEcontactPageComponent } from './omni-new-register-econtact-page.component';

describe('OmniNewRegisterEcontactPageComponent', () => {
  let component: OmniNewRegisterEcontactPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterEcontactPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniNewRegisterEcontactPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterEcontactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

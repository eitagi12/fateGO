import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OmniNewRegisterPersoSimPageComponent } from './omni-new-register-perso-sim-new-page.component';

describe('OmniNewRegisterPersoSimPageComponent', () => {
  let component: OmniNewRegisterPersoSimPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniNewRegisterPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

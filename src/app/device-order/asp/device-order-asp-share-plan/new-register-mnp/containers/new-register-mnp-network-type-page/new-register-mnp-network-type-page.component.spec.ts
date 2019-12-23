import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpNetworkTypePageComponent } from './new-register-mnp-network-type-page.component';

describe('NewRegisterMnpNetworkTypePageComponent', () => {
  let component: NewRegisterMnpNetworkTypePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpNetworkTypePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpNetworkTypePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpNetworkTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

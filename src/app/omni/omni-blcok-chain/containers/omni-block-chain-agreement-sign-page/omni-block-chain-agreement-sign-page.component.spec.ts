import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainAgreementSignPageComponent } from './omni-block-chain-agreement-sign-page.component';

describe('OmniBlockChainAgreementSignPageComponent', () => {
  let component: OmniBlockChainAgreementSignPageComponent;
  let fixture: ComponentFixture<OmniBlockChainAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

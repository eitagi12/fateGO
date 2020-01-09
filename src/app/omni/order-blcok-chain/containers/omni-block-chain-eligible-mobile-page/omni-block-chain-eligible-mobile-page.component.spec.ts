import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainEligibleMobilePageComponent } from './omni-block-chain-eligible-mobile-page.component';

describe('OmniBlockChainEligibleMobilePageComponent', () => {
  let component: OmniBlockChainEligibleMobilePageComponent;
  let fixture: ComponentFixture<OmniBlockChainEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

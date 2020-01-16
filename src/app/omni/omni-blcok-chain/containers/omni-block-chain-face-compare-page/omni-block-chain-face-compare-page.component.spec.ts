import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainFaceComparePageComponent } from './omni-block-chain-face-compare-page.component';

describe('OmniBlockChainFaceComparePageComponent', () => {
  let component: OmniBlockChainFaceComparePageComponent;
  let fixture: ComponentFixture<OmniBlockChainFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

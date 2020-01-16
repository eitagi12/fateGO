import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainFaceCapturePageComponent } from './omni-block-chain-face-capture-page.component';

describe('OmniBlockChainFaceCapturePageComponent', () => {
  let component: OmniBlockChainFaceCapturePageComponent;
  let fixture: ComponentFixture<OmniBlockChainFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainFaceConfirmPageComponent } from './omni-block-chain-face-confirm-page.component';

describe('OmniBlockChainFaceConfirmPageComponent', () => {
  let component: OmniBlockChainFaceConfirmPageComponent;
  let fixture: ComponentFixture<OmniBlockChainFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

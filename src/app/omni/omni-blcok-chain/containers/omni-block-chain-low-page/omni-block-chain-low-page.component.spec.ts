import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainLowPageComponent } from './omni-block-chain-low-page.component';

describe('OmniBlockChainLowPageComponent', () => {
  let component: OmniBlockChainLowPageComponent;
  let fixture: ComponentFixture<OmniBlockChainLowPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainLowPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainLowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

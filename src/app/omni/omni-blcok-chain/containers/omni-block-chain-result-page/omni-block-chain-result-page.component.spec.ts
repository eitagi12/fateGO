import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniBlockChainResultPageComponent } from './omni-block-chain-result-page.component';

describe('OmniBlockChainResultPageComponent', () => {
  let component: OmniBlockChainResultPageComponent;
  let fixture: ComponentFixture<OmniBlockChainResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniBlockChainResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniBlockChainResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSharePlanMnpNetworkTypePageComponent } from './new-share-plan-mnp-network-type-page.component';

describe('NewSharePlanMnpNetworkTypePageComponent', () => {
  let component: NewSharePlanMnpNetworkTypePageComponent;
  let fixture: ComponentFixture<NewSharePlanMnpNetworkTypePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSharePlanMnpNetworkTypePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSharePlanMnpNetworkTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

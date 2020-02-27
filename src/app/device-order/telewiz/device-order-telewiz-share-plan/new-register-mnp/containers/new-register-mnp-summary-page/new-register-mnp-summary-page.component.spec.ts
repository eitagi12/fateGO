import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpSummaryPageComponent } from './new-register-mnp-summary-page.component';

describe('NewRegisterMnpSummaryPageComponent', () => {
  let component: NewRegisterMnpSummaryPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

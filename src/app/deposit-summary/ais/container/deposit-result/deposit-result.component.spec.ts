import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositResultComponent } from './deposit-result.component';

describe('DepositResultComponent', () => {
  let component: DepositResultComponent;
  let fixture: ComponentFixture<DepositResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

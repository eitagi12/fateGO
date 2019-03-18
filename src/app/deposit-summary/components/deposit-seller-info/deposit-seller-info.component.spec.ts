import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositSellerInfoComponent } from './deposit-seller-info.component';

describe('DepositSellerInfoComponent', () => {
  let component: DepositSellerInfoComponent;
  let fixture: ComponentFixture<DepositSellerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositSellerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositSellerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

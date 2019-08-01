import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageCurrentBalancePageComponent } from './vas-package-current-balance-page.component';

describe('VasPackageCurrentBalancePageComponent', () => {
  let component: VasPackageCurrentBalancePageComponent;
  let fixture: ComponentFixture<VasPackageCurrentBalancePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageCurrentBalancePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageCurrentBalancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

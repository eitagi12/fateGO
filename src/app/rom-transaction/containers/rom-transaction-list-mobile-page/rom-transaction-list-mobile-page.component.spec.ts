import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RomTransactionListMobilePageComponent } from './rom-transaction-list-mobile-page.component';

describe('RomTransactionListMobilePageComponent', () => {
  let component: RomTransactionListMobilePageComponent;
  let fixture: ComponentFixture<RomTransactionListMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RomTransactionListMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RomTransactionListMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

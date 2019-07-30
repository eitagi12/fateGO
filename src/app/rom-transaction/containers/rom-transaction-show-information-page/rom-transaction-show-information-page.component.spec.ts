import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RomTransactionShowInformationPageComponent } from './rom-transaction-show-information-page.component';

describe('RomTransactionShowInformationPageComponent', () => {
  let component: RomTransactionShowInformationPageComponent;
  let fixture: ComponentFixture<RomTransactionShowInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RomTransactionShowInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RomTransactionShowInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

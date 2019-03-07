import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptInformationComponent } from './receipt-information.component';

describe('ReceiptInformationComponent', () => {
  let component: ReceiptInformationComponent;
  let fixture: ComponentFixture<ReceiptInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

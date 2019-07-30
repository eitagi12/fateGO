import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RomTransactionResultPageComponent } from './rom-transaction-result-page.component';

describe('RomTransactionResultPageComponent', () => {
  let component: RomTransactionResultPageComponent;
  let fixture: ComponentFixture<RomTransactionResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RomTransactionResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RomTransactionResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

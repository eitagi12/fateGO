import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositQueueComponent } from './deposit-queue.component';

describe('DepositQueueComponent', () => {
  let component: DepositQueueComponent;
  let fixture: ComponentFixture<DepositQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

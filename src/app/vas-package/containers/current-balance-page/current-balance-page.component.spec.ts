import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBalancePageComponent } from './current-balance-page.component';

describe('CurrentBalancePageComponent', () => {
  let component: CurrentBalancePageComponent;
  let fixture: ComponentFixture<CurrentBalancePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentBalancePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBalancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

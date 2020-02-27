import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpAggregatePageComponent } from './new-register-mnp-aggregate-page.component';

describe('NewRegisterMnpAggregatePageComponent', () => {
  let component: NewRegisterMnpAggregatePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

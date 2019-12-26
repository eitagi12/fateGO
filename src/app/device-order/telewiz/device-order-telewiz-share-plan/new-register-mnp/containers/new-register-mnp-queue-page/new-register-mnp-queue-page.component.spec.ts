import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpQueuePageComponent } from './new-register-mnp-queue-page.component';

describe('NewRegisterMnpQueuePageComponent', () => {
  let component: NewRegisterMnpQueuePageComponent;
  let fixture: ComponentFixture<NewRegisterMnpQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

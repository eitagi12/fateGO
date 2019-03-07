import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCareAvaliableComponent } from './mobile-care-avaliable.component';

describe('MobileCareAvaliableComponent', () => {
  let component: MobileCareAvaliableComponent;
  let fixture: ComponentFixture<MobileCareAvaliableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileCareAvaliableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareAvaliableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

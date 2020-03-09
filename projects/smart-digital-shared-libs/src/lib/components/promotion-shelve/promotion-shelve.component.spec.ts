import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionShelveComponent } from './promotion-shelve.component';

describe('PromotionShelveComponent', () => {
  let component: PromotionShelveComponent;
  let fixture: ComponentFixture<PromotionShelveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionShelveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionShelveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

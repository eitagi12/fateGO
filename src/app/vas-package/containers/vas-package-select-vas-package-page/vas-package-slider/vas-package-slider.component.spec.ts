import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageSliderComponent } from './vas-package-slider.component';

describe('VasPackageSliderComponent', () => {
  let component: VasPackageSliderComponent;
  let fixture: ComponentFixture<VasPackageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

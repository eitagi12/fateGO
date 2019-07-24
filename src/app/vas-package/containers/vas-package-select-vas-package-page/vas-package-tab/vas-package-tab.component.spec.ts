import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageTabComponent } from './vas-package-tab.component';

describe('VasPackageTabComponent', () => {
  let component: VasPackageTabComponent;
  let fixture: ComponentFixture<VasPackageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

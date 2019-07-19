import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageResultPageComponent } from './vas-package-result-page.component';

describe('VasPackageResultPageComponent', () => {
  let component: VasPackageResultPageComponent;
  let fixture: ComponentFixture<VasPackageResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

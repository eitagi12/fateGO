import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageSelectVasPackagePageComponent } from './vas-package-select-vas-package-page.component';

describe('VasPackageSelectVasPackagePageComponent', () => {
  let component: VasPackageSelectVasPackagePageComponent;
  let fixture: ComponentFixture<VasPackageSelectVasPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageSelectVasPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageSelectVasPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

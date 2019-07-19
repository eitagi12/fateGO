import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPackageMenuVasRomPageComponent } from './vas-package-menu-vas-rom-page.component';

describe('VasPackageMenuVasRomPageComponent', () => {
  let component: VasPackageMenuVasRomPageComponent;
  let fixture: ComponentFixture<VasPackageMenuVasRomPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPackageMenuVasRomPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPackageMenuVasRomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

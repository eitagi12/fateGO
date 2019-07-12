import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVasPackagePageComponent } from './select-vas-package-page.component';

describe('SelectVasPackagePageComponent', () => {
  let component: SelectVasPackagePageComponent;
  let fixture: ComponentFixture<SelectVasPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVasPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVasPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

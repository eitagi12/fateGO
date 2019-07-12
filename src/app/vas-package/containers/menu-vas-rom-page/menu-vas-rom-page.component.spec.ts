import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVasRomPageComponent } from './menu-vas-rom-page.component';

describe('MenuVasRomPageComponent', () => {
  let component: MenuVasRomPageComponent;
  let fixture: ComponentFixture<MenuVasRomPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuVasRomPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuVasRomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

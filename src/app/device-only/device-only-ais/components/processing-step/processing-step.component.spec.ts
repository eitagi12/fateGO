import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingStepComponent } from './processing-step.component';

describe('ProcessingStepComponent', () => {
  let component: ProcessingStepComponent;
  let fixture: ComponentFixture<ProcessingStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

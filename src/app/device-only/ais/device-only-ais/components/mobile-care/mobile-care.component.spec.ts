import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MobileCareComponent } from './mobile-care.component';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';

@Pipe({name: 'translate'})
class MockPipe implements PipeTransform {
    transform(value: number): number {
        return value;
    }
}

describe('MobileCareComponent', () => {
  let component: MobileCareComponent;
  let fixture: ComponentFixture<MobileCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        MobileCareComponent,
        MockPipe
     ],
     providers: [
      BsModalService,
      PositioningService,
      ComponentLoaderFactory
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

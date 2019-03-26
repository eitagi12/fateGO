import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  setupTestBed({
    imports: [ ReactiveFormsModule, RouterTestingModule ],
    declarations: [
      MobileCareComponent,
      MockPipe
    ],
    providers: [
      BsModalService,
      PositioningService,
      ComponentLoaderFactory
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadCardComponent } from './read-card.component';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ReadCardService, PageLoadingService, Utils, AlertService } from 'mychannel-shared-libs';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

@Pipe({ name: 'translate' })
class MockPipeTranslate implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ReadCardComponent', () => {
  let component: ReadCardComponent;
  let fixture: ComponentFixture<ReadCardComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule
    ],
    declarations: [
      ReadCardComponent,
      MockPipeTranslate
    ],
    providers: [
      BsModalService,
      PositioningService,
      ComponentLoaderFactory,
      Utils,
      CustomerInformationService,
      HttpClient,
      HttpHandler,
      {
        provide: ReadCardService,
        useValue: {
          onReadCard: jest.fn()
        }
      },
      {
        provide: PageLoadingService,
        useValue: {
          closeLoading: jest.fn()
        }
      },
      {
        provide: AlertService,
        useValue: {
          error: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

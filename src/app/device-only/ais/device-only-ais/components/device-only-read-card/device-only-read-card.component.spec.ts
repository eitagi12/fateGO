import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyReadCardComponent } from './device-only-read-card.component';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ReadCardService, PageLoadingService, Utils, AlertService } from 'mychannel-shared-libs';
import { CustomerInformationService } from 'src/app/device-only/ais/device-only-ais/services/customer-information.service';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

@Pipe({ name: 'translate' })
class MockPipeTranslate implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DeviceOnlyReadCardComponent', () => {
  let component: DeviceOnlyReadCardComponent;
  let fixture: ComponentFixture<DeviceOnlyReadCardComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule
    ],
    declarations: [
      DeviceOnlyReadCardComponent,
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
    fixture = TestBed.createComponent(DeviceOnlyReadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

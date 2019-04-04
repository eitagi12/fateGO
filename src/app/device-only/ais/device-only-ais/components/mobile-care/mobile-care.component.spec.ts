import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileCareComponent } from './mobile-care.component';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService } from '../../../../../../../node_modules/mychannel-shared-libs';
import { LocalStorageService } from '../../../../../../../node_modules/ngx-store';

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
      HttpClient,
      HttpHandler,
      BsModalService,
      PositioningService,
      ComponentLoaderFactory,
      LocalStorageService,
      {
        provide : PriceOptionService,
        useValue : {
          load: jest.fn(() => {
            return {
              trade: {
                normalPrice: '18500'
              }
            };
          })
        }
      },
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
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

import { TestBed, inject } from '@angular/core/testing';
import { CreateOrderService } from './create-order.service';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { HttpHandler } from '@angular/common/http';

describe('CreateOrderService', () => {
  setupTestBed({
    providers: [
      HttpClient,
      HttpHandler,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateOrderService]
    });
  });

  it('should be created', inject([CreateOrderService], (service: CreateOrderService) => {
    expect(service).toBeTruthy();
  }));
});

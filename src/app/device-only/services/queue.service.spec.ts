import { TestBed, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

describe('QueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueueService,
        HttpClient,
        HttpHandler
      ]
    });
  });

  it('should be created', inject([QueueService], (service: QueueService) => {
    expect(service).toBeTruthy();
  }));
});

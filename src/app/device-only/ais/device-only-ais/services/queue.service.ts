import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private http: HttpClient) { }

  autoGetQueue(mobileNo: string): Promise<any> {
    const intercepterOption = {
      mobileNo: mobileNo
    };
    return this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', intercepterOption).pipe(
      map((response: any) => response.data && response.data.data && response.data.data.queueNo || '')
    ).toPromise();
  }

  checkQueueLocation(): Promise<any> {
    return this.http.get('/api/salesportal/check-queue-location').toPromise().then((response: any) => {
      return response && response.data && response.data.queueType ? response.data.queueType : undefined;
    }).catch((e) => false);
  }

  getQueueZ(locationCode: any): Promise<any> {
    return this.http.get('/api/salesportal/device-sell/gen-queue', { params: { locationCode: locationCode } }).toPromise();
  }

  getQueueNewMatic(mobileNo: any): Promise<any> {
    return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
      mobileNo: mobileNo
    }).toPromise();
  }

}

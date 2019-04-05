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
      map((response: any) => response.data.data.queueNo || '')
    ).toPromise();
  }
}

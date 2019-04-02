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
    return this.http.post('/api/device-order/transaction/get-queue-qmatic', intercepterOption).pipe(
      map((response: any) => response.data.queue || '')
    ).toPromise();
  }
}

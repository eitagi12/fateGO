import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueuePageService {

  constructor(private http: HttpClient) { }

  public checkQueueLocation(): Promise<any> {
    return this.http.get('/api/salesportal/check-queue-location').toPromise().then((response: any) => {
      return response && response.data && response.data.queueType ? response.data.queueType : undefined;
    }).catch((e) => false);
  }

}

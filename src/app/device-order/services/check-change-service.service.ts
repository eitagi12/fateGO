import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckChangeServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  CheckServiceKnoxGuard(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/customerportal/checkChangeService', {
        mobileNo: mobileNo
      }).toPromise().then((response: any) => {
        if (response.data.returnCode === '001') {
          resolve(true);
        } else {
          const message: string = response.data.description || 'มี Service Samsung Knox Guard อยู่แล้ว';
          reject(message);
        }
      }).catch((err) => reject(err));
    });
  }
}

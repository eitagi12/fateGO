import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { toDataURL } from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeOmisePageService {

  constructor(
    private http: HttpClient
  ) { }

  createOrder(params: Object): Promise<any> {
    return this.http.post('/api/salesportal/super-duper/test-create-order', params).toPromise();
  }
}

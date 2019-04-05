import { Injectable } from '@angular/core';
import { MobileNoPipe } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class MobileCareService {

  constructor() { }

  mobileNoPipe(mobile: string): string {
    return new MobileNoPipe().transform(mobile);
  }
}

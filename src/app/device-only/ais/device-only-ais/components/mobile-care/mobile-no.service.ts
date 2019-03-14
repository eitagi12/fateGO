import { MobileNoPipe } from 'mychannel-shared-libs';
import { Injectable } from '../../../../../../../node_modules/@angular/core';

@Injectable()
export class MobileNoService {
    getMobileNo(mobile: string): string {
        return new MobileNoPipe().transform(mobile);
    }
}

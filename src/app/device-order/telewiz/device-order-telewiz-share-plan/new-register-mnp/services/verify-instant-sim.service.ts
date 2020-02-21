import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class VerifyInstantSimService {

    constructor(
        private http: HttpClient
    ) { }

    verifyInstantSim(barCode: any): Promise<any> {
        // console.log(barCode);
        let verifySimAPI = '/api/customerportal/newRegister/:barcode/queryMobileBySim';
        verifySimAPI = verifySimAPI.replace(':barcode', barCode);
        return this.http.get(verifySimAPI).toPromise();
    }
}

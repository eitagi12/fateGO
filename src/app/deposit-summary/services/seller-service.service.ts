import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ShopLocation, ShopEmployeeDetail } from 'src/app/shared/models/transaction.model';
import { API } from 'src/app/deposit-summary/constants/wizard.constant';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http: HttpClient) { }
}

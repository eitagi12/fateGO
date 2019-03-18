import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ShopLocation, ShopEmployeeDetail } from 'src/app/shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SellerServiceService {

  constructor(private http: HttpClient) { }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageProductsService {

  constructor(
    private http: HttpClient,
  ) { }

  getPackageProducts(userId: string): Promise<any> {
    return this.http.post('/api/salesportal/promotion-vas', {
      userId: userId
    }).toPromise()
      .then((response: any) => {
        return response.data;
      });
  }
}

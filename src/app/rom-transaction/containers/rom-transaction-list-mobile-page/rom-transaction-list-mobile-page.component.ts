import { Component, OnInit } from '@angular/core';
import { HomeService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE } from 'src/app/rom-transaction/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

export interface RomData {
  createDate: string;
  cusMobileNo: string;
  locationcode: string;
  packId: string;
  price: string;
  romNo: string;
  ssid: string;
  status: string;
  transactionId: string;
  transactionType: 'VAS' | 'TOPUP';
  username: string;
  time?: string;
  _id: string;
}

@Component({
  selector: 'app-rom-transaction-list-mobile-page',
  templateUrl: './rom-transaction-list-mobile-page.component.html',
  styleUrls: ['./rom-transaction-list-mobile-page.component.scss']
})
export class RomTransactionListMobilePageComponent implements OnInit {

  username: string;
  romData: RomData[] = [];
  currenDate: string = '';
  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
  ) {
    this.username = this.tokenService.getUser().username;
  }

  ngOnInit(): void {
    this.currenDate = this.getCurrentDate();
    this.queryRomList();
  }

  queryRomList(): void {
    this.pageLoadingService.openLoading();
    this.http.post('/api/customerportal/insert-rom-transaction', {
      username: this.username
    }).toPromise()
    .then((res: any) => {
      const data = res.data || [];
      this.pageLoadingService.closeLoading();
      this.romData = data.map((roms: RomData) => {
        const createMoment = moment(roms.createDate);
        roms.time = createMoment.format('HH.mm');
        return roms;
      })
      .sort((val1, val2) => val2.time - val1.time);
    });
  }

  getCurrentDate(): string {
    const day = moment().format('DD');
    const mount = moment().format('M');
    const year = moment().format('YYYY');
    const monthList = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
    return day + ' ' + monthList[+mount - 1] + ' ' + (+year + 543);
  }

  onSelect(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

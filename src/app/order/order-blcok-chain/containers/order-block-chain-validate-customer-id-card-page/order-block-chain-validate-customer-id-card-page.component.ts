import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-validate-customer-id-card-page',
  templateUrl: './order-block-chain-validate-customer-id-card-page.component.html',
  styleUrls: ['./order-block-chain-validate-customer-id-card-page.component.scss']
})
export class OrderBlockChainValidateCustomerIdCardPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    // this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

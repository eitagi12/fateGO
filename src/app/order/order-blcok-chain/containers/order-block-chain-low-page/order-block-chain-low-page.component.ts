import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-low-page',
  templateUrl: './order-block-chain-low-page.component.html',
  styleUrls: ['./order-block-chain-low-page.component.scss']
})
export class OrderBlockChainLowPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

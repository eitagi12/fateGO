import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-eligible-mobile-page',
  templateUrl: './order-block-chain-eligible-mobile-page.component.html',
  styleUrls: ['./order-block-chain-eligible-mobile-page.component.scss']
})
export class OrderBlockChainEligibleMobilePageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

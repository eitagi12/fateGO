import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-agreement-sign-page',
  templateUrl: './order-block-chain-agreement-sign-page.component.html',
  styleUrls: ['./order-block-chain-agreement-sign-page.component.scss']
})
export class OrderBlockChainAgreementSignPageComponent implements OnInit {

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
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

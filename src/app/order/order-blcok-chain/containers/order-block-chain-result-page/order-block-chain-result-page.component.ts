import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-result-page',
  templateUrl: './order-block-chain-result-page.component.html',
  styleUrls: ['./order-block-chain-result-page.component.scss']
})
export class OrderBlockChainResultPageComponent implements OnInit {

  isSuccess: boolean = true;

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE]);
  }

  onNext(): void {
    // this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }

}

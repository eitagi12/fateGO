import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import {ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-face-confirm-page',
  templateUrl: './order-block-chain-face-confirm-page.component.html',
  styleUrls: ['./order-block-chain-face-confirm-page.component.scss']
})
export class OrderBlockChainFaceConfirmPageComponent implements OnInit {
  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_OMNI_BLOCK_CHAIN } from 'src/app/omni/constants/wizard.constant';
import { ROUTE_OMNI_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE, ROUTE_OMNI_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-order-block-chain-low-page',
  templateUrl: './order-block-chain-low-page.component.html',
  styleUrls: ['./order-block-chain-low-page.component.scss']
})
export class OmniBlockChainLowPageComponent implements OnInit {
  wizards: string[] = WIZARD_OMNI_BLOCK_CHAIN;
  agreement: boolean;
  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }
  onHome(): void {
    this.homeService.goToHome();
  }
}

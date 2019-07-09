import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_BLOCK_CHAIN } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';

@Component({
  selector: 'app-order-block-chain-face-confirm-page',
  templateUrl: './order-block-chain-face-confirm-page.component.html',
  styleUrls: ['./order-block-chain-face-confirm-page.component.scss']
})
export class OrderBlockChainFaceConfirmPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_BLOCK_CHAIN;

  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private translation: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.confirmForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    // this.pageLoadingService.openLoading();
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

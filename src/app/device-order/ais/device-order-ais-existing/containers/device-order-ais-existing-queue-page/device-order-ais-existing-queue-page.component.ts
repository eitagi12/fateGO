import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { HomeService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-existing-queue-page',
  templateUrl: './device-order-ais-existing-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-queue-page.component.scss']
})
export class DeviceOrderAisExistingQueuePageComponent implements OnInit {

  transaction: Transaction;
  queueFrom: FormGroup;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_RESULT_PAGE]);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  validatorMobileNo(): ValidationErrors {
    return this.queueFrom.get('mobileNo').touched && this.queueFrom.get('mobileNo').errors ;
  }

}

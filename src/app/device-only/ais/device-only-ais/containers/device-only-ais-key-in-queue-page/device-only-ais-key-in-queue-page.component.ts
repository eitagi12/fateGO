import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { validate } from '@babel/types';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-only-ais-key-in-queue-page',
  templateUrl: './device-only-ais-key-in-queue-page.component.html',
  styleUrls: ['./device-only-ais-key-in-queue-page.component.scss']
})
export class DeviceOnlyAisKeyInQueuePageComponent implements OnInit, OnDestroy {
  public queueForm: FormGroup;
  private transaction: Transaction;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private homeService: HomeService) { }

  ngOnInit(): void {
    this.transaction = this.transactionService.load();
    this.createQueueForm();
  }

  public createQueueForm(): void {
    this.queueForm = this.fb.group({
      queueNo: (['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[A-Z0-9]+$')
      ])])
    });
  }

  get f(): any { return this.queueForm.controls; }

  onNext(): void {
    this.transaction.data.queue = this.queueForm.value.queueNo;
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {

  }
}

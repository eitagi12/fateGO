import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
import { PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';

import { HttpClient } from '@angular/common/http';
import { map, retryWhen, concatMap, delay } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { ResizeImageComponent } from '../../components/resize-image/resize-image.component';
declare var window: any;
@Component({
  selector: 'app-new-share-plan-mnp-result-page',
  templateUrl: './new-share-plan-mnp-result-page.component.html',
  styleUrls: ['./new-share-plan-mnp-result-page.component.scss']
})

export class NewSharePlanMnpResultPageComponent implements OnInit {
  public isSuccess: boolean = true;
  public transaction: Transaction;
  public mobileNo: string;
  public mobileNo1: string;
  public simSerial: string;
  public simSerial1: string;
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;  // createTransactionService: Promise<any>;

  @ViewChild(ResizeImageComponent) resizeImage: ResizeImageComponent;
  reSizeImage: string;
  aisNative: any = window.aisNative;
  getEApplicationFn: any;
  @Input() previewImage: string[] = [];
  images: string[] = [];

  public MSG_ERROR_DEFAULT: string = 'ขออภัยระบบไม่สามารถทำรายการได้';
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.simSerial = this.transaction.data.simCard.simSerial;
    // this.checkOrderStatus();
    // this.simSerial = '1234567891011';
    // this.mobileNo = '0646244645';
    // this.mobileNo1 = '0646244546';
    // this.simSerial1 = '1234567891112';

    this.pageLoadingService.openLoading();
    this.createNewRegisterService.createNewRegister(this.transaction)
      .then((resp: any) => {
        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        this.transactionService.update(this.transaction);
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
          this.checkOrderStatusByOrderNo(this.transaction.data.order.orderNo).then((res: any) => {
            this.pageLoadingService.closeLoading();

          }).catch((err) => {
            this.pageLoadingService.closeLoading();

          });
        } else {
          this.isSuccess = false;
          this.pageLoadingService.closeLoading();
        }

      }).catch(() => {
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
      });

    // this.getEApplicationImageForPrint();

  }

  checkOrderStatusByOrderNo(orderNo: string): Promise<any> {
    const url: string = `/api/salesportal/order/check-order-status/${orderNo}`;

    return this.http.get(url).pipe(
      map((res: any) => {
        if (res.data.orderNo === orderNo) {
          if (res.data.orderStatus === 'Completed') {
            const result: any = {
              orderNo: res.data.orderNo,
              orderType: res.data.orderType,
              orderStatus: res.data.orderStatus
            };
            return result;
          } else {
            throw new Error('Order status not completed');
          }
        } else {
          throw new Error('Order status not completed');
        }
      }), retryWhen(errors =>
        errors.pipe(concatMap((e, i) => {
          if (i >= 12) {
            this.pageLoadingService.closeLoading();
            return throwError(`ขออภัย ทำรายการไม่สำเร็จ (ORDER : ${orderNo})`);
          }
          return of(e).pipe(delay(15000));
        }))
      )).toPromise();
  }

  onMainMenu(): void {
    // bug gotohome จะ unlock เบอร์ ทำให้ออก orderไม่สำเร็จ
    window.location.href = '/smart-digital/main-menu';
    // this.homeService.goToHome();
  }

  nextprint(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  getEApplicationImageForPrint(): void {
    this.getEApplicationFn = this.getEApplicationFile('R1910000910567');
    this.getEApplicationFn.then((response: any): void => {
      if (response) {
        // this.images = [];
        this.images.push('data:image/jpg;base64,' + response.data.eApplication);
        if (typeof window.aisNative !== 'undefined') {
          this.resizeImage.printToNetworkOrientation();
        } else {
          this.resizeImage.callPrint();
        }
      }
    }).catch((err: any) => {
      try {
        const errorObj: any = err.json();
        errorObj.developerMessage = errorObj.developerMessage + ' | ' + JSON.stringify(errorObj.errors);
        err._body = JSON.stringify(errorObj);
      } catch (err) {
        console.log('err: ', err);
      }
    });
  }

  getEApplicationFile(orderNo: string): Promise<any> {
    const url = `/api/customerportal/newRegister/eApplication/${orderNo}`;
    return this.http.get(url).toPromise();
  }
}

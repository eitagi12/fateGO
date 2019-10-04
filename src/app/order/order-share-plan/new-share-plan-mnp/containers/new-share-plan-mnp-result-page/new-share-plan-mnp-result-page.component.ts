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
import { PrinterComponent } from '../../components/printer/printer.component';
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

  @ViewChild(PrinterComponent)
  mcprinter: PrinterComponent;
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
        console.log('resp', resp);
        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        this.transactionService.update(this.transaction);
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
          this.checkOrderStatusByOrderNo(this.transaction.data.order.orderNo).then((res: any) => {
            console.log('res', res);
            this.pageLoadingService.closeLoading();

          });
        } else {
          this.isSuccess = false;
        }
        // this.pageLoadingService.closeLoading();

      }).catch(() => {
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
      });

      this.getEApplicationImageForPrint();

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
    this.getEApplicationFn = this.getEApplicationFile(this.transaction.data.order.orderNo);
    this.getEApplicationFn.then((response: any): void => {
      if (response) {
        this.images = [];
        this.images.push('data:image/jpg;base64,' + response.data.eApplication);
        if (typeof window.aisNative !== 'undefined') {
          this.printToNetworkOrientation();
        } else {
          this.callPrint();
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

  printToNetworkOrientation(): void {
    this.imagePromise(this.previewImage)
      .then((images: string[]) => {
        let htmlCode: string = '';
        images.forEach((image: string, index: number) => {
          htmlCode += `<div style="text-align: center;">` +
            `<img style="margin:0 auto 10px; width: 100%;" src="${image}" alt="">` +
            `<div>`;
            if (index < images.length - 1) {
              htmlCode += '<hr>';
            }
        });
        this.aisNative.printToNetworkOrientation(htmlCode, '2');
      });
  }

  private imagePromise(images: string[]): Promise<any> {
    const promise: Promise<string>[] = [];
    images.forEach((src: string) => {
      promise.push(this.resizeDataURL(src));
    });
    return Promise.all(promise);
  }

  private resizeDataURL(image: string): Promise<string> {
    return new Promise((resovle, reject) => {
      // Max size for thumbnail
      const maxWidth: number = 700;
      const maxHeight: number = 700;
      // Create and initialize two canvas
      const canvas: any = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      const canvasCopy: any = document.createElement('canvas');
      const copyContext: any = canvasCopy.getContext('2d');

      // Create original image
      const img: any = new Image();
      img.onload = (): void => {
        // Determine new ratio based on max size
        let ratio: number = 1;
        if (img.width > maxWidth) {
          ratio = maxWidth / img.width;
        } else if (img.height > maxHeight) {
          ratio = maxHeight / img.height;
        }
        // Draw original image in second canvas
        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0);
        // Copy and resize second canvas to first canvas
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);

        resovle(canvas.toDataURL('image/jpeg'));
      };
      img.src = image;
    });
  }

  callPrint(): void {
    this.mcprinter.setItems(this.previewImage);
    this.mcprinter.print();
  }

  getEApplicationFile(orderNo: string): Promise<any> {
    const url = `/api/customerportal/newRegister/eApplication/${orderNo}`;
    return this.http.get(url).toPromise();
  }
}

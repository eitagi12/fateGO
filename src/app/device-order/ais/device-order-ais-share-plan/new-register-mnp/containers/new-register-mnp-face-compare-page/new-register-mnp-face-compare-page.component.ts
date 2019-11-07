import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CaptureAndSign, ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction, Customer, FaceRecognition, TransactionAction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CONFIRM_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-new-register-mnp-face-compare-page',
  templateUrl: './new-register-mnp-face-compare-page.component.html',
  styleUrls: ['./new-register-mnp-face-compare-page.component.scss']
})
export class NewRegisterMnpFaceComparePageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  captureAndSign: CaptureAndSign;
  shoppingCart: ShoppingCart;
  navBarTitle: string = 'Test';
  faceTitle: string = 'ข้อมูลใบหน้าจากรูปถ่าย';
  pictureTitle: string = 'ข้อมูลใบหน้าจากบัตรประชาชน';
  imgCardSrc: string = 'assets/images/img-loader.gif';
  imgFaceSrc: string = 'assets/images/img-loader.gif';
  transaction: Transaction;

  constructor(private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const customer: Customer = this.transaction.data.customer;
    const faceRecognition: FaceRecognition = this.transaction.data.faceRecognition;
    this.http.post('/api/facerecog/facecompare', {
      cardBase64Imgs: this.isReadCard() ? customer.imageReadSmartCard || customer.imageSmartCard : customer.imageSmartCard,
      selfieBase64Imgs: faceRecognition.imageFaceUser
    }).toPromise().then((resp: any) => {
      this.transaction.data.faceRecognition.kyc = !resp.data.match;
      if (resp.data.match) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CONFIRM_PAGE]);
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isReadCard(): boolean {
    return this.transaction.data.action === TransactionAction.READ_CARD;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

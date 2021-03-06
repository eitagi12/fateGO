import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, CaptureAndSign, TokenService, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction, Customer, FaceRecognition } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CONFIRM_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-new-register-face-compare-page',
  templateUrl: './device-order-ais-new-register-face-compare-page.component.html',
  styleUrls: ['./device-order-ais-new-register-face-compare-page.component.scss']
})
export class DeviceOrderAisNewRegisterFaceComparePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  captureAndSign: CaptureAndSign;
  shoppingCart: ShoppingCart;

  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    // const faceImage = this.faceRecognitionService.getFaceImage();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const customer: Customer = this.transaction.data.customer;
    const faceRecognition: FaceRecognition = this.transaction.data.faceRecognition;

    this.http.post('/api/facerecog/facecompare', {
      cardBase64Imgs: this.isReadCard() ? customer.imageReadSmartCard : customer.imageSmartCard,
      selfieBase64Imgs: faceRecognition.imageFaceUser
    }).toPromise().then((resp: any) => {
      this.transaction.data.faceRecognition.kyc = !resp.data.match;
      if (resp.data.match) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
      } else {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CONFIRM_PAGE]);
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
    }).catch((error) => {
      this.pageLoadingService.closeLoading();
      this.transaction.data.faceRecognition.kyc = true;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CONFIRM_PAGE]);
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

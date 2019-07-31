import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_BLOCK_CHAIN } from 'src/app/order/constants/wizard.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService, PageLoadingService, CaptureAndSign, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction, Customer, FaceRecognition } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE, ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE, ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';
import * as moment from 'moment';
const Moment = moment;
@Component({
  selector: 'app-order-block-chain-face-compare-page',
  templateUrl: './order-block-chain-face-compare-page.component.html',
  styleUrls: ['./order-block-chain-face-compare-page.component.scss']
})
export class OrderBlockChainFaceComparePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_BLOCK_CHAIN;
  captureAndSign: CaptureAndSign;
  locationName: string;
  employeeCode: any;
  locationCode: string;
  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // const faceImage = this.faceRecognitionService.getFaceImage();
    this.checkLocation();
  }
  checkLocation(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.locationName = response.data.displayName;
      this.locationCode = response.data.code;
    });
    this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
      .then((employee: any) => {
        this.employeeCode = employee.data.pin;
      });

  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.callService();
  }
  callService(): void {
    this.pageLoadingService.openLoading();
    const customer = this.transaction.data.customer;
    const simCard = this.transaction.data.simCard;
    const faceImage = this.transaction.data.faceRecognition;
    // const birthDate = a.replace(/\//g, '-');
    const birthDate = moment(customer.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const param = {
      id_card: customer.idCardNo || '',
      prefix_name_th: customer.titleName || '',
      firstname_th: customer.firstName || '',
      surname_th: customer.lastName || '',
      prefix_name_en: customer.titleNameEN || '',
      firstname_en: customer.firstNameEn || '',
      surname_en: customer.lastNameEn || '',
      msisdn: `66${simCard.mobileNo.substring(1, simCard.mobileNo.length)}` || '',
      live_photo: faceImage.imageFaceUser || '',
      card_photo: customer.imageReadSmartCard || '',
      consent: customer.imageSignature || '',
      laser_code: customer.laserCode || '',
      birth_date: birthDate || '',
      location_name: this.locationName || '',
      location_code: this.locationCode || '',
      empowerment_flag: '',
      empowerment_by_code: this.employeeCode || '',
      force_enroll_flag: simCard.forceEnrollFlag || ''
    };
    this.http.post(`/api/customerportal/newRegister/post-mobile-id`, param).toPromise()
      .then((data: any) => {
        this.transaction.data.customer.isBlockChain = true;
        this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
      }).catch((err) => {
        if (err.developerMessage === '412') {
          this.route.queryParams.subscribe(params => {
            if (!params.facepare) {
              this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE], { queryParams: { facepare: true } });
            } else {
              this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CONFIRM_PAGE]);

            }
          });
        }
        this.transaction.data.customer.isBlockChain = false;
        this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);

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

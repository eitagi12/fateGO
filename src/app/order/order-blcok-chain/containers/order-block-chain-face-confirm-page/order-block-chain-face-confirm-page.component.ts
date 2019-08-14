import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_BLOCK_CHAIN } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService, TokenService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
@Component({
  selector: 'app-order-block-chain-face-confirm-page',
  templateUrl: './order-block-chain-face-confirm-page.component.html',
  styleUrls: ['./order-block-chain-face-confirm-page.component.scss']
})
export class OrderBlockChainFaceConfirmPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_BLOCK_CHAIN;

  confirmForm: FormGroup;
  transaction: Transaction;
  locationName: string;
  employeeCode: any;
  locationCode: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private translation: TranslateService,
    private transactionService: TransactionService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    const employeeCode = this.transaction.data && this.transaction.data.seller ? this.transaction.data.seller.ascCode : '';
    this.confirmForm = this.fb.group({
      password: [employeeCode, [Validators.required]],
    });
    this.confirmForm.patchValue({
      password: employeeCode || '',
    });

  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.confirmForm.value.password}`).toPromise()
      .then((employee: any) => {
        const isEmployee = employee.data || '';
        if (isEmployee.condition) {
          this.callService();
        } else {
          this.alertService.error('กรุณากรอกรหัสพนักงงานให้ถูกต้อง');
        }
      }).catch((err) => {
        this.pageLoadingService.closeLoading();
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }
  callService(): void {
    this.pageLoadingService.openLoading();
    const customer = this.transaction.data.customer;
    const simCard = this.transaction.data.simCard;
    const faceImage = this.transaction.data.faceRecognition;
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
      empowerment_flag: 'Y',
      empowerment_by_code: this.employeeCode || '',
      force_enroll_flag: simCard.forceEnrollFlag || '',
      sim_registration_timestamp: simCard.registerDate
    };
    this.http.post(`/api/customerportal/newRegister/post-mobile-id`, param).toPromise()
      .then((data: any) => {
        console.log('data', data);
        this.transaction.data.customer.isBlockChain = true;
        this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
      }).catch((err) => {
        this.transaction.data.customer.isBlockChain = false;
        this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_RESULT_PAGE]);
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_FACE_COMPARE_PAGE, ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { RemoveCartService } from '../../services/remove-cart.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-new-register-mnp-face-confirm-page',
  templateUrl: './new-register-mnp-face-confirm-page.component.html',
  styleUrls: ['./new-register-mnp-face-confirm-page.component.scss']
})
export class NewRegisterMnpFaceConfirmPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_ASP_DEVICE_SHARE_PLAN;
  confirmForm: FormGroup;
  shoppingCart: ShoppingCart;
  transaction: Transaction;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private removeCartService: RemoveCartService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.confirmForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const username = this.confirmForm.value.password;
    this.http.get('/api/customerportal/checkEmployeeCode', {
      params: {
        username: username
      }
    }).toPromise().then((resp: any) => {
      if (resp && resp.data) {
        this.router.navigate([ROUTE_DEVICE_ORDER_ASP_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE]);
      } else {
        return this.alertService.error(this.translateService.instant('ชื่อ/รหัสผ่าน ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'));
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }
}

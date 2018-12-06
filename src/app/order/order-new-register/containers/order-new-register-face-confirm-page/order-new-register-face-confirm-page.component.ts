import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-new-register-face-confirm-page',
  templateUrl: './order-new-register-face-confirm-page.component.html',
  styleUrls: ['./order-new-register-face-confirm-page.component.scss']
})
export class OrderNewRegisterFaceConfirmPageComponent implements OnInit {

  wizards = WIZARD_ORDER_NEW_REGISTER;

  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,

  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let username;
    if (environment.name === 'LOCAL' || environment.name === 'PVT') {
      username = 'netnapht';
    }
    this.confirmForm = this.fb.group({
      username: [username, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onNext() {
    this.pageLoadingService.openLoading();
    const username = this.confirmForm.value.username;
    this.http.get('/api/customerportal/checkEmployeeCode', {
      params: {
        username: username
      }
    }).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE]);
        } else {
          return this.alertService.error('ชื่อ/รหัสผ่าน ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
        }
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome() {
    this.homeService.goToHome();
  }

}

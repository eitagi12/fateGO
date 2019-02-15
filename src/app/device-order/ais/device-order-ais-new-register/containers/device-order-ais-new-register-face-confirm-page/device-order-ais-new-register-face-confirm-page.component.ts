import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE,
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';

@Component({
  selector: 'app-device-order-ais-new-register-face-confirm-page',
  templateUrl: './device-order-ais-new-register-face-confirm-page.component.html',
  styleUrls: ['./device-order-ais-new-register-face-confirm-page.component.scss']
})
export class DeviceOrderAisNewRegisterFaceConfirmPageComponent implements OnInit {
  wizards = WIZARD_DEVICE_ORDER_AIS;

  confirmForm: FormGroup;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,

  ) {
  }

  ngOnInit() {
    this.createForm();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE]);
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
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGGREGATE_PAGE]);
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

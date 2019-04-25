import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { environment } from 'src/environments/environment';
import { ROUTE_DEVICE_ORDER_AIS_MNP_FACE_COMPARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-order-ais-mnp-face-confirm-page',
  templateUrl: './device-order-ais-mnp-face-confirm-page.component.html',
  styleUrls: ['./device-order-ais-mnp-face-confirm-page.component.scss']
})
export class DeviceOrderAisMnpFaceConfirmPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

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

  ngOnInit(): void {
    this.createForm();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
  }

  createForm(): void {
    let username;
    if (environment.name === 'LOCAL' || environment.name === 'PVT') {
      username = 'netnapht';
    }
    this.confirmForm = this.fb.group({
      username: [username, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const username = this.confirmForm.value.username;
    this.http.get('/api/customerportal/checkEmployeeCode', {
      params: {
        username: username
      }
    }).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
        } else {
          return this.alertService.error('ชื่อ/รหัสผ่าน ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง');
        }
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageLoadingService, AlertService, HomeService } from 'mychannel-shared-libs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-share-plan-mnp-face-confirm-page',
  templateUrl: './new-share-plan-mnp-face-confirm-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-confirm-page.component.scss']
})
export class NewSharePlanMnpFaceConfirmPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private homeService: HomeService,
    private translation: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    const username = this.getUsername();
    this.confirmForm = this.fb.group({
      username: [username, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private getUsername(): string {
    let username;
    if (environment.name === 'LOCAL' || environment.name === 'PVT') {
      username = 'netnapht';
    }
    return username;
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
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
          this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
        } else {
          return this.alertService.error(this.translation.instant('ชื่อ/รหัสผ่าน ไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'));
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

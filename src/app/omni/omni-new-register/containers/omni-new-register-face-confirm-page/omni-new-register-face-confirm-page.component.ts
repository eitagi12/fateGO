import { Component, OnInit } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE, ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-omni-new-register-face-confirm-page',
  templateUrl: './omni-new-register-face-confirm-page.component.html',
  styleUrls: ['./omni-new-register-face-confirm-page.component.scss']
})
export class OmniNewRegisterFaceConfirmPageComponent implements OnInit {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private translation: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
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
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE]);
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
          this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
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

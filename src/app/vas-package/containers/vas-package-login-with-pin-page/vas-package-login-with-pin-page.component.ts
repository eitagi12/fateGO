import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';

@Component({
  selector: 'app-vas-package-login-with-pin-page',
  templateUrl: './vas-package-login-with-pin-page.component.html',
  styleUrls: ['./vas-package-login-with-pin-page.component.scss']
})
export class VasPackageLoginWithPinPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  transaction: any;
  mobileNo: string = '';
  isRom: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.getRomByUser();
    this.createForm();
  }

  private getRomByUser(): any {
    this.http.get(`/api/easyapp/get-rom-by-user?username=${this.tokenService.getUser().username}`).toPromise()
      .then((res: any) => {
        if (res.data.length > 0) {
          this.mobileNo = res.data.mobileNo;
          this.isRom = true;
        }
      });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      mobileNo: [
        this.mobileNo, [Validators.required]],
      pin: [
        '', [Validators.required]]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  public genTransactionId(): any {
    return moment().format('YYYYMMDDHHmmssSSS');
  }

  onNext(): void {
    const data = {
      transactionid: this.genTransactionId(),
      mobile_no_agent: this.loginForm.value.mobileNo,
      // tslint:disable-next-line: max-line-length
      device_id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0'
    };
    this.http.post(`/api/customerportal/rom/get-profile`, data).toPromise()
      .then((res: any) => {
        if (res.data.status === 'success') {
          this.transaction.data.customer = {
            agentId: res.data.agentId,
          };
          const customerData: any = {
            transactionid: this.genTransactionId(),
            deviceos: 'Android',
            deviceversion: '5.1.1',
            mobile_no_agent: this.loginForm.value.mobileNo,
            // tslint:disable-next-line: max-line-length
            deviceid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJST00gTW9iaWxlIGFwaSIsImF1ZCI6Imh 0dHBzOi8vbXlyb20uYWlzLmNvLnRoL0FQSS9W MS9zaWdpbiIsInN1YiI6IjA0Ni1iNTc2Mjc4ZC1j MTY4LTQ5YjMtOWYxZi1jODVhYTc4YjgwYzAiL CJtc2lzZG4iOiIwNjIyNDM0MjA4IiwiYWdlbnRpZ CI6IjYyMzgxNDciLCJpYXQiOjE1Mzc0MzE3NjAsI mV4cCI6MTUzNzQzMjY2MH0.kY85wPWDSxy1ll rpejMRJrtKC_PE6F_7fuTMg5y-ZS0 ',
            pin: this.loginForm.value.pin
          };
          return this.http.post(`/api/customerportal/rom/sign-in`, customerData).toPromise()
            .then((status: any) => {
              if (status.data.status === 'success') {
                this.transaction.data.customer = {
                  mobileNo: this.loginForm.value.mobileNo,
                  pin: this.loginForm.value.pin
                };
                if (this.isRom) {
                  this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
                }
                this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
              } else {
                this.alertService.error(status.data.message);
              }

            })
            .catch(err => console.log('err: ', err.data.message));
        } else {
          this.alertService.error(res.data.message);
        }
      })
      .catch(error => console.log('error => ', error.data.message));
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

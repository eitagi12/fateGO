import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, TokenService, ChannelType, PersoSimService } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_RESULT_PAGE,
  ROUTE_OMNI_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_CONFIRM_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

export interface OptionPersoSim {
  key_sim?: boolean;
  scan_sim?: boolean;
}
@Component({
  selector: 'app-omni-new-register-perso-sim-page',
  templateUrl: './omni-new-register-perso-sim-page.component.html',
  styleUrls: ['./omni-new-register-perso-sim-page.component.scss']
})
export class OmniNewRegisterPersoSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  data: any = {
    MobileNo: '0891232519'
  };

  title: string;
  isManageSim: boolean;
  persoSimSubscription: Subscription;
  errorMessage: string;
  persoSim: any;

  transaction: Transaction;
  option: OptionPersoSim;
  persoSimConfig: any;

  koiskApiFn: any;
  readonly ERROR_PERSO: string = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก';
  readonly ERROR_PERSO_PC: string = 'ไม่สามารถ Perso Sim ได้';

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private persoSimService: PersoSimService,
    private translateService: TranslateService
  ) {
    this.option = { scan_sim: true, key_sim: false };
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.data.MobileNo) {
      this.setConfigPersoSim().then(() => {
        // if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
        //   this.persoSimKoisk();
        // } else {
          this.persoSimWebsocket();
        // }
      });
    } else {
      this.router.navigate([]);
    }
  }

 persoSimWebsocket(): void {
    // for pc
    this.title = 'กรุณาเสียบ Sim Card';
     this.persoSimSubscription = this.persoSimService.onPersoSim(this.persoSimConfig).subscribe((persoSim: any) => {
      this.persoSim = persoSim;
      if (persoSim.persoData && persoSim.persoData.simSerial) {
        this.title = 'กรุณาดึงซิมการ์ด';
        this.transaction.data.simCard.simSerial = persoSim.persoData.simSerial;
        this.onNext();
      }
      if (persoSim.error) {
        this.errorMessage = this.ERROR_PERSO;
        this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
      }
    });
 }

 async setConfigPersoSim(): Promise<any> {
  return this.persoSimConfig = await {
    serviceGetPrivateKey: () => {
      return this.http.post('/api/customerportal/newRegister/getPrivateKeyCommand', {
        params: { }
      }).toPromise();
    },
    serviceGetPersoDataCommand: (serialNo: string, indexNo: string)  => {
      return this.http.get('/api/customerportal/newRegister/queryPersoData', {
        params: {
          indexNo: indexNo,
          serialNo: serialNo,
          mobileNo: this.data.MobileNo,
          simService: 'Normal',
          sourceSystem: 'MC-KIOSK'
        }
      }).toPromise();
    },
    serviceCreateOrderPersoSim: (refNo: string) => {
      return this.http.get('/api/customerportal/newRegister/createPersoSim', {
        params: {
          refNo: refNo
        }
      }).toPromise();
    },
    serviceCheckOrderPersoSim: (refNo: string) => {
      return this.http.get('/api/customerportal/newRegister/checkOrderStatus', {
        params: {
          refNo: refNo
        }
      }).toPromise();
    }
    };
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    window.location.href = `/sales-portal/reserve-stock/receive-confirm-online`;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    if (this.koiskApiFn) {
      this.koiskApiFn.close();
    }
  }

}

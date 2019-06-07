import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AlertService, TokenService, ChannelType, PersoSimService, PersoSimConfig, PersoSimError, KioskControlsPersoSim, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { environment } from 'src/environments/environment';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';

export interface OptionPersoSim {
  key_sim?: boolean;
  scan_sim?: boolean;
}

@Component({
  selector: 'app-device-order-ais-new-register-perso-sim-page',
  templateUrl: './device-order-ais-new-register-perso-sim-page.component.html',
  styleUrls: ['./device-order-ais-new-register-perso-sim-page.component.scss']
})
export class DeviceOrderAisNewRegisterPersoSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  title: string;
  isManageSim: boolean;
  persoSimSubscription: Subscription;
  errorMessage: string;
  persoSim: any;

  transaction: Transaction;
  option: OptionPersoSim;
  persoSimConfig: PersoSimConfig;
  shoppingCart: ShoppingCart;

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
    private shoppingCartService: ShoppingCartService,
    private translateService: TranslateService
  ) {
    this.option = { scan_sim: true, key_sim: false };
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.transaction.data.simCard.mobileNo) {
      this.setConfigPersoSim().then(() => {
        if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
          this.persoSimKoisk();
        } else {
          this.persoSimWebsocket();
        }
      });
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_BY_PATTERN_PAGE]);
    }
  }

  persoSimKoisk(): void {
    this.title = 'กำลังเตรียมซิมใหม่';

    this.koiskApiFn = this.kioskApi();
    this.koiskApiFn.connect().then(() => {
      this.koiskApiFn.loadSim().then(() => {
        this.koiskApiFn.controls(KioskControlsPersoSim.LED_ON);

        this.persoSimSubscription = this.persoSimService.onPersoSim(this.persoSimConfig).subscribe((persoSim: any) => {
          this.persoSim = persoSim;
          if (persoSim.persoData && persoSim.persoData.simSerial) {
            this.title = 'กรุณาดึงซิมการ์ด';
            this.transaction.data.simCard.simSerial = persoSim.persoData.simSerial;
            this.koiskApiFn.controls(KioskControlsPersoSim.EJECT_CARD);
            this.koiskApiFn.controls(KioskControlsPersoSim.LED_BLINK);
            this.koiskApiFn.removedState().subscribe((removed: boolean) => {
              if (removed) {
                this.koiskApiFn.controls(KioskControlsPersoSim.LED_OFF);
                this.onNext();
              }
            });
          }

          if (persoSim.error) {
            console.error(persoSim.error);
            this.errorMessage = this.ERROR_PERSO;
            this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
            this.koiskApiFn.close();
          }
        });
      }).catch((err) => {
        this.errorMessage = this.ERROR_PERSO;
        this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
        console.error(err);
      });
    }).catch((err) => {
      this.errorMessage = this.ERROR_PERSO;
      this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
      console.error(err);
    });
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
          mobileNo: this.transaction.data.simCard.mobileNo,
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

 kioskApi(): any {
  if (!WebSocket) {
    return {};
  }

  let ws: any;

  return {
    connect: (): Promise<any> => {
      return new Promise((resolve, reject) => {
        ws = new WebSocket(`${environment.WEB_CONNECT_URL}/VendingAPI`);
        ws.onopen = () => {
          resolve('Success');
        };
        ws.onerror = () => {
          reject(PersoSimError.ERROR_WEB_SOCKET);
        };
      });
    },
    controls: (commandName: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        ws.send(commandName);
         ws.onmessage = (event: any) => {
           const message = JSON.parse(event.data);
            resolve(message);
        };
      });
    },
    removedState: (): Observable<boolean> => {
      return new Observable((obs) => {
        const cardStateInterval = setInterval(() => {
          ws.send(KioskControlsPersoSim.GET_CARD_STATE);
          let isNoCardInside;
          ws.onmessage = (event: any) => {
            const msg = JSON.parse(event.data);
            isNoCardInside = msg && msg.Result === 'No card inside reader unit';
            if (isNoCardInside) {
              clearInterval(cardStateInterval);
            }
            obs.next(isNoCardInside);
          };
          if (isNoCardInside) {
            obs.complete();
            clearInterval(cardStateInterval);
          }
        }, 1000);
      });
    },
    loadSim: () => {
      return new Promise((resolve, reject) => {
        ws.send(KioskControlsPersoSim.CHECK_SIM_INVENTORY);
        ws.onmessage = (event: any) => {
          const msg = JSON.parse(event.data);
          switch (msg.Command) {
            case KioskControlsPersoSim.CHECK_SIM_INVENTORY:
                const isSimInventory = msg
                && msg.Result !== 'Card Stacker 1 is empty | Card Stacker 2 is empty';
                if (isSimInventory) {
                  ws.send(KioskControlsPersoSim.GET_CARD_STATE);
                } else {
                  reject(PersoSimError.EVENT_CONNECT_SIM_EMTRY);
                }
            break;
            case KioskControlsPersoSim.GET_CARD_STATE:
                const isCardNotInIC = msg && msg.Result === 'No card inside reader unit';
                if (isCardNotInIC) {
                  ws.send(KioskControlsPersoSim.LOAD_SIM);
                } else {
                  resolve(msg.Result);
                }
            break;
            case KioskControlsPersoSim.LOAD_SIM:
                if (msg.Result === 'Success') {
                  resolve(msg.Result);
                } else {
                  reject(PersoSimError.ERROR_CARD_DISPENSER);
                }
            break;
          }
       };
      });
    },
    close: () => {
      ws.send(KioskControlsPersoSim.LED_OFF);
      ws.send(KioskControlsPersoSim.KEEP_SIM);
      ws.onmessage = (event: any) => {
        ws.close();
      };
    }
  };
}

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE]);
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

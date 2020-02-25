import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import {
  ShoppingCart,
  HomeService,
  //  TokenService,
  //  AlertService,
  //  PersoSimService,
  //  ChannelType,
  //  KioskControlsPersoSim,
  //  PersoSimError,
  PageLoadingService,
  AlertService,
  TokenService,
  User,
  PersoSimService,
  PersoSimConfig
} from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
// import { TranslateService } from '@ngx-translate/core';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE
} from '../../constants/route-path.constant';
// import { environment } from 'src/environments/environment';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { Validators, FormBuilder } from '@angular/forms';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

export interface OptionPersoSim {
  key_sim?: boolean;
  scan_sim?: boolean;
}

export enum PersoSimCommandEvent {
  EVENT_CONNECT_LIB = '9000',
  EVENT_CHECK_CARD_STATUS = '0',
  EVENT_CONNECT_SIM_READER = '1',
  EVENT_READ_SIM = '4',
  EVENT_PERSO_SIM = '5'
}

declare let window: any;

@Component({
  selector: 'app-new-register-mnp-perso-sim-master-page',
  templateUrl: './new-register-mnp-perso-sim-master-page.component.html',
  styleUrls: ['./new-register-mnp-perso-sim-master-page.component.scss']
})
export class NewRegisterMnpPersoSimMasterPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  // aisNative: any = window.aisNative;

  intervalCheckSimPresent: any;

  title: string;
  isManageSim: boolean;
  persoSimSubscription: any;
  errorMessage: string;
  persoSim: any;
  transaction: Transaction;
  option: OptionPersoSim;
  persoSimConfig: PersoSimConfig;
  shoppingCart: ShoppingCart;
  koiskApiFn: any;
  readonly ERROR_PERSO: string = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก';
  readonly ERROR_PERSO_PC: string = 'ไม่สามารถ Perso Sim ได้';
  masterSimCard: any;
  xmlDoc: any;
  getBarcode: any;
  checkOrderCounter: number = 0;
  check: number = 0;
  getCommandCounter: boolean = false;
  scanBarcodePC$: Observable<boolean> = of(true);
  public disableBack: any = false;
  command: number = 2;
  simSerialKeyIn: string;
  mobileNo: string;
  lastStatus: boolean;
  gotCardData: boolean;
  readSimStatus: string;
  persoSimInterval: any;
  statusFixSim: string = 'waitingForCheck';
  serialbarcode: string;
  checktSimInfoFn: any;
  simInfoAPI: string;
  persoSimAPI: string;
  checkCreatePersoSimAPI: string;
  orderType: string = 'New Registation';
  cardStatus: string;
  currentStatus: boolean;
  timeoutReadSim: any;
  referenceNumber: string;
  timeoutCheckOrderStatus: any;
  timeoutCreatePersoSim: any;
  timeoutPersoSim: any;
  isStateStatus: string = 'waitingFixSim';
  getSerialNo: string;
  queryPersoDataFn: any;
  eCommand: any;
  showCommand: any;
  checkOrderStatusFn: any;
  duration: 250;
  persoSimCounter: boolean;
  checkCreatedPersoSimFn: any;
  createTxPersoCounter: number = 0;
  minLength: number = 13;
  isNext: boolean = false;
  locationCode: string;
  priceOption: PriceOption;
  user: User;

  simPresentSubscription: Subscription;
  checkStatusSim: string;
  simProgress: number;
  simStatus: any;
  persoSimConfig2: any;

  ws: any = new WebSocket(`${environment.WEB_CONNECT_URL}/SIMManager`);
  public simSerialForm: any = this.fb.group({
    simSerial: ['', [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.minLength),
      Validators.pattern('^[0-9]*$')
    ]]
  });

  constructor(
    private router: Router,
    public homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private zone: NgZone,
    private pageLoadingService: PageLoadingService,
    public fb: FormBuilder,
    private removeCartService: RemoveCartService,
    private queuePageService: QueuePageService,
    public tokenService: TokenService,
    public priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService,
    private persoSimService: PersoSimService,
    private translateService: TranslateService
  ) {
    this.option = { scan_sim: true, key_sim: false };
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    this.transaction = this.transactionService.load();
    this.locationCode = tokenService.getUser().locationCode;
    this.priceOption = priceOptionService.load();
    this.user = tokenService.getUser();
  }

  ngOnInit(): void {

    this.masterSimCard = this.transaction.data.simCard;
    this.mobileNo = this.masterSimCard.mobileNo;
    this.createForm();

    this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
      if (value && value.length === 13) {
        this.verifySimSerialByBarcode(value);
      }
    });
    if (this.transaction.data.simCard.mobileNo && this.transaction.data.simCard.persoSim === true) {
      this.setConfigPersoSim().then((res: any) => {
        this.persoSimWebsocket();
      });
    }

    // this.onChecSim();
  }

  persoSimWebsocket(): any {
    // for pc
    this.persoSimSubscription = this.persoSimService.onPersoSim(this.persoSimConfig).subscribe((persoSim: any) => {
      this.persoSim = persoSim;
      this.simProgress = persoSim.progress;
      if (persoSim.persoData && persoSim.persoData.simSerial) {
        this.transaction.data.simCard.simSerial = persoSim.persoData.simSerial;
        this.currentStatus = false;
        this.isNext = !this.currentStatus;
        this.popupControl('perSoSuccess', 'Perso Sim สำเร็จ');
      }
      if (persoSim.error) {
        let errorMessage = '';
        const mobileNo = this.transaction.data.simCard.mobileNo;
        if (this.simProgress === 30) {
          errorMessage = 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่';
          this.popupControl('errorSim', errorMessage);
        } else {
          errorMessage = 'ขออภัยค่ะ ไม่สามารถทำรายการได้ กรุณาเสียบซิมการ์ด';
          this.popupControl('errorSmartCard', errorMessage);
        }
      }
    });
  }

  // onChecSim(): any {
  //   console.log('simProgress ====> >>>>>>>>>>>>');
  //   this.simStatus = this.persoSimFromWebSocket(this.persoSimConfig2).subscribe((res) => {
  //     console.log('|||||||||||||||::::', res);
  //     console.log('PPPPPPP', this.checkStatusSim);
  //     if (this.checkStatusSim === 'Connected') {
  //       this.isNext = false;
  //       console.log('Still connecting...');
  //     } else {
  //       // clearInterval(this.simStatus);
  //       // this.simStatus.unsubscribe();
  //     }
  //   });
  // }

  async setConfigPersoSim(): Promise<any> {
    return this.persoSimConfig = await {
      serviceGetPrivateKey: () => {
        return this.http.post('/api/customerportal/newRegister/getPrivateKeyCommand', {
          params: {}
        }).toPromise();
      },
      serviceGetPersoDataCommand: (serialNo: string, indexNo: string) => {
        return this.http.get('/api/customerportal/newRegister/queryPersoData', {
          params: {
            indexNo: indexNo,
            serialNo: serialNo,
            mobileNo: this.transaction.data.simCard.mobileNo,
            simService: 'Normal'
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

  persoSimFromWebSocket(persoSimConfig: PersoSimConfig): any {
    console.log('persoSimConfig --->', persoSimConfig);
    return new Observable(observer => {
      if (!WebSocket) {
        observer.next({
          // error: this.ERROR_BROWSER_NOT_SUPPORTED
        });
        return;
      }

      this.persoSimConfig2 = persoSimConfig;

      const data: any = {
        progress: 0,
        persoData: null,
        error: null,
        eventName: null
      };

      // config sim perso
      const timeOutCardPresent = 15;
      let checkCardPresent = 0;

      // interval
      this.ws.onmessage = evt => {

        const msg = JSON.parse(evt.data);
        this.checkStatusSim = msg.Result;
        switch (msg.Command) {
          case PersoSimCommandEvent.EVENT_CONNECT_LIB:
            data.progress = 0;
            data.eventName = PersoSimCommandEvent.EVENT_CONNECT_LIB;
            this.checkSimPresent(this.ws);
            break;
          case PersoSimCommandEvent.EVENT_CONNECT_SIM_READER:
            data.progress = 0;
            data.eventName = PersoSimCommandEvent.EVENT_CONNECT_SIM_READER;
            if (msg.Result === 'Connected' || msg.Result === 'Present') {
              this.isNext = true;
              clearInterval(this.intervalCheckSimPresent);
              observer.next({ progress: 10 });
              // this.readSim(ws);
            } else {
              this.isNext = false;
              if (++checkCardPresent > timeOutCardPresent) {
                clearInterval(this.intervalCheckSimPresent);
                // data.error = PersoSimError.EVENT_CONNECT_SIM_EMTRY + ': SIM CARD not found';
              }
            }
            break;
          // case PersoSimCommandEvent.EVENT_READ_SIM:
          //     data.progress = 30;
          //     data.eventName = PersoSimCommandEvent.EVENT_READ_SIM;
          //     const serialSim = msg.Result.split('|||');
          //     if (serialSim[0] === 'TRUE') {
          //       simSerial = serialSim[1].slice(6);
          //       this.getPersoDataCommand(serialSim[1].slice(6), serialSim[3])
          //         .then((dataPerso: any) => {
          //           sk = dataPerso.sk;
          //           refNo = dataPerso.refNo;
          //           eCommand = dataPerso.eCommand;
          //           this.persoSim(ws, eCommand);
          //         }).catch((err) => {
          //           data.error = PersoSimError.ERROR_SERVICE_GET_PERSO_COMMAND + ': ' + err;
          //           observer.next(data);
          //         });
          //     } else {
          //       data.error = PersoSimError.ERROR_READ_SIM;
          //     }
          //   break;
          // case PersoSimCommandEvent.EVENT_PERSO_SIM:
          //     data.progress = 60;
          //     data.eventName = PersoSimCommandEvent.EVENT_PERSO_SIM;
          //     const persoStatus = msg.Result.split('|||');
          //     if (persoStatus[0] === 'TRUE') {
          //       this.getOrderPersoSim(refNo).then(() => {
          //           data.progress = 80;
          //           data.eventName = PersoSimCommandEvent.EVENT_PERSO_SIM;
          //           observer.next(data);
          //           this.checkOrderPersoSim(refNo).then(() => {
          //               // persoSim เสร็จ
          //               data.persoData = { eCommand: eCommand, refNo: refNo, simSerial: simSerial, sk: sk};
          //               data.progress = 100;
          //               data.eventName = PersoSimCommandEvent.EVENT_PERSO_SIM;
          //               observer.next(data);

          //             }).catch(() => {
          //               data.error = PersoSimError.ERROR_SERVICE_CHECK_ORDER;
          //             });
          //         }).catch((err) => {
          //           data.eventName = PersoSimCommandEvent.EVENT_PERSO_SIM;
          //           data.error = PersoSimError.ERROR_SERVICE_CREATE_ORDER + ': ' + err;
          //           observer.next(data);
          //         });
          //     } else {
          //       data.error = PersoSimError.ERROR_WRITE_SIM;
          //     }
          //   break;
        }

        observer.next(data);
      };

      this.ws.onopen = () => {
        this.persoSimConfig2.serviceGetPrivateKey()
          .then((result: any) => {
            // Connect lib
            this.ws.send(
              JSON.stringify({
                Command: PersoSimCommandEvent.EVENT_CONNECT_LIB,
                Parameter: result.data.privateKey
              })
            );
          })
          .catch((err) => {
            const errRespon = err.error.developerMessage || '';
            // data.error = PersoSimError.ERROR_SERVICE_GET_PRIVATE_KEY + ': ' + errRespon;
            observer.next(data);
          });
      };

      this.ws.onerror = evt => {
        // data.error = PersoSimError.ERROR_WEB_SOCKET + ': WebSocket connection error to /SIMManager';
        observer.next(data);
      };
    });
  }

  checkSimPresent(ws: any): any {
    this.intervalCheckSimPresent = setInterval(() => {
      ws.send(
        JSON.stringify({
          Command: PersoSimCommandEvent.EVENT_CONNECT_SIM_READER,
          Parameter: ''
        })
      );
    }, 3000);
  }

  verifySimSerialByBarcode(barcode: string): void {
    this.simSerialKeyIn = barcode;
    this.checkBarcode(this.simSerialKeyIn, false);
  }

  setIntervalSimCard(): void {
    this.persoSim = { progress: 0, eventName: 'กรุณารอสักครู่' };
  }

  checkBarcode(barcode: string, isScan: boolean): void {
    let errorCode: string;
    let returnMessage: string;
    let errMegFixSim: string;
    // this.simSerialKeyIn = barcode;

    if (this.simSerialForm.controls['simSerial'].valid && this.orderType !== 'Port - In') {
      this.checktSimInfoFn = this.getChecktSimInfo(this.mobileNo, barcode);
      // console.log(' this.checktSimInfoFn ------->',  this.checktSimInfoFn);
      this.checktSimInfoFn.then((simInfo: any) => {
        // console.log('simInfo --->', simInfo);
        this.pageLoadingService.openLoading();
        // console.log('::: Mobile Info Insert SIM :::', simInfo.data);

        errorCode = simInfo.data.returnCode;
        returnMessage = simInfo.data.returnMessage;

        if (errorCode === '003' || errorCode === '005') {
          this.pageLoadingService.closeLoading();
          this.popupControl('errorSimStatus', '');
        } else if (errorCode === '004') {
          this.pageLoadingService.closeLoading();
          this.statusFixSim = 'WaitingForPerso';
          this.serialbarcode = barcode;
          this.onRefreshPageToPerso();
        } else if (errorCode === '006') {
          this.pageLoadingService.closeLoading();
          errMegFixSim = 'ซิมใบนี้ไม่สามารถทำรายการได้ เนื่องจาก Region ซิมไม่ตรงกับเบอร์ที่เลือก เบอร์ '
            + this.mobileNo + ' กรุณาเปลี่ยนซิมใหม่';
          this.popupControl('errorFixSim', errMegFixSim);
        } else if (errorCode === '008') {
          const simSerial: string = this.simSerialForm.controls.simSerial.value;
          if (simSerial.length === 13) {
            this.isNext = true;
          } else {
            this.isNext = false;
          }
          this.isNext = true;
          // this.checkStatusSimCard();
          this.pageLoadingService.closeLoading();
          this.statusFixSim = 'Success';
        } else if (errorCode === '001' || errorCode === '002' || errorCode === '007') {
          this.pageLoadingService.closeLoading();
          errMegFixSim = returnMessage + ' (code : ' + errorCode + ')';
          this.popupControl('errorFixSim', errMegFixSim);
        }

      }).catch((err: any) => {
        this.pageLoadingService.closeLoading();
        this.popupControl('errorFixSim', err);
      });
    } else {
      this.statusFixSim = 'waitingForCheck';
    }
  }

  checkSimCardStatus(): void {
    const getCardStatus: number = 1000;
    const showDialog: number = 1003;
    // this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
    if (this.cardStatus === 'Card presented') {
      this.currentStatus = true;
      clearInterval(this.persoSimInterval);
      // this.stateMessageControl('read');
    } else {
      this.currentStatus = false;
    }

    if (this.currentStatus && !this.lastStatus) {
      // this.aisNative.sendIccCommand(this.command, showDialog, ''); //Show dialogReadSim
      // On card inserted
      this.gotCardData = false;
      this.lastStatus = true;
    }

    if (this.lastStatus) {
      if (!this.gotCardData) {
        const delayTime: number = 1000;
        this.timeoutReadSim = setTimeout(() => {
          this.readSimForPerso();
        }, delayTime);
      }
    }
  }

  // checkStatusSimCard(): void {
  //   clearInterval(this.persoSimInterval);
  //   const intervalTime: number = 3000;
  //   this.persoSimInterval = setInterval(() => {
  //     this.checkSimStatus();
  //   }, intervalTime); // Timer
  // }

  // checkSimStatus(): void {
  //   const getCardStatus: number = 1000;
  //   this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
  //   if (this.cardStatus === 'Card presented') {
  //     this.isNext = false;
  //     this.currentStatus = true;
  //   } else {
  //     this.isNext = true;
  //     this.currentStatus = false;
  //     clearInterval(this.persoSimInterval);
  //   }
  // }

  popupControl(isCase: string, errMsg: string): void {

    switch (isCase) {
      case 'errorSim': {
        this.alertService.notify({
          type: 'error',
          text: 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่',
          confirmButtonText: 'ตกลง',
          onClose: () => this.persoSimWebsocket()
        });
      } break;
      case 'errorCmd': {
        this.alertService.notify({
          type: 'error',
          text: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง',
          confirmButtonText: 'RETRY',
          onClose: () => this.getCommandForPersoSim(this.readSimStatus)
        });
      } break;
      case 'errPerso': {
        this.alertService.notify({
          type: 'error',
          text: 'ไม่สามารถทำการ Perso SIM ได้ กรุณาทำรายการใหม่อีกครั้ง',
          confirmButtonText: 'MAIN MENU',
          onClose: () => this.onHome()
        });
      } break;
      case 'errorOrder': {
        this.alertService.notify({
          type: 'error',
          text: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง',
          confirmButtonText: 'RETRY',
          onClose: () => this.checkOrderStatus(this.referenceNumber)
        });
      } break;
      case 'errorSmartCard': {
        this.alertService.notify({
          type: 'error',
          text: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ กรุณาเสียบซิมการ์ด',
          confirmButtonText: 'ตกลง',
          onClose: () => this.persoSimWebsocket()
        });
      } break;
      case 'errorSimStatus': {
        this.alertService.notify({
          type: 'error',
          text: 'ซิมใบนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนซิมใหม่',
          confirmButtonText: 'ตกลง',
          onClose: () => this.onRefreshPage()
        });
      } break;
      case 'errorFixSim': {
        this.alertService.notify({
          type: 'error',
          text: errMsg,
          confirmButtonText: 'ตกลง',
          onClose: () => this.onRefreshPage()
        });
      } break;
      case 'errorSimSerialNotMacth': {
        this.alertService.question(errMsg, 'ตกลง', 'ยกเลิก').then((response: any) => {
          if (response.value === true) {
            this.onConectToPerso();
          } else {
            this.onRefreshPageToPerso();
          }
        });
      } break;
      case 'perSoSuccess': {
        this.alertService.success('Perso sim สำเร็จ กรุณาถอด ซิมการ์ด').then((response: any) => { });
      } break;
    }
  }

  onRefreshPageToPerso(): void {
    this.simSerialKeyIn = '';
    this.isStateStatus = 'read';
    this.setIntervalSimCard();
  }

  readSimForPerso(): void {
    const closeDialog: number = 1004;
    const readSim: number = 4;
    const cutNoSerialNumber: number = 6;
    let errMegFixSim: string;

    // this.readSimStatus = this.aisNative.sendIccCommand(this.command, readSim, '');  // readSim\\
    this.gotCardData = true;
    if (this.readSimStatus) {
      const simStatus: string[] = this.readSimStatus.split('|||');
      this.getSerialNo = simStatus[1].slice(cutNoSerialNumber);
      // this.aisNative.sendIccCommand(this.command, closeDialog, ''); //dismiss dialogReadSim
      if (this.getSerialNo) {
        this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
          simSerial: this.getSerialNo,
          persoSim: true
        });
      }
      if (simStatus[0].toLowerCase() === 'true') {
        // Progess 20%
        this.persoSim.progress = 20;
        // $('.custom').animate({ width: 20 + '%' }, this.duration, () => {/**/ });
        // this.getCommandForPersoSim(this.readSimStatus);
        if (this.statusFixSim === 'WaitingForPerso' && this.serialbarcode && this.orderType !== 'Port - In') {
          if (this.serialbarcode === this.getSerialNo) {
            this.verifySimRegionForPerso(this.getSerialNo);
          } else {
            errMegFixSim = 'เลขที่ซิมการ์ดใบนี้ ไม่ตรงกับที่ระบุ ('
              + this.serialbarcode + ') ยืนยันใช้ซิมใบนี้หรือไม่ (' + this.getSerialNo + ')';
            this.popupControl('errorSimSerialNotMacth', errMegFixSim);
          }
        } else {
          if (this.orderType !== 'Port - In') {
            this.verifySimRegionForPerso(this.getSerialNo);
          } else {
            this.getCommandForPersoSim(this.readSimStatus);
          }
        }

      } else {
        this.popupControl('errorSim', '');
      }
    }
  }

  getCommandForPersoSim(serialNo: string): void {
    const cutNoSerialNumber: number = 6;
    const indexPosition: number = 3;
    let getSerialNo: any = serialNo.split('|||');
    getSerialNo = getSerialNo[1].slice(cutNoSerialNumber);
    this.queryPersoDataFn = this.getPersoDataCommand(
      this.transaction.data.simCard.mobileNo,
      getSerialNo,
      serialNo.split('|||')[indexPosition],
      'Port - In' === this.orderType ? 'MNP-AWN' : 'Normal'
    );
    this.queryPersoDataFn.then((simCommand: any): void => {
      if (simCommand) {
        this.eCommand = simCommand.data.eCommand;
        const field: string[] = simCommand.data.eCommand.split('|||');
        const field1: number = 1;
        const field2: number = 2;
        const field3: number = 3;
        const field4: number = 4;

        const parameter: string =
          field[field1] + '|||' +
          field[field2] + '|||' +
          field[field3] + '|||' +
          field[field4] + '|||' +
          simCommand.data.sk;
        this.showCommand = parameter;
        this.referenceNumber = simCommand.data.refNo;
        const delayTime: number = 1000;
        this.timeoutPersoSim = setTimeout(() => {
          // Progess 40%
          this.persoSim.progress = 40;
          // $('.custom').animate({ width: 40 + '%' }, 0, () => {/**/ });
          this.persoSimCard(simCommand.data.refNo, parameter);
        }, delayTime);
      }
    }).catch((e: any): void => {
      // const errObj: any = e.json();
      // console.log('checkstatus errmes', errObj);
      if (this.check < 3) {
        if (!this.getCommandCounter) {
          this.popupControl('errorCmd', '');
          this.getCommandCounter = true;
          // console.log(this.popupControl('errorCmd', ''));
        } else {
          this.popupControl('errorSim', '');
          this.getCommandCounter = false;
          this.check++;
          // console.log(this.popupControl('errorSim', ''));
        }
      } else {
        this.popupControl('errPerso', '');
        this.getCommandCounter = false;
        this.check = 0;
      }
    });
  }

  checkOrderStatus(refNo: string): void {
    this.checkOrderStatusFn = this.getCheckOrderStatus(refNo);
    this.checkOrderStatusFn.then((order: any): void => {
      if (order) {
        if (order.data.orderStatus === 'Completed' && order.data.transactionStatus === 'Completed') {
          // Progess 100%
          this.persoSim.progress = 100;
          // $('.custom').animate({ width: 100 + '%' }, this.duration, () => {/**/ });
          setTimeout(() => {
          }, this.duration);
          // this.checkStatusSimCard();
        } else {
          const tenSecond: number = 90000;
          const loop: number = 3;
          if (this.checkOrderCounter < loop && this.check < loop) {
            this.timeoutCheckOrderStatus = setTimeout(() => {
              this.checkOrderStatus(refNo);
            }, tenSecond);
            this.checkOrderCounter++;
          } else if (this.checkOrderCounter === loop && this.check < loop) {
            this.popupControl('errorOrder', '');
            this.check++;
            this.checkOrderCounter++;
          } else if (this.check < loop) {
            this.popupControl('errorSim', '');
            this.check++;
            this.checkOrderCounter = 0;
          } else {
            this.popupControl('errPerso', '');
            this.checkOrderCounter = 0;
            this.check = 0;
          }
        }
      }
    }).catch((e: any): void => {
      const tenSecond: number = 90000;
      const loop: number = 3;
      if (this.checkOrderCounter < loop && this.check < loop) {
        this.timeoutCheckOrderStatus = setTimeout(() => {
          this.checkOrderStatus(refNo);
        }, tenSecond);
        this.checkOrderCounter++;
      } else if (this.checkOrderCounter === loop && this.check < loop) {
        this.popupControl('errorOrder', '');
        this.check++;
        this.checkOrderCounter++;
      } else if (this.check < loop) {
        this.popupControl('errorSim', '');
        this.check++;
        this.checkOrderCounter = 0;
      } else {
        this.popupControl('errPerso', '');
        this.checkOrderCounter = 0;
        this.check = 0;
      }
    });
  }

  createForm(): void {
    this.simSerialForm = this.fb.group({
      simSerial: ['', [
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  onBackSign(): void {
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
    this.onBack();
  }

  onRefreshPage(): void {
    this.simSerialKeyIn = '';
    this.statusFixSim = 'waitingForCheck';
    this.isStateStatus = 'waitingFixSim';
    this.setIntervalSimCard();
  }

  onConectToPerso(): void {
    this.verifySimRegionForPerso(this.getSerialNo);
  }

  verifySimRegionForPerso(serialNo: string): void {
    let errorCode: string;
    let returnMessage: string;
    let errMegFixSim: string;

    this.checktSimInfoFn = this.getChecktSimInfo(this.mobileNo, serialNo);
    this.checktSimInfoFn.then((simInfo: any) => {
      // this.pageLoadingService.openLoading();
      console.log('::: Mobile Info Read SIM ::: ', simInfo.data);

      errorCode = simInfo.data.returnCode;
      returnMessage = simInfo.data.returnMessage;

      if (errorCode === '003' || errorCode === '005') {
        this.pageLoadingService.closeLoading();
        this.popupControl('errorSimStatus', '');
      } else if (errorCode === '004') {
        this.pageLoadingService.closeLoading();
        console.log('Go to get command for Perso SIM');
        // this.getCommandForPersoSim(this.readSimStatus);
      } else if (errorCode === '006') {
        this.pageLoadingService.closeLoading();
        errMegFixSim = 'ซิมใบนี้ไม่สามารถทำรายการได้ เนื่องจาก Region ซิมไม่ตรงกับเบอร์ที่เลือก เบอร์ '
          + this.mobileNo + ' กรุณาเปลี่ยนซิมใหม่';
        this.popupControl('errorFixSim', errMegFixSim);
      } else if (errorCode === '008') {
        // Progess 100%
        this.persoSim.progress = 100;
        // $('.custom').animate({ width: 100 + '%' }, this.duration, () => {/**/ });
        this.pageLoadingService.closeLoading();
        this.isNext = true;
        // this.checkStatusSimCard();
        this.statusFixSim = 'Success';
      } else if (errorCode === '001' || errorCode === '002' || errorCode === '007') {
        this.pageLoadingService.closeLoading();
        errMegFixSim = returnMessage + ' (code : ' + errorCode + ')';
        this.popupControl('errorFixSim', errMegFixSim);
      }
    }).catch((err: any) => {
      this.pageLoadingService.closeLoading();
      this.popupControl('errorFixSim', err);
    });
  }

  persoSimCard(refNo: string, parameter: string): void {
    const perso: number = 5;
    const showDialog: number = 1001;
    const closeDialog: number = 1002;
    // this.aisNative.sendIccCommand(this.command, showDialog, ''); //show dialog Perso
    // const persoSimza = this.aisNative.sendIccCommand(this.command, perso, parameter); // perso Sim+
    // this.aisNative.sendIccCommand(this.command, closeDialog, ''); //dismiss dialog Perso
    // const persoSimStatus: string[] = persoSimza.split('|||');
    this.persoSim.progress = 60;
    // if (persoSimStatus[0].toLowerCase() === 'true') {
    //   this.createdPersoSim(refNo);
    // } else {
    //   if (!this.persoSimCounter) {
    //     this.persoSimCounter = true;
    //     this.getCommandForPersoSim(this.readSimStatus);
    //   } else {
    //     this.popupControl('errorSim', '');
    //   }
    // }
  }

  createdPersoSim(refNo: string): void {
    this.checkCreatedPersoSimFn = this.checkCreatePersoSim(refNo);
    this.checkCreatedPersoSimFn.then((create: any): void => {
      if (create) {
        if (create.data.success) {
          // Progess 80%
          this.persoSim.progress = 80;
          // $('.custom').animate({ width: 80 + '%' }, this.duration, () => {/**/ });
          this.checkOrderStatus(refNo);
        } else {
          const tenSecond: number = 60000;
          const loop: number = 3;
          if (this.createTxPersoCounter < loop) {
            this.timeoutCreatePersoSim = setTimeout(() => {
              this.createdPersoSim(refNo);
            }, tenSecond);
            this.createTxPersoCounter++;
          } else {
            this.popupControl('errorSim', '');
          }
        }
      }
    }).catch((e: any): void => {
      // const errObj: any = e.json();
      // console.log('full error :', errObj);
      // console.log('error :', errObj.errors);
      // console.log('data :', errObj.errors.data);
      const tenSecond: number = 60000;
      const loop: number = 3;
      if (this.createTxPersoCounter < loop) {
        this.timeoutCreatePersoSim = setTimeout(() => {
          this.createdPersoSim(refNo);
        }, tenSecond);
        this.createTxPersoCounter++;
      } else {
        this.popupControl('errorSim', '');
      }
    });
  }

  getChecktSimInfo(mobileNo: string, serialNo: string): Promise<any> {
    this.simInfoAPI = '/api/customerportal/newRegister/getCheckSimInfo';
    return this.http.post(this.simInfoAPI, { mobileNo: mobileNo, serialNo: serialNo }).toPromise();
  }

  getPersoDataCommand(mobileNo: string, serialNo: string, index: string, simService?: string): any {
    this.persoSimAPI = '/api/customerportal/newRegister/queryPersoData?mobileNo=' + mobileNo + '&serialNo='
      + serialNo + '&indexNo=' + index + '&simService=' + simService;
    return this.http.get(this.persoSimAPI).toPromise();
  }

  getCheckOrderStatus(refNo: string): any {
    const checkOrderStatusAPI = '/api/customerportal/newRegister/checkOrderStatus?refNo=' + refNo;
    return this.http.get(checkOrderStatusAPI).toPromise();
  }

  checkCreatePersoSim(refNo: string): any {
    this.checkCreatePersoSimAPI = '/api/customerportal/newRegister/createPersoSim?refNo=' + refNo;
    return this.http.get(this.checkCreatePersoSimAPI).toPromise();
  }

  saveFaceImage(): any {
    const user = this.tokenService.getUser();
    const customer = this.transaction.data.customer;
    const faceRecognition = this.transaction.data.faceRecognition;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const action = this.transaction.data.action;
    const channelKyc = this.transaction.data.faceRecognition.kyc;
    let channel = 'MC';
    if (channelKyc) {
      channel += '_KYC';
    }
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      channel += '_PT';
    } else {
      channel += '_SM';
    }
    let base64Card: any;
    if (action === TransactionAction.READ_CARD) {
      base64Card = customer.imageReadSmartCard;
    } else if (action === TransactionAction.READ_PASSPORT) {
      base64Card = customer.imageReadPassport;
    } else {
      base64Card = customer.imageSmartCard;
    }
    const param: any = {
      userId: user.username,
      locationCode: user.locationCode,
      idCardType: customer.idCardType === 'บัตรประชาชน' ? 'Thai National ID' : 'OTHER',
      customerId: customer.idCardNo || '',
      mobileNo: mobileNo || '',
      base64Card: base64Card ? `data:image/jpg;base64,${base64Card}` : '',
      base64Face: faceRecognition.imageFaceUser ? `data:image/jpg;base64,${faceRecognition.imageFaceUser}` : '',
      channel: channel,
      userchannel: 'MyChannel'
    };
    this.http.post('/api/facerecog/save-imagesV2', param).toPromise()
      .catch(e => {
        console.log(e);
        Promise.resolve(null);
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    this.saveFaceImage();
    if (!this.transaction.data.simCard.simSerial) {
      this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
        simSerial: this.simSerialForm.controls.simSerial.value,
        persoSim: true
      });
    }
    this.createOrderTDM();
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    if (this.transaction.data.simCard.mobileNo && this.transaction.data.simCard.persoSim === true) {
      this.persoSimSubscription.unsubscribe();
    }
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
  }

  // onOpenScanBarcode(): void {
  //   window.aisNative.scanBarcode();
  //   this.getBarcode = '';
  //   window.onBarcodeCallback = (barcode: any): void => {
  //     if (barcode && barcode.length > 0) {
  //       this.zone.run(() => {
  //         const parser: any = new DOMParser();
  //         barcode = '<data>' + barcode + '</data>';
  //         const xmlDoc = parser.parseFromString(barcode, 'text/xml');
  //         this.getBarcode = xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
  //         this.simSerialForm.controls.simSerial.setValue(this.getBarcode);
  //         this.verifySimSerialByBarcode(this.getBarcode);
  //       });
  //     }
  //   };
  // }

  onSerialNumberChanged(data?: any): void {
    this.statusFixSim = 'waitingForCheck';
  }

  createOrderTDM(): any {
    this.pageLoadingService.openLoading();
    if (this.locationCode) {
      this.queuePageService.getQueueAspAndTelewiz(this.locationCode)
        .then((res: any) => {
          this.transaction.data.queue = {
            queueNo: res.data.queue ? res.data.queue : ''
          };
          // console.log('getQueueAspAndTelewiz   ', res);
        })
        .then((res) => {
          return this.queuePageService.createDeviceSellingOrderListSPKASP(this.transaction, this.priceOption, this.user) // New Service Que
            .then((ress: any) => {
              // console.log('createDeviceSellingOrderListSPKASP', ress);
              return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
            });
        })
        .then((res) => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE]);
        }).catch((err) => {
          console.log(err);
        });
    }
  }

}

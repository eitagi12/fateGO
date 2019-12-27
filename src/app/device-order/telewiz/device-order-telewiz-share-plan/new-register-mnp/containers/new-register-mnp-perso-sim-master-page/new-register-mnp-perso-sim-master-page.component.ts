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
  AlertService
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
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';

export interface OptionPersoSim {
  key_sim?: boolean;
  scan_sim?: boolean;
}

declare let window: any;

@Component({
  selector: 'app-new-register-mnp-perso-sim-master-page',
  templateUrl: './new-register-mnp-perso-sim-master-page.component.html',
  styleUrls: ['./new-register-mnp-perso-sim-master-page.component.scss']
})
export class NewRegisterMnpPersoSimMasterPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  aisNative: any = window.aisNative;

  title: string;
  isManageSim: boolean;
  persoSimSubscription: Subscription;
  errorMessage: string;
  persoSim: any;

  transaction: Transaction;
  option: OptionPersoSim;
  persoSimConfig: any;
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

  public simSerialForm: any = this.fb.group({
    simSerial: ['', [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.minLength),
      Validators.pattern('^[0-9]*$')
    ]]
  });

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    // private tokenService: TokenService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    // private persoSimService: PersoSimService,
    private shoppingCartService: ShoppingCartService,
    // private translateService: TranslateService,
    private zone: NgZone,
    private pageLoadingService: PageLoadingService,
    public fb: FormBuilder,
    private removeCartService: RemoveCartService
  ) {
    this.option = { scan_sim: true, key_sim: false };
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.masterSimCard = this.transaction.data.simCard;
    this.createForm();
    this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
      if (value && value.length === 13) {
        this.verifySimSerialByBarcode(value);
      }
    });
    if (typeof window.aisNative !== 'undefined') {
      this.scanBarcodePC$ = of(true);
      window.onBarcodeCallback = (barcode: any): void => {
        if (barcode && barcode.length > 0) {
          this.zone.run(() => {
            const parser: any = new DOMParser();
            barcode = '<data>' + barcode + '</data>';
            this.xmlDoc = parser.parseFromString(barcode, 'text/xml');
            this.getBarcode = this.xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
            this.verifySimSerialByBarcode(this.getBarcode);
          });
        }
      };
    } else {
      this.scanBarcodePC$ = of(false);
    }

    this.checkOrderCounter = 0;
    this.getCommandCounter = false;
    this.mobileNo = this.masterSimCard.mobileNo;

    if (typeof this.aisNative !== 'undefined') {
      this.disableBack = true;
      const disConnectReadIdCard: number = 1;
      this.aisNative.sendIccCommand(this.command, disConnectReadIdCard, ''); // connect sim and disconnect smartCard
      this.setIntervalSimCard();
    }
  }

  verifySimSerialByBarcode(barcode: string): void {
    this.simSerialKeyIn = barcode;
    this.checkBarcode(this.simSerialKeyIn, false);
  }

  setIntervalSimCard(): void {
    // this.stateMessageControl('waiting');
    this.lastStatus = false;
    this.gotCardData = false;
    this.persoSim = '';
    this.readSimStatus = '';
    this.persoSim = { progress: 0, eventName: 'กรุณารอสักครู่' };
    // $('.custom').animate({ width: 0 + '%' }, this.duration, () => {/**/ });
    clearInterval(this.persoSimInterval);
    const intervalTime: number = 3000;
    this.persoSimInterval = setInterval(() => {
      this.checkSimCardStatus();
    }, intervalTime); // Timer
  }

  checkBarcode(barcode: string, isScan: boolean): void {
    let errorCode: string;
    let returnMessage: string;
    let errMegFixSim: string;
    // this.simSerialKeyIn = barcode;

    console.log('Mobile No :  ', this.mobileNo);
    console.log('Serial NO Insert :  ', barcode);

    if (this.simSerialForm.controls['simSerial'].valid && this.orderType !== 'Port - In') {
      this.checktSimInfoFn = this.getChecktSimInfo(this.mobileNo, barcode);
      this.checktSimInfoFn.then((simInfo: any) => {
        this.pageLoadingService.openLoading();
        console.log('::: Mobile Info Insert SIM :::', simInfo.data);

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
          this.checkStatusSimCard();
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
    this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
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

  checkStatusSimCard(): void {
    clearInterval(this.persoSimInterval);
    const intervalTime: number = 3000;
    this.persoSimInterval = setInterval(() => {
      this.checkSimStatus();
    }, intervalTime); // Timer
  }

  checkSimStatus(): void {
    const getCardStatus: number = 1000;
    this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
    if (this.cardStatus === 'Card presented') {
      this.isNext = false;
      this.currentStatus = true;
    } else {
      this.isNext = true;
      this.currentStatus = false;
      clearInterval(this.persoSimInterval);
    }
  }

  popupControl(isCase: string, errMsg: string): void {

    switch (isCase) {
      case 'errorSim': {
        this.alertService.notify({
          type: 'error',
          text: 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่',
          confirmButtonText: 'ตกลง',
          onClose: () => this.setIntervalSimCard()
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
          onClose: () => this.onRefreshPage()
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

    this.readSimStatus = this.aisNative.sendIccCommand(this.command, readSim, '');  // readSim\\
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
          this.checkStatusSimCard();
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
        this.getCommandForPersoSim(this.readSimStatus);
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
        this.checkStatusSimCard();
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
    const persoSimza = this.aisNative.sendIccCommand(this.command, perso, parameter); // perso Sim+
    // this.aisNative.sendIccCommand(this.command, closeDialog, ''); //dismiss dialog Perso
    const persoSimStatus: string[] = persoSimza.split('|||');
    this.persoSim.progress = 60;
    if (persoSimStatus[0].toLowerCase() === 'true') {
      this.createdPersoSim(refNo);
    } else {
      if (!this.persoSimCounter) {
        this.persoSimCounter = true;
        this.getCommandForPersoSim(this.readSimStatus);
      } else {
        this.popupControl('errorSim', '');
      }
    }
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    if (!this.transaction.data.simCard.simSerial) {
      this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
        simSerial: this.simSerialForm.controls.simSerial.value,
        persoSim: true
      });
    }
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
  }

  onOpenScanBarcode(): void {
    window.aisNative.scanBarcode();
    this.getBarcode = '';
    window.onBarcodeCallback = (barcode: any): void => {
      if (barcode && barcode.length > 0) {
        this.zone.run(() => {
          const parser: any = new DOMParser();
          barcode = '<data>' + barcode + '</data>';
          const xmlDoc = parser.parseFromString(barcode, 'text/xml');
          this.getBarcode = xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
          this.simSerialForm.controls.simSerial.setValue(this.getBarcode);
          this.verifySimSerialByBarcode(this.getBarcode);
        });
      }
    };
  }

  onSerialNumberChanged(data?: any): void {
    this.statusFixSim = 'waitingForCheck';
  }

}

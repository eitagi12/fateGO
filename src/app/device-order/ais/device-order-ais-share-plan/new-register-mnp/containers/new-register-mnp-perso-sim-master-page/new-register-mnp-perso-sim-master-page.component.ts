import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ShoppingCart,
         HomeService,
        //  TokenService,
        //  AlertService,
        //  PersoSimService,
        //  ChannelType,
        //  KioskControlsPersoSim,
        //  PersoSimError,
         PageLoadingService,
         AlertService} from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
// import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE,
         ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE
       } from '../../constants/route-path.constant';
// import { environment } from 'src/environments/environment';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { Validators, FormBuilder } from '@angular/forms';
import { Transaction } from 'src/app/shared/models/transaction.model';

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

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
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
  ) {
    this.option = { scan_sim: true, key_sim: false };
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.masterSimCard = this.transaction.data.simCard;
    this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
      this.verifySimSerialByBarcode(value);
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

  popupControl(isCase: string, errMsg: string): void {

    switch (isCase) {
      case 'errorSim' : {
        this.alertService.notify({
          type: 'error',
          text: 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่',
          confirmButtonText: 'ตกลง',
          onClose: () => this.setIntervalSimCard()
        });
      }break;
      case 'errorCmd' : {
        this.alertService.notify({
          type: 'error',
          text: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง',
          confirmButtonText: 'RETRY',
          onClose: () => this.getCommandForPersoSim(this.readSimStatus)
        });
      }break;
      case 'errPerso' : {
        this.alertService.notify({
          type: 'error',
          text: 'ไม่สามารถทำการ Perso SIM ได้ กรุณาเลือกเบอร์เพื่อทำรายการใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          // onClose: () => this.getCommandForPersoSim.bind(this, this.readSimStatus)
        });
      }break;
      case 'errorOrder' : {
        this.alertService.notify({
          type: 'error',
          text: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง',
          confirmButtonText: 'RETRY',
          onClose: () => this.checkOrderStatus(this.referenceNumber)
        });
      }break;
      case 'errorSmartCard' : {
        this.alertService.notify({
          type: 'error',
          text: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ กรุณาเสียบซิมการ์ด',
          confirmButtonText: 'ตกลง',
          onClose: () => this.onRefreshPage()
        });
      }break;
      case 'errorSimStatus' : {
        this.alertService.notify({
          type: 'error',
          text: 'ซิมใบนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนซิมใหม่',
          confirmButtonText: 'ตกลง',
          onClose: () => this.onRefreshPage()
        });
      }break;
      case 'errorFixSim' : {
        this.alertService.notify({
          type: 'error',
          text: errMsg,
          confirmButtonText: 'ตกลง',
          onClose: () => this.onRefreshPage()
        });
      }break;
      case 'errorSimSerialNotMacth' : {
        this.alertService.question(errMsg, 'ตกลง', 'ยกเลิก').then((response: any) => {
          if (response.value === true) {
            this.onConectToPerso();
          } else {
            this.onRefreshPageToPerso();
          }
        });
      }break;
    }

    // const errorCase: object = {
    //   errorSim: {
    //     customBtn: [
    //       {
    //         name: 'ตกลง',
    //         class: 'mc-button mc-button--green',
    //         function: this.setIntervalSimCard.bind(this)
    //       }
    //     ],
    //     message: 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่'
    //   },
    //   errorCmd: {
    //     customBtn: [{
    //       name: 'RETRY',
    //       class: 'mc-button mc-button--green',
    //       function: this.getCommandForPersoSim.bind(this, this.readSimStatus)
    //     }],
    //     message: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง'
    //   },
    //   errPerso: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onBack.bind(this)
    //     }],
    //     message: 'ไม่สามารถทำการ Perso SIM ได้ กรุณาเลือกเบอร์เพื่อทำรายการใหม่อีกครั้ง'
    //   },
    //   errorOrder: {
    //     customBtn: [{
    //       name: 'RETRY',
    //       class: 'mc-button mc-button--green',
    //       function: this.checkOrderStatus.bind(this, this.referenceNumber)
    //     }],
    //     message: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง'
    //   },
    //   errorCanNotGetPrivateKey: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onBackSign.bind(this)
    //     }],
    //     message: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ เนื่องจากเกิดข้อผิดพลาดจากการอ่านข้อมูลซิมการ์ด (code : 0404CN)'
    //   },
    //   errorPrivateKeyNotMath: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onBackSign.bind(this)
    //     }],
    //     message: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ เนื่องจากเกิดข้อผิดพลาดจากการอ่านข้อมูลซิมการ์ด (code : 0510NM)'
    //   },
    //   errorSmartCard: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onRefreshPage.bind(this)
    //     }],
    //     message: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ กรุณาเสียบซิมการ์ด'
    //   },
    //   errorSimStatus: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onRefreshPage.bind(this)
    //     }],
    //     message: 'ซิมใบนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนซิมใหม่'
    //   },
    //   errorFixSim: {
    //     customBtn: [{
    //       name: 'ตกลง',
    //       class: 'mc-button mc-button--green',
    //       function: this.onRefreshPage.bind(this)
    //     }],
    //     message: errMsg
    //   },
    //   errorSimSerialNotMacth: {
    //     customBtn: [
    //       {
    //         name: 'ยกเลิก',
    //         class: 'mc-button mc-button--green',
    //         function: this.onRefreshPageToPerso.bind(this)
    //       },
    //       {
    //         name: 'ตกลง',
    //         class: 'mc-button mc-button--green',
    //         function: this.onConectToPerso.bind(this)
    //       }],
    //     message: errMsg
    //   }
    // };

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
          simSerial: this.getSerialNo
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
      const errObj: any = e.json();
      console.log('checkstatus errmes', errObj);
      if (!this.getCommandCounter) {
        this.popupControl('errorCmd', '');
        this.getCommandCounter = true;
        // console.log(this.popupControl('errorCmd', ''));
      } else {
        this.popupControl('errorSim', '');
        this.getCommandCounter = false;
        // console.log(this.popupControl('errorSim', ''));
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
        } else {
          const tenSecond: number = 60000;
          const loop: number = 3;
          if (this.checkOrderCounter < loop) {
            this.timeoutCheckOrderStatus = setTimeout(() => {
              this.checkOrderStatus(refNo);
            }, tenSecond);
            this.checkOrderCounter++;
          } else if (this.checkOrderCounter === loop) {
            this.popupControl('errorOrder', '');
            this.checkOrderCounter++;
          } else {
            this.popupControl('errorSim', '');
            this.checkOrderCounter = 0;
          }
        }
      }
    }).catch((e: any): void => {
      const tenSecond: number = 60000;
      const loop: number = 3;
      if (this.checkOrderCounter < loop) {
        this.timeoutCheckOrderStatus = setTimeout(() => {
          this.checkOrderStatus(refNo);
        }, tenSecond);
        this.checkOrderCounter++;
      } else if (this.checkOrderCounter === loop) {
        this.popupControl('errorOrder', '');
        this.checkOrderCounter++;
      } else {
        this.popupControl('errorSim', '');
        this.checkOrderCounter = 0;
      }
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
      const errObj: any = e.json();
      console.log('full error :', errObj);
      console.log('error :', errObj.errors);
      console.log('data :', errObj.errors.data);
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
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    if (!this.transaction.data.simCard.simSerial) {
      this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
        simSerial: this.simSerialForm.controls.simSerial.value
      });
    }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
  }

  // persoSimKoisk(): void {
  //   this.title = 'กำลังเตรียมซิมใหม่';

  //   this.koiskApiFn = this.kioskApi();
  //   this.koiskApiFn.connect().then(() => {
  //     this.koiskApiFn.loadSim().then(() => {
  //       this.koiskApiFn.controls(KioskControlsPersoSim.LED_ON);

  //       this.persoSimSubscription = this.persoSimService.onPersoSim(this.persoSimConfig).subscribe((persoSim: any) => {
  //         this.persoSim = persoSim;
  //         if (persoSim.persoData && persoSim.persoData.simSerial) {
  //           this.title = 'กรุณาดึงซิมการ์ด';
  //           this.transaction.data.simCard.simSerial = persoSim.persoData.simSerial;
  //           this.koiskApiFn.controls(KioskControlsPersoSim.EJECT_CARD);
  //           this.koiskApiFn.controls(KioskControlsPersoSim.LED_BLINK);
  //           this.koiskApiFn.removedState().subscribe((removed: boolean) => {
  //             if (removed) {
  //               this.koiskApiFn.controls(KioskControlsPersoSim.LED_OFF);
  //               this.onNext();
  //             }
  //           });
  //         }

  //         if (persoSim.error) {
  //           console.error(persoSim.error);
  //           this.errorMessage = this.ERROR_PERSO;
  //           this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
  //           this.koiskApiFn.close();
  //         }
  //       });
  //     }).catch((err) => {
  //       this.errorMessage = this.ERROR_PERSO;
  //       this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
  //       console.error(err);
  //     });
  //   }).catch((err) => {
  //     this.errorMessage = this.ERROR_PERSO;
  //     this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
  //     console.error(err);
  //   });
  // }

  // persoSimWebsocket(): void {
  //   // for pc
  //   this.title = 'กรุณาเสียบ Sim Card';
  //   this.persoSimSubscription = this.persoSimService.onPersoSim(this.persoSimConfig).subscribe((persoSim: any) => {
  //     this.persoSim = persoSim;
  //     if (persoSim.persoData && persoSim.persoData.simSerial) {
  //       this.title = 'กรุณาดึงซิมการ์ด';
  //       this.transaction.data.simCard.simSerial = persoSim.persoData.simSerial;
  //     }
  //     if (persoSim.error) {
  //       this.errorMessage = this.ERROR_PERSO;
  //       this.alertService.error(this.translateService.instant(this.ERROR_PERSO));
  //     }
  //   });
  // }

  // async setConfigPersoSim(): Promise<any> {
  //   return this.persoSimConfig = await {
  //     serviceGetPrivateKey: () => {
  //       return this.http.post('/api/customerportal/newRegister/getPrivateKeyCommand', {
  //         params: {}
  //       }).toPromise();
  //     },
  //     serviceGetPersoDataCommand: (serialNo: string, indexNo: string) => {
  //       return this.http.get('/api/customerportal/newRegister/queryPersoData', {
  //         params: {
  //           indexNo: indexNo,
  //           serialNo: serialNo,
  //           mobileNo: this.masterSimCard.mobileNo,
  //           simService: 'Normal',
  //           sourceSystem: 'MC'
  //         }
  //       }).toPromise();
  //     },
  //     serviceCreateOrderPersoSim: (refNo: string) => {
  //       return this.http.get('/api/customerportal/newRegister/createPersoSim', {
  //         params: {
  //           refNo: refNo
  //         }
  //       }).toPromise();
  //     },
  //     serviceCheckOrderPersoSim: (refNo: string) => {
  //       return this.http.get('/api/customerportal/newRegister/checkOrderStatus', {
  //         params: {
  //           refNo: refNo
  //         }
  //       }).toPromise();
  //     }
  //   };
  // }

  // kioskApi(): any {
  //   if (!WebSocket) {
  //     return {};
  //   }

  //   let ws: any;

  //   return {
  //     connect: (): Promise<any> => {
  //       return new Promise((resolve, reject) => {
  //         ws = new WebSocket(`${environment.WEB_CONNECT_URL}/VendingAPI`);
  //         ws.onopen = () => {
  //           resolve('Success');
  //         };
  //         ws.onerror = () => {
  //           reject(PersoSimError.ERROR_WEB_SOCKET);
  //         };
  //       });
  //     },
  //     controls: (commandName: string): Promise<any> => {
  //       return new Promise((resolve, reject) => {
  //         ws.send(commandName);
  //         ws.onmessage = (event: any) => {
  //           const message = JSON.parse(event.data);
  //             resolve(message);
  //         };
  //       });
  //     },
  //     removedState: (): Observable<boolean> => {
  //       return new Observable((obs) => {
  //         const cardStateInterval = setInterval(() => {
  //           ws.send(KioskControlsPersoSim.GET_CARD_STATE);
  //           let isNoCardInside;
  //           ws.onmessage = (event: any) => {
  //             const msg = JSON.parse(event.data);
  //             isNoCardInside = msg && msg.Result === 'No card inside reader unit';
  //             if (isNoCardInside) {
  //               clearInterval(cardStateInterval);
  //             }
  //             obs.next(isNoCardInside);
  //           };
  //           if (isNoCardInside) {
  //             obs.complete();
  //             clearInterval(cardStateInterval);
  //           }
  //         }, 1000);
  //       });
  //     },
  //     loadSim: () => {
  //       return new Promise((resolve, reject) => {
  //         ws.send(KioskControlsPersoSim.CHECK_SIM_INVENTORY);
  //         ws.onmessage = (event: any) => {
  //           const msg = JSON.parse(event.data);
  //           switch (msg.Command) {
  //             case KioskControlsPersoSim.CHECK_SIM_INVENTORY:
  //                 const isSimInventory = msg
  //                 && msg.Result !== 'Card Stacker 1 is empty | Card Stacker 2 is empty';
  //                 if (isSimInventory) {
  //                   ws.send(KioskControlsPersoSim.GET_CARD_STATE);
  //                 } else {
  //                   reject(PersoSimError.EVENT_CONNECT_SIM_EMTRY);
  //                 }
  //             break;
  //             case KioskControlsPersoSim.GET_CARD_STATE:
  //                 const isCardNotInIC = msg && msg.Result === 'No card inside reader unit';
  //                 if (isCardNotInIC) {
  //                   ws.send(KioskControlsPersoSim.LOAD_SIM);
  //                 } else {
  //                   resolve(msg.Result);
  //                 }
  //             break;
  //             case KioskControlsPersoSim.LOAD_SIM:
  //                 if (msg.Result === 'Success') {
  //                   resolve(msg.Result);
  //                 } else {
  //                   reject(PersoSimError.ERROR_CARD_DISPENSER);
  //                 }
  //             break;
  //           }
  //       };
  //       });
  //     },
  //     close: () => {
  //       ws.send(KioskControlsPersoSim.LED_OFF);
  //       ws.send(KioskControlsPersoSim.KEEP_SIM);
  //       ws.onmessage = (event: any) => {
  //         ws.close();
  //       };
  //     }
  //   };
  // }
}

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { TokenService, ChannelType, AlertService, Utils } from 'mychannel-shared-libs';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE } from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

declare let $: any;
declare let window: any;

export enum PersoSimCommand {
  EVENT_CONNECT_LIB = 9000,
  EVENT_CHECK_CARD_STATUS = 0,
  EVENT_CONNECT_SIM_READER = 1,
  EVENT_READ_SIM = 4,
  EVENT_PERSO_SIM = 5
}

export enum PersoSimEvent {
  EVENT_CARD_LOAD_LIB = 'Load SIM library success',
  EVENT_CARD_PRESENT = 'Present',
  EVENT_CARD_CONNECTED = 'Connected',
  EVENT_CARD_DISCONNECTED = 'Disconnected'
}

export enum PersoSimCardStatus {
  EVENT_PERSO_SIM_SUCCESS = 'TRUE',
  EVENT_PERSO_SIM_FAIL = 'FALSE'
}

export enum ReadSimCardStatus {
  EVENT_READ_SIM_SUCCESS = 'TRUE',
  EVENT_READ_SIM_FAIL = 'FALSE'
}

export enum ControlSimCard {
  EVENT_CHECK_SIM_INVENTORY = 'GetSIMInventory',
  EVENT_CHECK_SIM_STATE = 'GetCardState',
  EVENT_CHECK_BIN_STATE = 'GetBinState',
  EVENT_LOAD_SIM_STACKER1 = 'LoadSIM|STACKER1',
  EVENT_LOAD_SIM_STACKER2 = 'LoadSIM|STACKER2',
  EVENT_KEEP_SIM = 'KeepCard',
  EVENT_RELEASE_SIM = 'ReleaseSIM'
}

export enum SIMCardStatus {
  INVENTORY_1_HAVE_CARD = 'Card Stacker 1 is unknown status',
  INVENTORY_2_HAVE_CARD = 'Card Stacker 2 is unknown status',
  INVENTORY_1_LESS_CARD = 'Card Stacker 1 is less card',
  INVENTORY_2_LESS_CARD = 'Card Stacker 2 is less card',
  INVENTORY_1_EMPTY_CARD = 'Card Stacker 1 is empty',
  INVENTORY_2_EMPTY_CARD = 'Card Stacker 2 is empty',
  STATUS_IN_IC = 'Card in IC position',
  STATUS_NO_CARD = 'No card inside reader unit',
}

export enum ControlLED {
  EVENT_LED_ON = 'ControlLED|On',
  EVENT_LED_OFF = 'ControlLED|Off',
  EVENT_LED_BLINK = 'ControlLED|Blink',
}

export enum ErrorPerSoSim {
  ERROR_SIM = 'errorSim',
  ERROR_CMD = 'errorCmd',
  ERROR_PERSO = 'errPerso',
  ERROR_ORDER = 'errorOrder',
  ERROR_PRIVATE_KEY = 'errorCanNotGetPrivateKey',
  ERROR_WEB_SOCKET = 'errorWebSocket',
  ERROR_SIM_EMPTY = 'errorSimEmpty'
}

export enum ErrorPerSoSimMessage {
  ERROR_SIM_MESSAGE = 'กรุณารอสักครู่ ระบบกำลังทำรายการ',
  ERROR_CMD_MESSAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก',
  ERROR_PERSO_MESSAGE = 'เบอร์นี้ถูกเลือกแล้ว กรุณาเลือกเบอร์ใหม่ เพื่อทำรายการ',
  ERROR_ORDER_MESSAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการขออภัยในความไม่สะดวก',
  ERROR_PRIVATE_KEY_MESSAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก',
  ERROR_WEB_SOCKET_MESSAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก',
  ERROR_SIM_EMPTY_MESSAGE = 'ไม่สามารถให้บริการได้ กรุณาติดต่อพนักงานเพื่อดำเนินการ ขออภัยในความไม่สะดวก'
}

export interface PersoSim {
  progress?: number;
  queryPersoSim?: QueryPersoSim;
  orderPersoSim?: OrderPersoSim;
  error?: any;
  eventName?: string;
  simSerial?: string;
}

export interface RequestPersoSim {
  mobileNo: string;
  serialNo: string;
  index: string;
  simService: string;
  sourceSystem: string;
}

export interface QueryPersoSim {
  simSerialNo: string;
  eCommand: string;
  sk: string;
  refNo: string;
}

export interface ControlSimResult {
  data?: any;
  result?: string;
  isSuccess?: boolean;
}

export interface OrderPersoSim {
  transactionNo?: string;
  transactionStatus?: string;
  orderNo?: string;
  orderStatus?: 'Submitted' | 'Completed';
}

export interface OptionPersoSim {
  key_sim?: boolean;
  scan_sim?: boolean;
}

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-mnp-page',
  templateUrl: './new-share-plan-mnp-perso-sim-mnp-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-mnp-page.component.scss']
})
export class NewSharePlanMnpPersoSimMnpPageComponent implements OnInit, OnDestroy {
  getPrivateKeyCommandAPI: string;
  persoSimAPI: string;
  checkCreatePersoSimAPI: string;
  simInfoAPI: string;

  aisNative: any = window.aisNative;
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;

  persoSimInterval: any;

  queryPersoDataFn: any;
  checkCreatedPersoSimFn: any;
  checkOrderStatusFn: any;

  newRegistrationData: any;

  currentStatus: boolean;
  lastStatus: boolean;
  gotCardData: boolean;

  readSimStatus: string;
  cardStatus: string;

  persoSim: any = {};
  persoSimCounter: boolean;

  eCommand: any;
  showCommand: any;

  getCommandCounter: boolean = false;
  createTxPersoCounter: number = 0;
  checkOrderCounter: number = 0;
  timeoutCheckOrderStatus: any;
  timeoutCreatePersoSim: any;
  timeoutReadSim: any;
  timeoutPersoSim: any;

  referenceNumber: string;
  stateMessage: string;
  messageSim: string;
  isStateStatus: string = 'waitingFixSim';
  minLength: number = 13;
  command: number = 2;

  webSocketEndPoint: string = environment.WEB_CONNECT_URL + '/SIMManager';
  resultWS: string;
  isPC: boolean = typeof this.aisNative === 'undefined' ? true : false;
  _ws: any;
  public disableBack: any = false;

  duration: 250;
  scanBarcodePC$: Observable<boolean> = of(true);
  xmlDoc: any;
  getBarcode: any;
  simSerialKeyIn: string;
  statusFixSim: string = 'waitingForCheck';
  orderType: string = 'Port - In';
  mobileNo: string;
  checktSimInfoFn: any;
  serialbarcode: string;
  mockData: any = [];
  getSerialNo: string;
  public simSerialForm: any = this.fb.group({
    simSerial: ['', [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.minLength),
      Validators.pattern('^[0-9]*$')
    ]]
  });

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    public fb: FormBuilder,
    private zone: NgZone,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private route: Router
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
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
    this.mobileNo = this.transaction.data.simCard.mobileNoMember;

    if (typeof this.aisNative !== 'undefined') {
      this.disableBack = true;
      const disConnectReadIdCard: number = 1;
      this.aisNative.sendIccCommand(this.command, disConnectReadIdCard, ''); // connect sim and disconnect smartCard
      this.setIntervalSimCard();
    }
  }

  onGetMessage(body: any): void {
    const data = JSON.parse(body);
    let result: string = '';
    if (data.Event === 'OnSimManagerSuccess') {
      result = data.Result;
    } else if (data.Event === 'OnSimManagerError') {
      result = data.Message;
    }
    if (result) {
      this.resultWS = result;
    }
  }

  getResultWs(): string {
    console.log('call isGetResultWS');
    return this.resultWS;
  }

  setIntervalSimCard(): void {
    this.stateMessageControl('waiting');
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

  checkSimCardStatus(): void {
    const getCardStatus: number = 1000;
    const showDialog: number = 1003;
    this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
    if (this.cardStatus === 'Card presented') {
      this.currentStatus = true;
      clearInterval(this.persoSimInterval);
      this.stateMessageControl('read');
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
        if (this.isPC) {
          this.persoSimInterval = setInterval(() => {
            this.readSimForPerso();
          }, 3000);
        } else {
          this.timeoutReadSim = setTimeout(() => {
            this.readSimForPerso();
          }, delayTime);
        }
      }
    }
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
          simSerialMember: this.getSerialNo
        });
      }
      if (simStatus[0].toLowerCase() === 'true') {
        // Progess 20%
        this.persoSim = { progress: 20, eventName: 'กรุณารอสักครู่' };
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
      this.transaction.data.simCard.mobileNoMember,
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
          this.persoSim = { progress: 40, eventName: 'กรุณารอสักครู่' };
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

  persoSimCard(refNo: string, parameter: string): void {
    const perso: number = 5;
    const showDialog: number = 1001;
    const closeDialog: number = 1002;
    if (this.isPC) {
      this.persoSim = this.aisNative.sendIccCommand(this.command, perso, parameter);
      setTimeout(() => {
        const persoSimStatus: string[] = this.getResultWs().split('|||');
        if (persoSimStatus[0].toLowerCase() === 'true') {
          // Progess 60%
          this.persoSim = { progress: 60, eventName: 'กรุณารอสักครู่' };
          // $('.custom').animate({ width: 60 + '%' }, this.duration, () => {/**/ });
          this.createdPersoSim(refNo);
        } else {
          if (!this.persoSimCounter) {
            this.persoSimCounter = true;
            this.getCommandForPersoSim(this.readSimStatus);
          } else {
            this.popupControl('errorSim', '');
          }
        }
      }, 5000);
    } else {
      // this.aisNative.sendIccCommand(this.command, showDialog, ''); //show dialog Perso
      const persoSimza = this.aisNative.sendIccCommand(this.command, perso, parameter); // perso Sim+
      // this.aisNative.sendIccCommand(this.command, closeDialog, ''); //dismiss dialog Perso
      const persoSimStatus: string[] = persoSimza.split('|||');
      this.persoSim = { progress: 60, eventName: 'กรุณารอสักครู่' };
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
  }

  createdPersoSim(refNo: string): void {
    this.checkCreatedPersoSimFn = this.checkCreatePersoSim(refNo);
    this.checkCreatedPersoSimFn.then((create: any): void => {
      if (create) {
        if (create.data.success) {
          // Progess 80%
          this.persoSim = { progress: 80, eventName: 'กรุณารอสักครู่' };
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

  verifySimSerialByBarcode(barcode: string): void {
    this.simSerialKeyIn = barcode;
    this.checkBarcode(this.simSerialKeyIn, false);
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
        this.persoSim = { progress: 100, eventName: 'กรุณารอสักครู่' };
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

  checkOrderStatus(refNo: string): void {
    this.checkOrderStatusFn = this.getCheckOrderStatus(refNo);
    this.checkOrderStatusFn.then((order: any): void => {
      if (order) {
        if (order.data.orderStatus === 'Completed' && order.data.transactionStatus === 'Completed') {
          // Progess 100%
          this.persoSim = { progress: 100, eventName: 'กรุณารอสักครู่' };
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

  popupControl(isCase: string, errMsg: string): void {

    const errorCase: object = {
      errorSim: {
        customBtn: [
          {
            name: 'ตกลง',
            class: 'mc-button mc-button--green',
            function: this.setIntervalSimCard.bind(this)
          }
        ],
        message: 'เกิดข้อผิดพลาด กรุณาเปลี่ยน SIM CARD ใหม่'
      },
      errorCmd: {
        customBtn: [{
          name: 'RETRY',
          class: 'mc-button mc-button--green',
          function: this.getCommandForPersoSim.bind(this, this.readSimStatus)
        }],
        message: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง'
      },
      errPerso: {
        customBtn: [{
          name: 'ตกลง',
          class: 'mc-button mc-button--green',
        }],
        message: 'ไม่สามารถทำการ Perso SIM ได้ กรุณาเลือกเบอร์เพื่อทำรายการใหม่อีกครั้ง'
      },
      errorOrder: {
        customBtn: [{
          name: 'RETRY',
          class: 'mc-button mc-button--green',
          function: this.checkOrderStatus.bind(this, this.referenceNumber)
        }],
        message: 'กรุณากด Retry เพื่อเรียกข้อมูลใหม่อีกครั้ง'
      },
      errorSmartCard: {
        customBtn: [{
          name: 'ตกลง',
          class: 'mc-button mc-button--green',
          function: this.onRefreshPage.bind(this)
        }],
        message: 'ขออภัยค่ะ ไม่สามารถทำรายการได้ กรุณาเสียบซิมการ์ด'
      },
      errorSimStatus: {
        customBtn: [{
          name: 'ตกลง',
          class: 'mc-button mc-button--green',
          function: this.onRefreshPage.bind(this)
        }],
        message: 'ซิมใบนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนซิมใหม่'
      },
      errorFixSim: {
        customBtn: [{
          name: 'ตกลง',
          class: 'mc-button mc-button--green',
          function: this.onRefreshPage.bind(this)
        }],
        message: errMsg
      },
      errorSimSerialNotMacth: {
        customBtn: [
          {
            name: 'ยกเลิก',
            class: 'mc-button mc-button--green',
            function: this.onRefreshPageToPerso.bind(this)
          },
          {
            name: 'ตกลง',
            class: 'mc-button mc-button--green',
            function: this.onConectToPerso.bind(this)
          }],
        message: errMsg
      }
    };

  }

  stateMessageControl(isState: string): void {
    const state: object = {
      waiting: {
        message: 'กรุณาเสียบซิมการ์ด',
        messageSim: ''
      },
      read: {
        message: 'Port - In' === this.orderType ? 'กรุณารอสักครู่ ระบบกำลังดำเนินการ' : 'กรุณารอสักครู่ ระบบกำลังดำเนินการเปิดเบอร์ใหม่',
        messageSim: 'Port - In' === this.orderType ? '(ห้ามนำซิมการ์ดออก)' : ''
      }
    };
    this.stateMessage = state[isState].message;
    this.messageSim = state[isState].messageSim;
    if (isState === 'read') {
      this.isStateStatus = isState;
    }

  }

  onRefreshPage(): void {
    this.simSerialKeyIn = '';
    this.statusFixSim = 'waitingForCheck';
    this.isStateStatus = 'waitingFixSim';
    this.setIntervalSimCard();
  }

  onRefreshPageToPerso(): void {
    this.simSerialKeyIn = '';
    this.isStateStatus = 'read';
    this.setIntervalSimCard();
  }

  onConectToPerso(): void {
    this.verifySimRegionForPerso(this.getSerialNo);
  }

  openScanBarcode(): void {
    this.aisNative.scanBarcode();
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
    if (this.isPC) {
      // this._ws.onclose();
    }
  }

  onSerialNumberChanged(data?: any): void {
    this.statusFixSim = 'waitingForCheck';
  }

  getPrivateKeyCommand(): Promise<any> {
    this.getPrivateKeyCommandAPI = '/api/customerportal/newRegister/getPrivateKeyCommand';
    return this.http.post(this.getPrivateKeyCommandAPI, '').toPromise();
  }

  getPersoDataCommand(mobileNo: string, serialNo: string, index: string, simService?: string): any {
    this.persoSimAPI = '/api/customerportal/newRegister/queryPersoData?mobileNo=' + mobileNo + '&serialNo='
      + serialNo + '&indexNo=' + index + '&simService=' + simService;
    return this.http.get(this.persoSimAPI).toPromise();
  }

  checkCreatePersoSim(refNo: string): any {
    this.checkCreatePersoSimAPI = '/api/customerportal/newRegister/createPersoSim?refNo=' + refNo;
    return this.http.get(this.checkCreatePersoSimAPI).toPromise();
  }

  getChecktSimInfo(mobileNo: string, serialNo: string): Promise<any> {
    this.simInfoAPI = '/api/customerportal/newRegister/getCheckSimInfo';
    return this.http.post(this.simInfoAPI, { mobileNo: mobileNo, serialNo: serialNo }).toPromise();
  }

  getCheckOrderStatus(refNo: string): any {
    const checkOrderStatusAPI = '/api/customerportal/newRegister/checkOrderStatus?refNo=' + refNo;
    return this.http.get(checkOrderStatusAPI).toPromise();
  }

}

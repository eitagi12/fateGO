import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

declare let $: any;
declare let window: any;

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-new-page',
  templateUrl: './new-share-plan-mnp-perso-sim-new-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-new-page.component.scss']
})
export class NewSharePlanMnpPersoSimNewPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  errorMessage: string = '';
  getPrivateKeyCommandAPI: string;
  persoSimAPI: string;
  checkCreatePersoSimAPI: string;
  simInfoAPI: string;
  aisNative: any = window.aisNative;
  persoSimInterval: any;
  queryPersoDataFn: any;
  checkCreatedPersoSimFn: any;
  checkOrderStatusFn: any;
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
  command: number = 2;
  webSocketEndPoint: string = environment.WEB_CONNECT_URL + '/SIMManager';
  resultWS: string;
  isPC: boolean = typeof this.aisNative === 'undefined' ? true : false;
  _ws: any;
  disableBack: any = false;
  duration: 250;
  scanBarcodePC$: Observable<boolean> = of(true);
  xmlDoc: any;
  getBarcode: any;
  simSerialKeyIn: string;
  statusFixSim: string = 'waitingForCheck';
  orderType: string = 'New Registation';
  mobileNo: string;
  checktSimInfoFn: any;
  serialbarcode: string;
  mockData: any = [];
  getSerialNo: string;
  simSerialForm: FormGroup;
  isNext: boolean = false;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private zone: NgZone,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
      this.verifySimSerialByBarcode(value);
    });

    if (window.aisNative) {
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
    this.mobileNo = this.transaction.data.simCard.mobileNo;

    if (typeof this.aisNative !== 'undefined') {
      this.disableBack = true;
      const disConnectReadIdCard: number = 1;
      this.aisNative.sendIccCommand(this.command, disConnectReadIdCard, ''); // connect sim and disconnect smartCard
      this.setIntervalSimCard();
    }
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
    return this.resultWS;
  }

  setIntervalSimCard(): void {
    this.stateMessageControl('waiting');
    this.lastStatus = false;
    this.gotCardData = false;
    this.persoSim = '';
    this.readSimStatus = '';
    this.persoSim = { progress: 0, eventName: 'กรุณารอสักครู่' };
    clearInterval(this.persoSimInterval);
    const intervalTime: number = 3000;
    this.persoSimInterval = setInterval(() => {
      this.checkSimCardStatus();
    }, intervalTime); // Timer
  }

  checkSimCardStatus(): void {
    const getCardStatus: number = 1000;
    this.cardStatus = this.aisNative.sendIccCommand(this.command, getCardStatus, ''); // Get card status
    if (this.cardStatus === 'Card presented') {
      this.currentStatus = true;
      clearInterval(this.persoSimInterval);
      this.stateMessageControl('read');
    } else {
      this.currentStatus = false;
    }

    if (this.currentStatus && !this.lastStatus) {
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
      if (this.getSerialNo) {
        this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
          simSerial: this.getSerialNo
        });
      }
      if (simStatus[0].toLowerCase() === 'true') {
        // Progess 20%
        this.persoSim = { progress: 20, eventName: 'กรุณารอสักครู่' };
        alert(this.statusFixSim);
        if (this.serialbarcode && this.orderType) {
          if (this.serialbarcode === this.getSerialNo) {
            alert(this.getSerialNo);
            this.verifySimRegionForPerso(this.getSerialNo);
          } else {
            errMegFixSim = 'เลขที่ซิมการ์ดใบนี้ ไม่ตรงกับที่ระบุ ('
              + this.serialbarcode + ') ยืนยันใช้ซิมใบนี้หรือไม่ (' + this.getSerialNo + ')';
            this.popupControl('errorSimSerialNotMacth', errMegFixSim);
          }
        } else {
          if (this.orderType) {
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
      this.orderType === 'Port - In' ? 'MNP-AWN' : 'Normal'
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
          this.persoSimCard(simCommand.data.refNo, parameter);
        }, delayTime);
      }
    }).catch(() => {
      if (!this.getCommandCounter) {
        this.popupControl('errorCmd', '');
        this.getCommandCounter = true;
      } else {
        this.popupControl('errorSim', '');
        this.getCommandCounter = false;
      }
    });
  }

  persoSimCard(refNo: string, parameter: string): void {
    const perso: number = 5;
    if (this.isPC) {
      this.persoSim = this.aisNative.sendIccCommand(this.command, perso, parameter);
      setTimeout(() => {
        const persoSimStatus: string[] = this.getResultWs().split('|||');
        if (persoSimStatus[0].toLowerCase() === 'true') {
          // Progess 60%
          this.persoSim = { progress: 60, eventName: 'กรุณารอสักครู่' };
          this.createdPersoSim(refNo);
        } else {
          this.commandForPersoSim();
        }
      }, 5000);
    } else {
      const persoSim = this.aisNative.sendIccCommand(this.command, perso, parameter); // perso Sim+
      const persoSimStatus: string[] = persoSim.split('|||');
      this.persoSim = { progress: 60, eventName: 'กรุณารอสักครู่' };
      if (persoSimStatus[0].toLowerCase() === 'true') {
        this.createdPersoSim(refNo);
      } else {
        this.commandForPersoSim();
      }
    }
  }

  commandForPersoSim(): void {
    if (!this.persoSimCounter) {
      this.persoSimCounter = true;
      this.getCommandForPersoSim(this.readSimStatus);
    } else {
      this.popupControl('errorSim', '');
    }
  }

  createdPersoSim(refNo: string): void {
    this.checkCreatedPersoSimFn = this.checkCreatePersoSim(refNo);
    this.checkCreatedPersoSimFn.then((create: any): void => {
      if (create) {
        if (create.data.success) {
          // Progess 80%
          this.persoSim = { progress: 80, eventName: 'กรุณารอสักครู่' };
          this.checkOrderStatus(refNo);
        } else {
          const oneMinutes: number = 60000;
          const loop: number = 3;
          if (this.createTxPersoCounter < loop) {
            this.timeoutCreatePersoSim = setTimeout(() => {
              this.createdPersoSim(refNo);
            }, oneMinutes);
            this.createTxPersoCounter++;
          } else {
            this.popupControl('errorSim', '');
          }
        }
      }
    }).catch(() => {
      const oneMinutes: number = 60000;
      const loop: number = 3;
      if (this.createTxPersoCounter < loop) {
        this.timeoutCreatePersoSim = setTimeout(() => {
          this.createdPersoSim(refNo);
        }, oneMinutes);
        this.createTxPersoCounter++;
      } else {
        this.popupControl('errorSim', '');
      }
    });
  }

  verifySimSerialByBarcode(barcode: string): void {
    this.simSerialKeyIn = barcode;
    this.serialbarcode = barcode;
    this.checkBarcode(this.simSerialKeyIn, false);
  }

  checkBarcode(barcode: string, isScan: boolean): void {
    let errorCode: string;
    let returnMessage: string;
    let errMegFixSim: string;
    if (this.simSerialForm.controls['simSerial'].valid && this.orderType) {
      this.checktSimInfoFn = this.getChecktSimInfo(this.mobileNo, barcode);
      this.checktSimInfoFn.then((simInfo: any) => {
        this.pageLoadingService.openLoading();
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
          alert('errorCode' + errorCode);
          this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
            if (value === 13) {
              this.isNext = true;
            } else {
              this.isNext = false;
            }
          });
          this.isNext = true;
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
      errorCode = simInfo.data.returnCode;
      returnMessage = simInfo.data.returnMessage;

      if (errorCode === '003' || errorCode === '005') {
        this.pageLoadingService.closeLoading();
        this.popupControl('errorSimStatus', '');
      } else if (errorCode === '004') {
        this.pageLoadingService.closeLoading();
        this.getCommandForPersoSim(this.readSimStatus);
      } else if (errorCode === '006') {
        this.pageLoadingService.closeLoading();
        errMegFixSim = 'ซิมใบนี้ไม่สามารถทำรายการได้ เนื่องจาก Region ซิมไม่ตรงกับเบอร์ที่เลือก เบอร์ '
          + this.mobileNo + ' กรุณาเปลี่ยนซิมใหม่';
        this.popupControl('errorFixSim', errMegFixSim);
      } else if (errorCode === '008') {
        // Progess 100%
        this.persoSim = { progress: 100, eventName: 'กรุณารอสักครู่' };
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
          setTimeout(() => {
          }, this.duration);
        } else {
          const oneMinutes: number = 60000;
          const loop: number = 3;
          if (this.checkOrderCounter < loop) {
            this.timeoutCheckOrderStatus = setTimeout(() => {
              this.checkOrderStatus(refNo);
            }, oneMinutes);
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
      const oneMinutes: number = 60000;
      const loop: number = 3;
      if (this.checkOrderCounter < loop) {
        this.timeoutCheckOrderStatus = setTimeout(() => {
          this.checkOrderStatus(refNo);
        }, oneMinutes);
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
          text: 'ไม่สามารถทำการ Perso SIM ได้ กรุณาเลือกเบอร์เพื่อทำรายการใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          // onClose: () => this.getCommandForPersoSim.bind(this, this.readSimStatus)
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

  stateMessageControl(isState: string): void {
    const state: object = {
      waiting: {
        message: 'กรุณาเสียบซิมการ์ด',
        messageSim: ''
      },
      read: {
        message: 'กรุณารอสักครู่ ระบบกำลังดำเนินการเปิดเบอร์ใหม่',
        messageSim: ''
      }
    };
    this.stateMessage = state[isState].message;
    this.messageSim = state[isState].messageSim;
    if (isState === 'read') {
      this.isStateStatus = isState;
    }

  }

  onBackPress(): void {
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
    this.onBack();
  }

  onBackPressPerso(): void {
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
    if (this.orderType) {
      this.simSerialKeyIn = '';
      this.isStateStatus = 'waitingFixSim';
      this.statusFixSim = 'waitingForCheck';
      this.setIntervalSimCard();
    }
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

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (!this.transaction.data.simCard.simSerial) {
      this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
        simSerial: this.simSerialForm.controls.simSerial.value
      });
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE]);
    }
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE]);
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
  }

}

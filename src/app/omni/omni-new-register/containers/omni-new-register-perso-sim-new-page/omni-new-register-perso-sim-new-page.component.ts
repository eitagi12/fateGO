import { Component, OnInit, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageLoadingService, AlertService, Utils } from 'mychannel-shared-libs';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Transaction, SimCard, TransactionAction } from 'src/app/omni/omni-shared/models/transaction.model';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE, ROUTE_OMNI_NEW_REGISTER_RESULT_PAGE } from '../../constants/route-path.constant';
import { RECEIVE_WATERMARK } from '../../constants/receive-watermark';

declare let $: any;
declare let window: any;

@Component({
  selector: 'app-omni-new-register-perso-sim-new-page',
  templateUrl: './omni-new-register-perso-sim-new-page.component.html',
  styleUrls: ['./omni-new-register-perso-sim-new-page.component.scss']
})
export class OmniNewRegisterPersoSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
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
  statusFixSim: string;
  orderType: string = 'Normal';
  cusMobileNo: string;
  checktSimInfoFn: any;
  mockData: any = [];
  getSerialNo: string;
  simSerialForm: FormGroup;
  isNext: boolean = false;
  @ViewChild('drawWatermark') drawWatermark: ElementRef;
  imageWithDraw: any;
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private zone: NgZone,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    const simCard: any = {
      mobileNo: this.transaction.data.cusMobileNo,
      simSerial: '',
      persoSim: false,
    };
    this.setAction(simCard);
    this.transactionService.save(this.transaction);
  }

  ngOnInit(): void {
    this.createCanvas();
    this.createForm();
    this.simSerialForm.controls.simSerial.valueChanges.subscribe((value) => {
      if (value && value.length === 13) {
        this.verifySimSerialByBarcode(value);
      }
    });
    if (window.aisNative) {
      this.scanBarcodePC$ = of(true);
      window.onBarcodeCallback = (barcode: any): void => {
        this.alertService.info(barcode);
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
    this.cusMobileNo = this.transaction.data.simCard.mobileNo;

    if (typeof this.aisNative !== 'undefined') {
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

  isAisNative(): boolean {
    return this.utils.isAisNative();
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
    this.disableBack = true;
    this.gotCardData = true;
    if (this.readSimStatus) {
      const simStatus: string[] = this.readSimStatus.split('|||');
      this.getSerialNo = simStatus[1].slice(cutNoSerialNumber);
      if (this.getSerialNo) {
        this.simSerialKeyIn = this.getSerialNo;
        this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
          simSerial: this.getSerialNo
        });
      }
      if (simStatus[0].toLowerCase() === 'true') {
        // Progess 20%
        this.persoSim = { progress: 20, eventName: 'กรุณารอสักครู่' };
        if (this.simSerialKeyIn && this.orderType) {
          if (this.simSerialKeyIn === this.getSerialNo) {
            this.verifySimRegionForPerso(this.getSerialNo);
          } else {
            errMegFixSim = 'เลขที่ซิมการ์ดใบนี้ ไม่ตรงกับที่ระบุ ('
              + this.simSerialKeyIn + ') ยืนยันใช้ซิมใบนี้หรือไม่ (' + this.getSerialNo + ')';
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
      this.orderType,
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
    }).catch((err: any) => {
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
    this.checkBarcode(this.simSerialKeyIn, false);
  }

  checkBarcode(barcode: string, isScan: boolean): void {
    let errorCode: string;
    let returnMessage: string;
    let errMegFixSim: string;
    if (this.simSerialForm.controls['simSerial'].valid && this.orderType) {
      this.checktSimInfoFn = this.getChecktSimInfo(this.cusMobileNo, barcode);
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
          this.simSerialKeyIn = barcode;
          this.onRefreshPageToPerso();
        } else if (errorCode === '006') {
          this.pageLoadingService.closeLoading();
          errMegFixSim = 'ซิมใบนี้ไม่สามารถทำรายการได้ เนื่องจาก Region ซิมไม่ตรงกับเบอร์ที่เลือก เบอร์ '
            + this.cusMobileNo + ' กรุณาเปลี่ยนซิมใหม่';
          this.popupControl('errorFixSim', errMegFixSim);
        } else if (errorCode === '008') {
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

    this.checktSimInfoFn = this.getChecktSimInfo(this.cusMobileNo, serialNo);
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
          + this.cusMobileNo + ' กรุณาเปลี่ยนซิมใหม่';
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
            this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
              simSerial: ''
            });
            this.disableBack = false;
            this.onRefreshPage();
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
    this.simSerialKeyIn = this.simSerialForm.controls.simSerial.value;
    this.statusFixSim = 'waitingForCheck';
    this.isStateStatus = 'waitingFixSim';
    this.setIntervalSimCard();
  }

  onRefreshPageToPerso(): void {
    // this.simSerialKeyIn = '';
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
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
  }
  setSimCard(): SimCard {
    return Object.assign({
      mobileNo: this.transaction.data.cusMobileNo,
      simSerial: '',
      perso: false,
    });

  }

  onNext(): void {
    this.transactionService.update(this.transaction);
    if (!this.transaction.data.simCard.simSerial) {
      this.transaction.data.simCard = Object.assign(this.transaction.data.simCard, {
        simSerial: this.simSerialKeyIn
      });
      window.location.href = `/sales-portal/reserve-stock/receive-confirm-online`;
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

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    clearInterval(this.persoSimInterval);
    clearTimeout(this.timeoutCheckOrderStatus);
    clearTimeout(this.timeoutCreatePersoSim);
    clearTimeout(this.timeoutReadSim);
    clearTimeout(this.timeoutPersoSim);
  }

  public setAction(simCard: any): void {
    this.transaction.data = {
      ...this.transaction.data,
      simCard: simCard
    };
  }

  createCanvas(): void {
    const imageCard = new Image();
    const watermarkImage = new Image();

    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      imageCard.src = 'data:image/png;base64,' + this.transaction.data.customer.imageSmartCard;
    } else {
      imageCard.src = 'data:image/png;base64,' + this.transaction.data.customer.imageReadSmartCard;
    }

    watermarkImage.src = 'data:image/png;base64,' + RECEIVE_WATERMARK;

    imageCard.onload = () => {
      this.drawIdCard(imageCard, watermarkImage);
    };
  }

  clearCanvas(): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.drawWatermark.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  drawIdCard(imageCard?: any, watermark?: any): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.drawWatermark.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (new RegExp('data:image/png;base64,').test(imageCard.src)) {
      canvas.width = imageCard.width;
      canvas.height = imageCard.height;
      ctx.drawImage(imageCard, 0, 0);
      ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
    }

    this.transaction.data.customer.imageIdCardWithReceive = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
    this.transactionService.update(this.transaction);
  }
}

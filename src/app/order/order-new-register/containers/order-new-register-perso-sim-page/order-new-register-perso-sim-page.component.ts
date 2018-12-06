import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE,
  ROUTE_ORDER_NEW_REGISTER_AGREEMENT_SIGN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_BY_PATTERN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';

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
  EVENT_LOAD_SIM = 'LoadSIM',
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
  selector: 'app-order-new-register-perso-sim-page',
  templateUrl: './order-new-register-perso-sim-page.component.html',
  styleUrls: ['./order-new-register-perso-sim-page.component.scss']
})
export class OrderNewRegisterPersoSimPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_NEW_REGISTER;
  title: string;
  isControlSim: boolean;
  isManageSim: boolean;
  persoSimSubscription: Subscription;
  typeSim: 'pullsim' | 'insert';
  environment = { WEB_CONNECT_URL: 'wss://localhost:8088' };
  onStatusSim: any;
  errorMessage: string;

  persoSim: PersoSim;
  mobileNo: string;
  serialSim: string;
  requestPersoSim: RequestPersoSim;
  referenceNumber: string;
  transaction: Transaction;
  isNext: boolean;
  option: OptionPersoSim;

  // WebSocket
  wsControlSim: any;
  wsManageSim: any;

  // onerror  ใส่ error ว่าให้ error ได้กี่ครั้ง
  checkErrSim = 0;
  errSimOut = 3;
  checkErrCmd = 3;
  errCmd = 0;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private utils: Utils,
    private http: HttpClient,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {
    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.typeSim = 'pullsim';
    } else {
      this.typeSim = 'insert';
    }
  }

  ngOnInit() {
    this.option = {
      scan_sim: true,
      key_sim: false
    };
    this.transaction = this.transactionService.load();
    if (this.transaction.data.simCard.mobileNo) {
      this.startPersoSim(this.transaction);
    }
  }

  startPersoSim(transaction) {
    this.errorMessage = '';
    this.persoSimSubscription = this.onPersoSim(transaction.data.simCard.mobileNo).subscribe((value) => {
      this.isNext = false;
      this.persoSim = value;
      this.title = value.eventName;
      if (value.queryPersoSim) {
        transaction.data.simCard = Object.assign(transaction.data.simCard, {
          simSerial: value.simSerial
        });
        this.transactionService.update(transaction);
        this.isNext = true;
        this.onNext();
      }
      // on error
      if (value.error) {
        console.log(value.error);
        if (value.error.errorCase === ErrorPerSoSim.ERROR_SIM) {
          this.checkErrSim++;
          if (this.checkErrSim < 3) {
            this.startPersoSim(this.transaction);
          } else {
            this.persoSimSubscription.unsubscribe();
            this.alertService.error(ErrorPerSoSimMessage.ERROR_ORDER_MESSAGE);
            this.errorMessage = ErrorPerSoSimMessage.ERROR_ORDER_MESSAGE;
          }
        } else
          if (value.error.errorCase === ErrorPerSoSim.ERROR_PERSO) {
            this.alertService.question(value.error.messages, 'ตกลง').then((res) => {
              if (res.value) {
                this.persoSimSubscription.unsubscribe();
                this.router.navigate([ROUTE_ORDER_NEW_REGISTER_BY_PATTERN_PAGE]);
              }
            });
          } else if (value.error.errorCase === ErrorPerSoSim.ERROR_CMD) {
            this.checkErrCmd++;
            if (this.errCmd < this.checkErrCmd  ) {
              this.startPersoSim(this.transaction);
            } else {
              this.persoSimSubscription.unsubscribe();
              this.alertService.error(ErrorPerSoSimMessage.ERROR_CMD_MESSAGE);
              this.errorMessage = ErrorPerSoSimMessage.ERROR_CMD_MESSAGE;
            }
          } else {
            this.alertService.error(value.error.messages);
          }
        this.errorMessage = value.error.messages;
      }
    });
  }

  onPersoSim(mobileNo): Observable<PersoSim> {
    this.mobileNo = mobileNo;
    if (this.utils.isAisNative()) {
      return this.persoSimFromAisNative();
    } else {
      this.controlSim('Connect').then((res: ControlSimResult) => {
        if (res.isSuccess) {
          this.typeSim = 'pullsim';
          this.loadSimCard();
        } else {
          this.typeSim = 'insert';
        }
      }).catch(() => {
        this.typeSim = 'insert';
      });
      return this.persoSimFromWebSocket();
    }
  }

  persoSimFromWebSocket(): Observable<PersoSim> {
    return new Observable(observer => {
      if (!WebSocket) {
        observer.next({
          error: 'เว็บเบราว์เซอร์นี้ไม่รองรับการ perso sim'
        });
        return;
      }

      const simMaseage = 'กำลังเตรียมซิมใหม่';
      observer.next({ progress: 0, eventName: simMaseage });

      this.getPrivateKeyCommand().then((privateKey: any) => {
        observer.next({ progress: 0, eventName: simMaseage }); // โหลดเอา key มาอ่านซิม
        if (privateKey.data.statusCode === '001') {
          this.manageSim(PersoSimCommand.EVENT_CONNECT_LIB, privateKey.data.privateKey).then((res: ControlSimResult) => {
            if (res.isSuccess) {
              observer.next({ progress: 0, eventName: simMaseage }); // connect เครื่องอ่านซิม
              this.checkSimCardPresent().then((resCardStatus: ControlSimResult) => {
                observer.next({ progress: 20, eventName: 'กำลังอ่านซิม' }); // ซิมถูกเสียบ
                this.manageSim(PersoSimCommand.EVENT_READ_SIM, '').then((dataSim: ControlSimResult) => {
                  observer.next({ progress: 40, eventName: 'กรุณารอสักครู่' }); // อ่านซิมเสร็จแล้ว
                  const serialSim = dataSim.result.split('|||');
                  if (serialSim[0] === ReadSimCardStatus.EVENT_READ_SIM_SUCCESS) {
                    const persoSim: RequestPersoSim = {
                      mobileNo: this.mobileNo,
                      serialNo: serialSim[1].slice(6),
                      index: serialSim[3],
                      simService: 'Normal'
                    };
                    this.requestPersoSim = persoSim;
                    this.getPersoDataCommand(persoSim.mobileNo, persoSim.serialNo, persoSim.index, persoSim.simService)
                      .then((simCommand) => {
                        observer.next({ progress: 60, eventName: 'กรุณารอสักครู่' }); // create perso แล้ว
                        const eCommand = simCommand.data.eCommand;
                        const field: string[] = simCommand.data.eCommand.split('|||');
                        const parameter: string =
                          field[1] + '|||' +
                          field[2] + '|||' +
                          field[3] + '|||' +
                          field[4] + '|||' +
                          simCommand.data.sk;
                        this.referenceNumber = simCommand.data.refNo;
                        this.manageSim(PersoSimCommand.EVENT_PERSO_SIM, parameter)
                          .then((persoSimCommand: ControlSimResult) => {
                            observer.next({ progress: 70, eventName: 'กรุณารอสักครู่' }); // ออก perso แล้ว
                            const persoMassege: string[] = persoSimCommand.result.split('|||');
                            if (persoMassege[0] === PersoSimCardStatus.EVENT_PERSO_SIM_SUCCESS) {
                              this.checkCreatePersoSim(this.referenceNumber).then((crestePersoSim) => {
                                observer.next({ progress: 80, eventName: 'กรุณารอสักครู่' }); // ออก order แล้ว
                                this.checkOrderStatusCompleted(this.referenceNumber).then((resOrder) => {
                                  if (resOrder) {
                                    observer.next({ progress: 90, eventName: 'กรุณารอสักครู่' }); // order complete แล้ว
                                    this.controlSim(ControlSimCard.EVENT_RELEASE_SIM).then(() => {
                                      this.controlSim(ControlLED.EVENT_LED_BLINK).then(() => {
                                        if (this.typeSim === 'pullsim') {
                                          observer.next({
                                            progress: 100,
                                            eventName: 'กรุณาดึง SIM CARD ออก'
                                          });
                                          this.checkCardOutted().then(() => {
                                            this.controlSim(ControlLED.EVENT_LED_OFF);
                                            observer.next({
                                              progress: 100,
                                              eventName: 'กรุณาดึง SIM CARD ออก',
                                              orderPersoSim: resOrder,
                                              queryPersoSim: simCommand,
                                              simSerial: persoSim.serialNo
                                            });
                                          }).catch(() => {
                                            this.controlSim(ControlLED.EVENT_LED_OFF);
                                          });
                                        } else {
                                          observer.next({
                                            progress: 100,
                                            eventName: 'กรุณาดึง SIM CARD ออก',
                                            orderPersoSim: resOrder,
                                            queryPersoSim: simCommand,
                                            simSerial: persoSim.serialNo
                                          });
                                        }
                                      });
                                    });
                                  } else {
                                    this.errrorPersoSim(ErrorPerSoSim.ERROR_PERSO).then((err) => observer.next(err));
                                  }
                                }).catch(() => {
                                  // not to do
                                });
                              }).catch(() => {
                                this.errrorPersoSim(ErrorPerSoSim.ERROR_PERSO).then((err) => observer.next(err));
                              });
                            } else {
                              this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((err) => observer.next(err));
                            }
                          });
                      }).catch((err) => {
                        if (err) {
                          if (err.error) {
                            if (err.error.errors) {
                              if (err.error.errors.returnCode === '004') {
                                this.errrorPersoSim(ErrorPerSoSim.ERROR_SIM).then((error) => observer.next(error));
                              } else if (err.error.errors.returnCode === '006' || err.error.errors.returnCode === '003') {
                                if (err.error.errors.returnMessage.search('Serial No')) {
                                  this.errrorPersoSim(ErrorPerSoSim.ERROR_SIM).then((error) => observer.next(error));
                                } else if (err.error.errors.returnMessage.search('Mobile')) {
                                  this.errrorPersoSim(ErrorPerSoSim.ERROR_PERSO).then((error) => observer.next(error));
                                } else {
                                  this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((error) => observer.next(error));
                                }
                              } else {
                                this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((error) => observer.next(error));
                              }
                            } else {
                              this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((error) => observer.next(error));
                            }
                          } else {
                            this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((error) => observer.next(error));
                          }
                        } else {
                          this.errrorPersoSim(ErrorPerSoSim.ERROR_CMD).then((error) => observer.next(error));
                        }
                      });

                  } else {
                    this.errrorPersoSim(ErrorPerSoSim.ERROR_PRIVATE_KEY).then((err) => observer.next(err));
                  }
                });
              }).catch(() => {
                this.errrorPersoSim(ErrorPerSoSim.ERROR_SIM_EMPTY).then((err) => observer.next(err));
              });
            } else {
              this.errrorPersoSim(ErrorPerSoSim.ERROR_WEB_SOCKET).then((err) => observer.next(err));
            }
          }).catch(() => {
            this.errrorPersoSim(ErrorPerSoSim.ERROR_WEB_SOCKET).then((err) => observer.next(err));
          });
        } else {
          this.errrorPersoSim(ErrorPerSoSim.ERROR_PRIVATE_KEY).then((err) => observer.next(err));
        }
      }).catch(() => {
        this.errrorPersoSim(ErrorPerSoSim.ERROR_PRIVATE_KEY).then((err) => observer.next(err));
      });

      return () => {
        this.closeWsAll();
      };

    });
  }

  private checkCardOutted() {
    return new Promise((resolve) => {
      const checkCard = setInterval(() => {
        this.controlSim(ControlSimCard.EVENT_CHECK_SIM_STATE).then((resp: ControlSimResult) => {
          if (resp.result === SIMCardStatus.STATUS_NO_CARD) {
            clearInterval(checkCard);
            this.controlSim(ControlLED.EVENT_LED_OFF);
            resolve(true);
          }
        });
      }, 1000);
    });
  }

  private errrorPersoSim(errrorCase: string, messages?: string) {
    return new Promise((resolve) => {
      let errNext = {
        progress: 0,
        eventName: '',
        error: { errorCase: errrorCase, messages: messages ? messages : '' }
      };
      switch (errrorCase) {
        case ErrorPerSoSim.ERROR_SIM:
          this.controlSim(ControlSimCard.EVENT_KEEP_SIM).then(() => {
            this.controlSim(ControlLED.EVENT_LED_OFF).then(() => {
              this.closeWsAll();
              errNext = {
                progress: 0,
                eventName: '',
                error: { errorCase: errrorCase, messages: messages ? messages : ErrorPerSoSimMessage.ERROR_SIM_MESSAGE }
              };
              resolve(errNext);
            });
          });
          break;
        case ErrorPerSoSim.ERROR_PERSO:
          this.controlSim(ControlSimCard.EVENT_KEEP_SIM).then(() => {
            this.controlSim(ControlLED.EVENT_LED_OFF).then(() => {
              this.closeWsAll();
              errNext = {
                progress: 0,
                eventName: '',
                error: { errorCase: errrorCase, messages: messages ? messages : ErrorPerSoSimMessage.ERROR_PERSO_MESSAGE }
              };
              resolve(errNext);
            });
          });
          break;
        case ErrorPerSoSim.ERROR_WEB_SOCKET:
          this.closeWsAll();
          errNext = {
            progress: 0,
            eventName: '',
            error: { errorCase: errrorCase, messages: messages ? messages : ErrorPerSoSimMessage.ERROR_WEB_SOCKET_MESSAGE }
          };
          resolve(errNext);
          break;
        case ErrorPerSoSim.ERROR_SIM_EMPTY:
          this.closeWsAll();
          errNext = {
            progress: 0,
            eventName: '',
            error: { errorCase: errrorCase, messages: messages ? messages : ErrorPerSoSimMessage.ERROR_SIM_EMPTY_MESSAGE }
          };
          resolve(errNext);
          break;
        default:
          this.controlSim(ControlSimCard.EVENT_KEEP_SIM).then(() => {
            this.controlSim(ControlLED.EVENT_LED_OFF).then(() => {
              this.closeWsAll();
              errNext = {
                progress: 0,
                eventName: '',
                error: { errorCase: ErrorPerSoSim.ERROR_ORDER, messages: messages ? messages : ErrorPerSoSimMessage.ERROR_ORDER_MESSAGE }
              };
              resolve(errNext);
            });
          });
          break;
      }
    });
  }

  closeWsAll() {
    if (this.wsControlSim) {
      this.wsControlSim.close();
      this.wsControlSim = false;
    }
    if (this.wsManageSim) {
      this.wsManageSim.close();
      this.wsManageSim = false;
    }
  }

  private checkOrderStatusCompleted(referenceNumber) {
    return new Promise((resolve) => {
      let nubCount = 0;
      const checkOrder = setInterval(() => {
        this.checkOrderStatus(referenceNumber).then((respone) => {
          if (respone.data.orderStatus === 'Completed') {
            clearInterval(checkOrder);
            resolve(respone);
          } else {
            nubCount++;
            if (nubCount > 20) {
              clearInterval(checkOrder);
              resolve(false);
            }
          }
        });
      }, 2000);
    });
  }

  private controlSim(event: string) {
    return new Promise((resolve) => {
      const result: ControlSimResult = {
        data: null,
        result: null,
        isSuccess: false
      };
      if (!this.wsControlSim && event === 'Connect') {
        this.wsControlSim = new WebSocket(`${this.environment.WEB_CONNECT_URL}/VendingAPI`);
        this.wsControlSim.onopen = () => {
          result.isSuccess = true;
          this.isControlSim = true;
          resolve(result);
        };
      } else if (this.isControlSim && event !== 'Connect') {
        this.wsControlSim.send(event);
        this.wsControlSim.onmessage = (evt) => {
          const resultOnmessage = JSON.parse(evt.data);
          result.isSuccess = true;
          result.data = resultOnmessage;
          result.result = resultOnmessage.Result;
          resolve(result);
        };
        this.wsControlSim.onerror = () => {
          this.isControlSim = false;
          result.isSuccess = false;
          resolve(result);
        };
      } else {
        resolve(result);
      }
    });
  }

  private manageSim(Command: number, Parameter: string) {
    return new Promise((resolve) => {
      const result: ControlSimResult = {
        data: null,
        result: null,
        isSuccess: false
      };
      const packet = {
        Command: Command,
        Parameter: Parameter
      };
      if (!this.wsManageSim && Command === 9000) {
        this.wsManageSim = new WebSocket(`${this.environment.WEB_CONNECT_URL}/SIMManager`);
        this.wsManageSim.onopen = () => {
          result.isSuccess = true;
          this.isManageSim = true;
          this.wsManageSim.send(JSON.stringify(packet));
          resolve(result);
        };
        this.wsManageSim.onerror = () => {
          this.isManageSim = false;
          result.isSuccess = false;
          resolve(result);
        };
      } else if (this.isManageSim && Command !== 9000) {
        this.wsManageSim.send(JSON.stringify(packet));
        this.wsManageSim.onmessage = (evt) => {
          const resultOnmessage = JSON.parse(evt.data);
          result.isSuccess = true;
          result.data = resultOnmessage;
          result.result = resultOnmessage.Result;
          resolve(result);
        };
        this.wsManageSim.onerror = () => {
          this.isManageSim = false;
          result.isSuccess = false;
          resolve(result);
        };
      } else {
        resolve(result);
      }
    });
  }

  loadSimCard() {
    this.controlSim(ControlSimCard.EVENT_CHECK_SIM_INVENTORY).then((res: ControlSimResult) => {
      const statusInventory = res.result.split(' | ');
      if (statusInventory[0] !== SIMCardStatus.INVENTORY_1_EMPTY_CARD
        || statusInventory[1] !== SIMCardStatus.INVENTORY_2_EMPTY_CARD) {
        this.controlSim(ControlSimCard.EVENT_CHECK_SIM_STATE).then((resCheckSim: ControlSimResult) => {
          if (resCheckSim.result === SIMCardStatus.STATUS_IN_IC) {
            this.controlSim(ControlLED.EVENT_LED_ON);
            return resCheckSim.isSuccess;
          } else {
            this.controlSim(ControlSimCard.EVENT_LOAD_SIM).then((resLoadSim: ControlSimResult) => {
              this.controlSim(ControlLED.EVENT_LED_ON);
              return resLoadSim.isSuccess;
            });
          }
        });
      } else {
        return false;
      }
    });
  }

  checkSimCardPresent() {
    return new Promise((resolve, reject) => {
      const timeout = (this.typeSim === 'pullsim') ? 3 : 1000;
      let checkTimeOut = 0;
      const intervalCheckSimCard = setInterval(() => {
        checkTimeOut++;
        if (checkTimeOut > timeout) {
          clearInterval(intervalCheckSimCard);
          reject(false);
        }
        this.manageSim(PersoSimCommand.EVENT_CONNECT_SIM_READER, '').then((resCheckCard: ControlSimResult) => {
          if (resCheckCard.result === 'Present' || resCheckCard.result === 'Connected') {
            clearInterval(intervalCheckSimCard);
            resolve(resCheckCard);
          } else {
            checkTimeOut++;
          }
        });
      }, 2000);
    });
  }

  private persoSimFromAisNative(): Observable<PersoSim> {
    return;
  }

  getPersoDataCommand(mobileNo: string, serialNo: string, index: string, simService?: string): Promise<any> {
    const persoSimAPI = '/api/customerportal/newRegister/queryPersoData?mobileNo='
      + mobileNo + '&serialNo=' + serialNo + '&indexNo=' + index + '&simService=' + simService;
    return this.http.get(persoSimAPI).toPromise();
  }

  checkCreatePersoSim(refNo: string): Promise<any> {
    const checkCreatePersoSimAPI = '/api/customerportal/newRegister/createPersoSim?refNo=' + refNo;
    return this.http.get(checkCreatePersoSimAPI).toPromise();
  }

  checkOrderStatus(refNo: string): Promise<any> {
    const checkOrderStatusAPI = '/api/customerportal/newRegister/checkOrderStatus?refNo=' + refNo;
    return this.http.get(checkOrderStatusAPI).toPromise();
  }

  getPrivateKeyCommand(): Promise<any> {
    const getPrivateKeyCommandAPI = '/api/customerportal/newRegister/getPrivateKeyCommand';
    return this.http.post(getPrivateKeyCommandAPI, '').toPromise();
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

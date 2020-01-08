import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelType, AlertService } from 'mychannel-shared-libs';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ } from 'src/app/device-order/constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
declare let $: any;
declare let window: any;
declare function escape(s: string): string;
@Component({
  selector: 'app-new-register-mnp-validate-customer-id-card-page',
  templateUrl: './new-register-mnp-validate-customer-id-card-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-id-card-page.component.scss']
})

export class NewRegisterMnpValidateCustomerIdCardPageComponent implements OnInit {

  channelType: string;

  imgReadCardPhoto: any;
  returnDataObj: any;
  aisNative: any = window.aisNative;
  iosNative: any = window.iosNative;
  window: any = window;
  pushOrPull: string = 'โปรดเสียบบัตรประชาชน';
  success: boolean = false;
  card: string = 'assets/images/icon/icon-ReadIDCard-02.png';
  customerProfile: string;
  profilePhoto: any;

  progress: number;
  customerInfoFn: any;
  currentStatus: boolean;
  keepStatus: boolean;
  finishProgress: boolean;
  gotProfile: boolean;
  gotPhoto: boolean;
  showProgress: boolean;

  idCardNo: string;
  issueDate: string;
  expireDate: string;
  fieldValues: string[];
  thaiName: string;
  textAddress: string;
  birthDate: string;

  resultState: string;
  timerID: any;
  timeoutReadIdCard: any;
  timer: number = 3000;
  minProgress: number = 99;
  progressTimer: number = 1000;
  progressMax: number = 100;
  progressInterval: any;
  timerCardCanRead: number = 5000;

  indexIdCardNo: number = 2;
  indexTitleNameTH: number = 3;
  indexFirstNameTH: number = 4;
  indexLastNameTH: number = 6;
  indexTitleNameEN: number = 7;
  indexFirstNameEN: number = 8;
  indexLastNameEN: number = 10;
  indexBirthDate: number = 11;
  indexSex: number = 12;
  indexAddressNo: number = 13;
  indexMoo: number = 14;
  indexTrok: number = 15;
  indexSoi: number = 16;
  indexStreet: number = 17;
  indexTumbol: number = 18;
  indexAmphur: number = 19;
  indexProvince: number = 20;
  indexIssueDate: number = 22;
  indexExpireDate: number = 23;
  indexPhotoIos: number = 5;
  webSocketEndpoint: string = 'wss://localhost:8088' + '/ReadIDCard';
  isPC: boolean = (typeof this.aisNative === 'undefined' ? true : false && typeof this.iosNative === 'undefined') ? true : false;
  _ws: any;

  /* Card Status */
  CARD_PRESENT: string = 'Presented';
  GET_CARD_COMPLETE: string = 'complete';
  GET_CARD_PROFILE: string = 'get-card-profile';
  GET_CARD_PHOTO: string = 'get-card-photo';

  buttonGoToKeyIn: object[] = [
    {
      name: 'ตกลง',
      class: 'mc-button mc-button--green',
      function: this.goToKeyInPage.bind(this)
    }
  ];

  buttonData: object[] = [
    {
      name: 'ตกลง',
      class: 'mc-button mc-button--green',
      function: this.goToStartPage.bind(this)
    }
  ];

  buttonRefresh: object[] = [
    {
      name: 'ตกลง',
      class: 'mc-button mc-button--green',
      function: this.goToRefreshPage.bind(this)
    }
  ];

  transaction: Transaction;
  priceOption: any;
  transactionId: string;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;
  constructor(private alertService: AlertService, private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    console.log(this.priceOption);
  }

  ngOnInit(): void {
    switch (this.channelType) {
      case ChannelType.SFF_WEB:
        if ('WebSocket' in window) {
          this._ws = new WebSocket(this.webSocketEndpoint);
          this._ws.onopen = (res) => {
            console.log('res ==>', res);
          };
          this._ws.onmessage = (evt: any) => {
            this.onGetMessage(evt.data);
          };

          this._ws.onclose = () => {

          };

          this._ws.onerror = () => {
            this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อ 02-029-6303');
            // this.alertService.setCustomButton(this.buttonGoToKeyIn)
            // this.alertService.setpopupMessage('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อ 02-029-6303')
            // this.alertService.openPopup()
          };
        } else {
          this.alertService.error('Error 500 : เว็บเบราว์เซอร์นี้ไม่รองรับการอ่านบัตรประชาชน กรุณาติดต่อ 02-029-6303');
          // this.alertService.setCustomButton(this.buttonGoToKeyIn);
          // this.alertService.setpopupMessage('Error 500 : เว็บเบราว์เซอร์นี้ไม่รองรับการอ่านบัตรประชาชน กรุณาติดต่อ 02-029-6303');
          // this.alertService.openPopup();
        }
        break;
      default:
        if (this.aisNative) {

          this.customerProfile = '';
          this.timerID = setInterval(() => {
            this.scanIdCard();
          }, this.timer); // Timer
          this.progressInterval = setInterval(() => {
            this.triggerProgress();
          }, this.progressTimer); // Timer
        } else if (this.iosNative) {
          window.location = 'IOS://param?Action=readsmartcard';
          this.timerID = setInterval(() => {
            this.readSmartCard();
          }, this.progressTimer);
        } else {
          localStorage.setItem('errorFlag', 'false');
          this.alertService.error('Error 500 : เว็บเบราว์เซอร์นี้ไม่รองรับการอ่านบัตรประชาชน กรุณาติดต่อ 02-029-6303');
          // this.alertService.setCustomButton(this.buttonGoToKeyIn);
          // this.alertService.setpopupMessage('Error 500 : เว็บเบราว์เซอร์นี้ไม่รองรับการอ่านบัตรประชาชน กรุณาติดต่อ 02-029-6303');
          // this.alertService.openPopup();
        }
        break;
    }
  }

  goToKeyInPage(): void {
    window.history.back();
    // this.alertService.closePopup();
  }

  goToStartPage(): void {
    // this.router.navigate([this.redirectUrlWhenFail], { relativeTo: this.route });
    // this.alertService.closePopup();
  }

  goToRefreshPage(): void {

  }

  onGetMessage(data?: any): void {

  }

  scanIdCard(): void {
    let imageBase64: string;
    const getCardStatus: number = 2;
    this.resultState = this.aisNative.sendIccCommand(0, getCardStatus, '');
    if (this.resultState === 'Presented') {
      this.currentStatus = true;
      if (!this.timeoutReadIdCard) {
        this.timeoutReadIdCard = setTimeout(() => {
          if (this.progress === 0 && this.resultState === 'Presented') {
            // this.alertService.setCustomButton(this.buttonGoToKeyIn);
            localStorage.setItem('errorFlag', 'false');
            this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้');
            // this.alertService.setpopupMessage('ไม่สามารถอ่านบัตรประชาชนได้');
            // this.alertService.openPopup();
          }
        }, this.timerCardCanRead);
      }
      if (!this.finishProgress) {
        this.profilePhoto = '';
        this.showProgress = true;
      }
    } else {
      this.currentStatus = false;
    }
    if (this.currentStatus && !this.keepStatus) {
      this.gotProfile = false;
      this.keepStatus = true;
    }
    if (this.currentStatus) {
      if (this.progress > this.minProgress && !this.gotProfile) {
        const getCardProfile: number = 4;
        this.customerProfile = this.aisNative.sendIccCommand(0, getCardProfile, ''); // Get card profile
        if (!this.checkCompleteData(this.customerProfile)) {
          this.gotProfile = true;
        } else {
          // this.alertService.setCustomButton(this.buttonGoToKeyIn);
          localStorage.setItem('errorFlag', 'false');
          this.alertService.error('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
          // this.alertService.setpopupMessage('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
          // this.alertService.openPopup();
          clearInterval(this.timerID);
          clearInterval(this.progressInterval);
        }
      }
      if (this.progress >= this.progressMax && !this.gotPhoto) {
        this.gotPhoto = true;
      }
      if (this.gotProfile && this.gotPhoto) {
        const getCardProfilePhoto: number = 5;
        imageBase64 = this.aisNative.sendIccCommand(0, getCardProfilePhoto, ''); // Get card profile Photo
        if (imageBase64 && !this.profilePhoto) {
          this.profilePhoto = 'data:image/jpg;base64,' + imageBase64;
          setTimeout(() => {
            $('#imgRegNumVerifyScanIdProfilePhoto').attr('src', 'data:image/jpg;base64,' + imageBase64);
          }, 1000);
        }
        this.showCardData(this.customerProfile);
      }
    }
    if (!this.currentStatus && this.keepStatus) {
      this.keepStatus = false;
      this.showProgress = false;
      this.gotProfile = false;
      this.gotPhoto = false;
      if (this.timeoutReadIdCard) {
        clearTimeout(this.timeoutReadIdCard);
        this.timeoutReadIdCard = null;
      }
    }
  }

  triggerProgress(): void {
    const progressNumber: number = 3;
    const progressResult: string = this.aisNative.sendIccCommand(0, progressNumber, ''); // Get load progress
    const baseNumber: number = 10;
    this.progress = parseInt(progressResult, baseNumber);
    const second: number = 500;
    const finish: number = 100;
    const getCardStatus: number = 2;
    this.resultState = this.aisNative.sendIccCommand(0, getCardStatus, '');
    if (this.progress <= finish && !this.finishProgress) {
      $('.custom').animate({ width: this.progress + '%' }, second, () => { /**/ });
      if (this.progress >= finish && this.gotProfile && this.gotPhoto) {
        this.finishProgress = true;
      }
    } else if (this.resultState === 'Presented' && this.finishProgress && this.progress < this.progressMax) {
      this.finishProgress = false;
      this.showProgress = false;
      $('.custom').css('width', 0);
    }
  }

  showCardData(textProfile: any): void {
    this.fieldValues = textProfile.split('#');
    this.idCardNo = this.fieldValues[this.indexIdCardNo];
    this.thaiName = this.fieldValues[this.indexTitleNameTH];
    this.thaiName += ' ' + this.fieldValues[this.indexFirstNameTH];
    this.thaiName += ' ' + this.fieldValues[this.indexLastNameTH];

    this.textAddress = this.fieldValues[this.indexAddressNo];
    if (this.fieldValues[this.indexMoo] !== '') {
      this.textAddress += ' หมู่ที่ ' + this.fieldValues[this.indexMoo];
    }
    if (this.fieldValues[this.indexTrok] !== '') {
      this.textAddress += ' ตรอก' + this.fieldValues[this.indexTrok];
    }
    if (this.fieldValues[this.indexSoi] !== '') {
      this.textAddress += ' ซอย' + this.fieldValues[this.indexSoi];
    }
    if (this.fieldValues[this.indexStreet] !== '') {
      this.textAddress += ' ถนน' + this.fieldValues[this.indexStreet];
    }
    let bangkok: boolean;
    if (this.fieldValues[this.indexProvince].trim() === 'กรุงเทพมหานคร') {
      bangkok = true;
    } else {
      bangkok = false;
    }
    if (bangkok) {
      this.textAddress += ' แขวง' + this.fieldValues[this.indexTumbol];
    } else {
      this.textAddress += ' ต.' + this.fieldValues[this.indexTumbol];
    }
    if (bangkok) {
      this.textAddress += ' เขต' + this.fieldValues[this.indexAmphur];
    } else {
      this.textAddress += ' อ.' + this.fieldValues[this.indexAmphur];
    }
    if (bangkok) {
      this.textAddress += ' ' + 'กรุงเทพ';
    } else {
      this.textAddress += ' จ.' + this.fieldValues[this.indexProvince];
    }

    this.issueDate = this.fieldValues[this.indexIssueDate].replace(/-/g, '/');
    const idCardExpireDate = this.fieldValues[this.indexExpireDate].replace(/-/g, '');
    const expire = this.extractExpireDateIdCardMobile(idCardExpireDate);
    this.expireDate = `${expire.day}/${expire.month}/${expire.year}`;

    const idCardBirthDate = this.fieldValues[this.indexBirthDate].replace(/-/g, '');
    const birth = this.extractBirthDateIdCardMobile(idCardBirthDate);
    this.birthDate = `${birth.day}/${birth.month}/${birth.year}`;

    this.returnDataObj = {
      idCardNo: this.idCardNo,
      imageReadSmartCard: (this.profilePhoto && this.profilePhoto.length > 0) ? this.profilePhoto : '',
      idCardType: 'บัตรประชาชน',
      titleName: this.fieldValues[this.indexTitleNameTH],
      firstName: this.fieldValues[this.indexFirstNameTH].trim(),
      lastName: this.fieldValues[this.indexLastNameTH].trim(),
      firstNameEn: this.fieldValues[this.indexFirstNameEN].trim(),
      lastNameEn: this.fieldValues[this.indexLastNameEN].trim(),
      birthdate: this.birthDate,
      gender: this.getGender(this.fieldValues[this.indexSex]),
      address: {
        homeNo: this.fieldValues[this.indexAddressNo],
        moo: this.fieldValues[this.indexMoo],
        street: this.fieldValues[this.indexStreet],
        soi: this.fieldValues[this.indexSoi],
        tumbol: this.fieldValues[this.indexTumbol],
        amphur: this.fieldValues[this.indexAmphur],
        province: this.fieldValues[this.indexProvince].trim() === 'กรุงเทพมหานคร' ? 'กรุงเทพ' : this.fieldValues[this.indexProvince]
      },
      issueDate: this.issueDate,
      expireDate: this.expireDate
    };
    // if (this.onSuccess) {
    //   this.onSuccess(this.returnDataObj)
    // }
  }

  // tslint:disable-next-line: typedef
  extractExpireDateIdCardMobile(date: string = '99999999') {
    // DDMMYYYY
    let year;
    let month;
    let day;
    try {
      year = moment(date.substring(4, 8), 'YYYY');
      if (year.isValid()) {
        year = year.format('YYYY');
      } else {
        year = '9999';
      }
    } catch (error) {
      year = '9999';
    }
    try {
      month = moment(date.substring(2, 4) + year, 'MMYYYY');
      if (month.isValid()) {
        month = month.format('MM');
      } else {
        month = '01';
      }
    } catch (error) {
      month = '01';
    }
    try {
      day = moment(date.substring(0, 2) + month + year, 'DDMMYYYY');
      if (day.isValid()) {
        day = day.format('DD');
      } else {
        day = '01';
      }
    } catch (error) {
      day = '01';
    }
    return { year, month, day };
  }

  readSmartCard(): void {
    this.window.onReadCardCallBack = (progress: string, data?: any, error?: any, state?: any): void => {
      const progressResult: string = progress;
      const baseNumber: number = 10;
      this.progress = parseInt(progressResult, baseNumber);
      const second: number = 10;
      const finish: number = 100;
      this.resultState = state;
      let imageBase64: string;

      if (this.progress <= finish && !this.finishProgress) {
        $('.custom').animate({ width: this.progress + '%' }, second, () => {/**/ });
        if (this.progress === finish && data) {
          this.finishProgress = true;
        }
      } else if (this.resultState === 'Presented' && this.finishProgress && this.progress < this.progressMax) {
        this.finishProgress = false;
        this.showProgress = false;
        $('.custom').css('width', 0);
      }

      if (!error && this.resultState === 'Presented' && this.progress > 0) {
        if (this.resultState === 'Presented') {
          this.currentStatus = true;
          if (!this.timeoutReadIdCard) {
            this.timeoutReadIdCard = setTimeout(() => {
              if (this.progress === 0 && this.resultState === 'Presented') {
                // this.alertService.setCustomButton(this.buttonData);
                localStorage.setItem('errorFlag', 'false');
                this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้');
                // this.alertService.setpopupMessage('ไม่สามารถอ่านบัตรประชาชนได้');
                // this.alertService.openPopup();
                clearInterval(this.timerID);
              }
            }, this.timerCardCanRead);
          }
          if (!this.finishProgress) {
            this.profilePhoto = '';
            this.showProgress = true;
          }
        } else {
          this.currentStatus = false;
        }
        if (this.currentStatus && !this.keepStatus) {
          this.gotProfile = false;
          this.keepStatus = true;
        }
        if (this.currentStatus) {
          if (this.progress === this.progressMax && this.finishProgress && data) {
            this.customerProfile = data; // Get card profile
            if (!this.checkCompleteData(this.customerProfile)) {
              this.gotProfile = true;
              imageBase64 = (this.customerProfile.split('#'))[this.indexPhotoIos];
              if (imageBase64 && !this.profilePhoto) {
                this.profilePhoto = 'data:image/jpg;base64,' + imageBase64;
                setTimeout(() => {
                  $('#imgRegNumVerifyScanIdProfilePhoto').attr('src', 'data:image/jpg;base64,' + imageBase64);
                }, 1000);
              }
              this.showCardData(this.customerProfile);
            } else {
              // this.alertService.setCustomButton(this.buttonData);
              localStorage.setItem('errorFlag', 'false');
              this.alertService.error('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
              // this.alertService.setpopupMessage('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
              // this.alertService.openPopup();
              clearInterval(this.timerID);
            }
          }
        }
        if (!this.currentStatus && this.keepStatus) {
          this.keepStatus = false;
          this.showProgress = false;
          this.gotProfile = false;
          this.gotPhoto = false;
          if (this.timeoutReadIdCard) {
            clearTimeout(this.timeoutReadIdCard);
            this.timeoutReadIdCard = null;
          }
        }
      } else {
        this.finishProgress = false;
        this.showProgress = false;
        $('.custom').css('width', 0);
        // this.alertService.setCustomButton(this.buttonData);
        localStorage.setItem('errorFlag', 'false');
        this.alertService.error('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
        // this.alertService.setpopupMessage('อ่านบัตรประชาชนไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง');
        // this.alertService.openPopup();
        clearInterval(this.timerID);
      }
    };
  }

  // tslint:disable-next-line: typedef
  extractBirthDateIdCardMobile(date: string = '00000000') {
    // DDMMYYYY
    let year;
    let month;
    let day;
    try {
      year = moment(date.substring(4, 8), 'YYYY');
      if (year.isValid()) {
        year = year.format('YYYY');
      } else {
        year = '0000';
      }
    } catch (error) {
      year = '0000';
    }
    try {
      month = moment(date.substring(2, 4) + year, 'MMYYYY');
      if (month.isValid()) {
        month = month.format('MM');
      } else {
        month = '01';
      }
    } catch (error) {
      month = '01';
    }
    try {
      day = moment(date.substring(0, 2) + month + year, 'DDMMYYYY');
      if (day.isValid()) {
        day = day.format('DD');
      } else {
        day = '01';
      }
    } catch (error) {
      day = '01';
    }
    return { year, month, day };
  }

  getGender(gender: string): string {
    if (this.iosNative) {
      return gender;
    } else {
      return gender === '1' ? 'M' : 'F';
    }
  }

  checkCompleteData(data: string): boolean {
    const one: number = 1;
    const two: number = 2;
    for (let slice: number = 1; slice <= two; slice++) {
      data = data.slice(data.indexOf('#') + one);
    }
    return /^(#)\1+$/.test(data);
  }

  onBackPressCaller(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_VALIDATE_CUSTOMER_PAGE]);
  }
}

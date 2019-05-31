import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile, PageLoadingService, Utils, AlertService } from 'mychannel-shared-libs';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';

declare let $: any;
export enum ReadCardAisNative {
  EVENT_CHECK_STATUS = 2,
  EVENT_LOAD_PROGRESS = 3,
  EVENT_CARD_PROFILE = 4,
  EVENT_CARD_PROFILE_PHOTO = 5
}

@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})

export class DeviceOnlyReadCardComponent implements OnInit {

  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  @ViewChild('progressBarArea') progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard') progressBarReadSmartCard: ElementRef;
  @ViewChild('listBillingAccountBox')  listBillingAccountBox: ElementRef;

  koiskApiFn: any;
  public ADDRESS_BY_SMART_CARD: string = 'addressBySmartCard';
  public profile: ReadCardProfile;
  public messages: String;
  public canReadSmartCard: boolean = true;
  public selectBillingAddressForm: FormGroup;
  public infoBySmartCard: Object ;
  public nameTextBySmartCard: string;
  public addressTextBySmartCard: string;
  public listBillingAccount: Array<any>;
  public isSelect: boolean;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private customerInfoService: CustomerInformationService,
    private pageLoadingService: PageLoadingService,
    private utils: Utils,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.customerInfoService.cancelreadcard.subscribe((statusRealcare) => {
      if (statusRealcare === false) {
        $('#button-read-smart-card').removeClass('disabledbutton');
        if (this.customerInfoService.unsubscribe.subscribe) {
          this.customerInfoService.unsubscribe.unsubscribe();
        }
      }
    });
    this.createSelectBillingAddressForm();
    this.progressBarArea.nativeElement.style.display = 'none';
    this.isSelect = false;
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': ['', [Validators.required]],
    });
    this.selectBillingAddressForm.valueChanges.pipe(debounceTime(350)).subscribe(event => {
      if (this.selectBillingAddressForm.valid) {
        this.isSelect = true;
      }
    });
  }
  readCardFromAisNative(): void {
    $('#button-read-smart-card').addClass('disabledbutton');
    let width: number = 1;
    this.messages = 'โปรดเสียบบัตรประชาชน';
    this.progressBarArea.nativeElement.style.display = 'none';
    this.progressBarReadSmartCard.nativeElement.style.width = '0%';
    const promises: any = new Promise((resolve, reject) => {
      this.customerInfoService.unsubscribe = this.readCardService.onReadCard().subscribe((readCard: any) =>  {
        if (readCard.error ) {
          // this.messages = readCard.error;
        }
        const customer: String = readCard.profile;
          if (readCard.progress === 100 && width < 100) {
            this.progressBarArea.nativeElement.style.display = 'block';
            const id = setInterval(() => {
              if (readCard.progress >= 0 && width < 100) {
                this.messages = 'กรุณารอสักครู่';
              }
              if (width >= 100) {
                clearInterval(id);
                resolve(customer);
                this.customerInfoService.cancelReadCarad();
                if (width === 100 && readCard.progress === 100) {
                  this.progressBarArea.nativeElement.style.display = 'none';
                  this.progressBarReadSmartCard.nativeElement.style.width = '0%';
                  this.messages = 'ตรวจสอบสำเร็จ ดึงบัตรประชาชนออก';
                }
              } else {
                width ++ ;
                this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
              }
              }, 10);
          }
      });
    }).catch((err) => {
      this.pageLoadingService.closeLoading();
    });
    return promises;

  }
  readCardFromWebSocket(): void {
    let width: number = 1;
    this.messages = '';
    this.messages =  'โปรดเสียบบัตรประชาชน';
    $('#button-read-smart-card').addClass('disabledbutton');
    const  readCardEvent: any = {
      EVENT_CARD_INITIALIZED: 'OnInitialized',
      EVENT_CARD_INSERTED: 'OnCardInserted',
      EVENT_CARD_LOAD_PROGRESS: 'OnCardLoadProgress',
      EVENT_CARD_LOAD_COMPLETED: 'OnCardLoadCompleted',
      EVENT_CARD_LOAD_ERROR: 'OnCardLoadError',
      EVENT_CARD_REMOVED: 'OnCardRemoved',
    };
    this.progressBarArea.nativeElement.style.display = 'none';
    this.progressBarReadSmartCard.nativeElement.style.width = '0%';
      const promises: any = new Promise((resolve, reject) => {
      this.customerInfoService.unsubscribe =  this.readCardService.onReadCard().subscribe((readCard: any) =>  {
          if (readCard.eventName === readCardEvent.EVENT_CARD_REMOVED) {
            this.messages =  '';
            width = 0;
            this.progressBarArea.nativeElement.style.display = 'block';
            this.progressBarReadSmartCard.nativeElement.style.width = '0%';
          }
          if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_ERROR) {
            this.progressBarArea.nativeElement.style.display = 'none';
            this.progressBarReadSmartCard.nativeElement.style.width = '0%';
          }
          if (readCard.eventName === readCardEvent.EVENT_CARD_INITIALIZED) {
            setTimeout(() => {
            if (readCard.eventName !== readCardEvent.EVENT_CARD_INSERTED) {
                this.messages =  'โปรดเสียบบัตรประชาชน';
                this.progressBarArea.nativeElement.style.display = 'none';
            }}, 10);
          }
          if (readCard.eventName === readCardEvent.EVENT_CARD_INSERTED) {
              width = 0;
              this.messages =  '';
          }
          if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_PROGRESS) {
              this.progressBarArea.nativeElement.style.display = 'block';
              width = +readCard.progress;
              this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
          }
          if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_COMPLETED) {
            this.canReadSmartCard = true;
            const customer: String = readCard.profile;
              if (customer) {
                resolve(customer);
                $('#button-read-smart-card').removeClass('disabledbutton');
                this.progressBarReadSmartCard.nativeElement.style.width = '100%';
                this.messages =  'ตรวจสอบสำเร็จ โปรดดึงบัตรออก';
              }
              this.progressBarArea.nativeElement.style.display = 'none';
          }
        });

      }).catch((err) => {
        console.log(err);
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาเสียบบัตรใหม่อีกครั้ง');
      });
      return promises;
  }

  readingCard(): any {
    if (this.utils.isAisNative()) {
      return this.readCardFromAisNative();
    } else {
      return this.readCardFromWebSocket();
    }
  }

  public getbillingCycle(customer: any): void {
    this.infoBySmartCard = customer;
    this.nameTextBySmartCard = customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName;
    const billDeliveryAddress: Customer = {
      idCardNo: customer.idCardNo || '',
      idCardType: customer.idCardNo || '',
      titleName: customer.titleName || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      birthdate: customer.birthdate || '',
      gender: customer.gender || '',
      homeNo: customer.homeNo || '',
      moo: customer.moo || '',
      mooBan: customer.mooBan || '',
      room: customer.room || '',
      floor: customer.floor || '',
      buildingName: customer.buildingName || '',
      soi: customer.soi || '',
      street: customer.street || '',
      province: customer.province,
      amphur: customer.amphur,
      tumbol: customer.tumbol,
      zipCode: customer.zipCode
    };
    this.addressTextBySmartCard = this.customerInfoService.convertBillingAddressToString(billDeliveryAddress);
    this.customerInfoService.getBillingByIdCard(customer.idCardNo)
      .then((res) => {
        console.log('getBillingByIdCard : res ==>> ', res);
        if (res && res.data && res.data.billingAccountList) {
          this.listBillingAccount = res.data.billingAccountList.filter((item) => {
            if (item.mobileNo && item.mobileNo[0].length > 0) {
              return item;
            }
          });
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
        } else {
          this.progressBarArea.nativeElement.style.display = 'none';
        }
        this.pageLoadingService.closeLoading();
      })
      .catch(() => {
        this.listBillingAccountBox.nativeElement.style.display = 'none';
      });
  }
    public zipcode(customer: any): any {
      return this.customerInfoService.getZipCode(customer.province, customer.amphur, customer.tumbol)
      .then((res) => {
          const zipCode: String = res.data.zipcodes[0];
          return zipCode;
      });
    }
 public readCard(): void {
  // this.pageLoadingService.openLoading();
    new Promise((resolve, reject): void => {
      resolve(this.readingCard());
    }).then((customer: any) => {
    this.zipcode(customer).then((res) => {
        customer.zipCode = res;
        this.getbillingCycle(customer);
    });
    }).catch((err) => {
      console.log(err);
      this.pageLoadingService.closeLoading();
    });
  }
  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingAddress(): void {
    const billingAddressSelected = this.selectBillingAddressForm.value.billingAddress;
    if (billingAddressSelected === this.ADDRESS_BY_SMART_CARD) {
      this.isSelect = false;
      this.modalBillAddress.hide();
      this.canReadSmartCard = true;
      this.customerInfo.emit({
        customer: this.infoBySmartCard,
        action: TransactionAction.READ_CARD
      });
    } else {
      this.pageLoadingService.openLoading();
      const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
      this.customerInfoService.getBillingByMobileNo(mobileNo)
        .then((res) => {
          this.customerInfoService.setSelectedMobileNo(mobileNo);
          this.customerInfo.emit({
            customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
            action: TransactionAction.KEY_IN
          });
          this.modalBillAddress.hide();
          this.canReadSmartCard = true;
          this.pageLoadingService.closeLoading();
      })
      .catch((err) => {
        this.alertService.error(err.error.resultDescription);
      });
    }
  }
}

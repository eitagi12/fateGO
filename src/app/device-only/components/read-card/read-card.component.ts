import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile, PageLoadingService, Utils, AlertService, ReadCard, KioskControls, ReadCardEvent, ChannelType, TokenService } from 'mychannel-shared-libs';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { Subscription } from 'rxjs';

declare let $: any;

@Component({
  selector: 'app-read-card',
  templateUrl: './read-card.component.html',
  styleUrls: ['./read-card.component.scss']

})

export class ReadCardComponent implements OnInit, OnDestroy {
  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  kioskApi: boolean;
  koiskApiFn: any;
  readCard: ReadCard;
  profile: ReadCardProfile;
  readCardSubscription: Subscription;

  // modal click drag
  onTouchScreen: boolean;
  currentScrollPosition: any = 0;
  scrollingPosition: any = 0;

  public ADDRESS_BY_SMART_CARD: string = 'addressBySmartCard';
  public messages: String;
  public canReadSmartCard: boolean = true;
  public selectBillingAddressForm: FormGroup;
  public infoBySmartCard: Object;
  public nameTextBySmartCard: string;
  public addressTextBySmartCard: string;
  public listBillingAccount: Array<any>;
  public isSelect: boolean;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private tokenService: TokenService,
    private customerInfoService: CustomerInformationService,
    private pageLoadingService: PageLoadingService,
    private utils: Utils,
    private alertService: AlertService,
    private el: ElementRef,
    private _zone: NgZone

  ) { }

  ngOnInit(): void {
    this.kioskApi = this.tokenService.getUser().channelType === ChannelType.SMART_ORDER;
    this.createSelectBillingAddressForm();
  }

  createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': ['', [Validators.required]],
    });
    this.selectBillingAddressForm.valueChanges.pipe(debounceTime(350)).subscribe(event => {
      if (this.selectBillingAddressForm.valid) {
        this.isSelect = true;
      }
    });
  }

  onTouchModal(event: any): void {
    const id = document.getElementById('myModal');
    window.scrollTo(0, 0);
    this.currentScrollPosition = event.clientY + id.scrollTop;
    this.onTouchScreen = true;
  }

  onScrolling(event: any): void {
    const id = document.getElementById('myModal');
    if (this.onTouchScreen) {
      this.scrollingPosition = (this.currentScrollPosition - (event.clientY + id.scrollTop));
      id.scrollTop += this.scrollingPosition;
    }
  }

  onCancelMove(event: any): void {
    event.preventDefault();
    this.onTouchScreen = false;
  }
  onReadCard(): void {
    this.selectBillingAddressForm.reset();
    this.messages = 'โปรดเสียบบัตรประชาชน';
    this.profile = null;
    if (this.kioskApi) {
      this.koiskApiFn = this.readCardService.kioskApi();
    }
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.profile = null;
      }
      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.onError(valid);
      }
      if (valid) {
        this.profile = readCard.profile;
        this.messages = 'ตรวจสอบสำเร็จ โปรดดึงบัตรออก';
        if (!this.kioskApi) {
          this.getBillingData(this.profile);
        }
      } else if (readCard.eventName !== ReadCardEvent.EVENT_CARD_INITIALIZED) {
        this.messages = this.profile ? 'ตรวจสอบสำเร็จ โปรดดึงบัตรออก' : 'กรุณารอสักครู่';
      }
      if (this.kioskApi) {
        this.hanndleReadCardKoiskApi(readCard.eventName);
        if (valid) {
          this.koiskApiFn.removedState().subscribe((removed: boolean) => {
            if (removed) {
              this.koiskApiFn.controls(KioskControls.LED_OFF);
              this.getBillingData(this.profile);
            }
          });
        }
      }
    });
  }

  getBillingData(customer: any): void {
    this.pageLoadingService.openLoading();
    this.readCardSubscription.unsubscribe();
    this.zipcode(customer).then((res) => {
      customer.zipCode = res;
      this.getbillingCycle(customer);
    });
  }

  onError(valid: boolean): void {
    this.readCardSubscription.unsubscribe();
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
      if (this.koiskApiFn) {
        this.koiskApiFn.removedState().subscribe((removed: boolean) => {
          if (removed) {
            this.readCard = {};
          }
        });
      }
    }
  }

  hanndleReadCardKoiskApi(eventName: string): void {
    switch (eventName) {
      case ReadCardEvent.EVENT_CARD_INITIALIZED:
        this.koiskApiFn.controls(KioskControls.LED_BLINK);
        this.koiskApiFn.controls(KioskControls.CONNECT);
        break;
      case ReadCardEvent.EVENT_CARD_INSERTED:
      case ReadCardEvent.EVENT_CARD_LOAD_PROGRESS:
        this.koiskApiFn.controls(KioskControls.LED_ON);
        break;
      case ReadCardEvent.EVENT_CARD_LOAD_ERROR:
        this.koiskApiFn.controls(KioskControls.LED_BLINK);
        this.koiskApiFn.controls(KioskControls.EJECT_CARD);
        this.koiskApiFn.controls(KioskControls.CONNECT);
        break;
      case ReadCardEvent.EVENT_CARD_REMOVED:
      case ReadCardEvent.EVENT_CARD_LOAD_COMPLETED:
        this.koiskApiFn.controls(KioskControls.LED_BLINK);
        this.koiskApiFn.controls(KioskControls.EJECT_CARD);
        break;
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
        if (res && res.data && res.data.billingAccountList) {
          this.listBillingAccount = res.data.billingAccountList.filter((item) => {
            if (item.mobileNo && item.mobileNo[0].length > 0) {
              return item;
            }
          });
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate,
            { backdrop: 'static', });
        }
        this.pageLoadingService.closeLoading();
      });
  }

  zipcode(customer: any): any {
    return this.customerInfoService.getZipCode(customer.province, customer.amphur, customer.tumbol)
      .then((res) => {
        const zipCode: String = res.data.zipcodes[0];
        return zipCode;
      });
  }

  public selectBillingAddress(): void {
    const billingAddressSelected = this.selectBillingAddressForm.value.billingAddress;
    if (billingAddressSelected === this.ADDRESS_BY_SMART_CARD) {
      this.isSelect = true;
      this.modalBillAddress.hide();
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
            action: TransactionAction.READ_CARD
          });
          this.modalBillAddress.hide();
          this.pageLoadingService.closeLoading();
        })
        .catch((err) => {
          this.alertService.error(err.error.resultDescription);
        });
    }
  }

  ngOnDestroy(): void {
    if (this.koiskApiFn) {
      this.koiskApiFn.close();
    }
  }
}

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from 'src/app/device-only/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReadCardService, PageLoadingService, AlertService, HomeService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionAction, Transaction } from 'src/app/shared/models/transaction.model';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { debounceTime } from 'rxjs/operators';

declare let $: any;
@Component({
  selector: 'app-device-only-asp-read-card',
  templateUrl: './device-only-asp-read-card.component.html',
  styleUrls: ['./device-only-asp-read-card.component.scss']
})
export class DeviceOnlyAspReadCardComponent implements OnInit {
  public wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  public searchByMobileNoForm: FormGroup;
  public receiptInfoForm: FormGroup;
  public messages: string;
  public canReadSmartCard: boolean = true;
  public nameTextBySmartCard: string;
  private nameText: string;
  private billingAddressText: string;
  private customer: any;
  public addressTextBySmartCard: string;
  public listBillingAccount: Array<any>;
  private priceOption: PriceOption;
  private transaction: Transaction;
  public selectBillingAddressForm: FormGroup;
  public isSelect: boolean;

  @ViewChild('progressBarArea')
  progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard')
  progressBarReadSmartCard: ElementRef;
  @ViewChild('listBillingAccountBox')
  listBillingAccountBox: ElementRef;
  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;
  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private billingAddress: BillingAddressService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeService: HomeService,
    private customerInfoService: CustomerInformationService,
    private http: HttpClient
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.progressBarArea.nativeElement.style.display = 'none';
    this.billingAddress.getLocationName()
    .subscribe((resp) => this.receiptInfoForm.controls['branch'].setValue(resp.data.displayName));
    this.createFormMobile();
    this.craeteFormCus();
    this.createSelectBillingAddressForm();
  }

  private createFormMobile = () => {
    this.searchByMobileNoForm = this.fb.group({
      mobileNo: ''
    });
  }

  private craeteFormCus = () => {
    this.receiptInfoForm = this.fb.group({
      taxId: '',
      branch: '',
      telNo: ''
    });
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': '',
    });
    this.selectBillingAddressForm.valueChanges.pipe(debounceTime(350)).subscribe(event => {
      if (this.selectBillingAddressForm.valid) {
        this.isSelect = true;
      }
    });
  }

  searchCustomerInfo = () => {
    if (this.searchByMobileNoForm.getRawValue().mobileNo) {
      this.pageLoadingService.openLoading();
      const mobileNo = this.searchByMobileNoForm.value.mobileNo;
      this.checkChargeType(mobileNo);
    } else {
      this.alertService.notify({
        type: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        text: 'กรุณาระบุเบอร์ให้ครบ 10 หลัก'
      });
      this.nameText = '';
      this.billingAddressText = '';
      this.receiptInfoForm.controls['taxId'].setValue('');
      this.receiptInfoForm.controls['branch'].setValue('');
    }
  }

  private checkChargeType = (mobileNo: string) => {
    this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        const chargeType: string = resp.data.chargeType;
        switch (chargeType) {
          case 'Pre-paid':
            this.alertService.warning('กรุณาระบุเบอร์ AIS รายเดือนเท่านั้น');
            this.searchByMobileNoForm.controls['mobileNo'].setValue('');
            break;
          case 'Post-paid':
            this.http.get(`/api/customerportal/billing/${mobileNo}`).toPromise()
              .then((res: any) => {
                if (res && res.data && res.data.billingAddress) {
                  this.setCustomerInfo({
                    customer: res.data.billingAddress,
                    action: TransactionAction.KEY_IN
                  });
                  this.receiptInfoForm.controls['taxId'].setValue((`XXXXXXXXX${(res.data.billingAddress.idCardNo.substring(9))}`));
                  this.pageLoadingService.closeLoading();
                } else {
                  this.errorNotAisMobileNo();
                }
              })
              .catch(() => {
                this.pageLoadingService.closeLoading();
                this.errorNotAisMobileNo();
                this.clearData();
              });
            break;
        }
      })
      .catch(() => {
        this.pageLoadingService.closeLoading();
        this.errorNotAisMobileNo();
        this.clearData();
      });
  }

  private errorNotAisMobileNo(): void {
    this.alertService.notify({
      type: 'error',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      text: 'เบอร์นี้ไม่ใช่ระบบ AIS กรุณาเปลี่ยนเบอร์ใหม่'
    });
  }

  private clearData(): void {
    this.searchByMobileNoForm.controls['mobileNo'].setValue('');
    this.nameText = '';
    this.billingAddressText = '';
    this.receiptInfoForm.controls['taxId'].setValue('');
    this.receiptInfoForm.controls['branch'].setValue('');
  }

  setCustomerInfo = (data: any) => {
    this.customer = {
      idCardNo: data.customer.idCardNo,
      idCardType: data.customer.idCardType || 'บัตรประชาชน',
      titleName: data.customer.titleName,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      birthdate: data.customer.birthdate || '',
      gender: data.customer.gender || '',
      expireDate: data.customer.expireDate || '',
      homeNo: data.customer.homeNo,
      moo: data.customer.moo || '',
      mooBan: data.customer.mooBan || '',
      room: data.customer.room || '',
      floor: data.customer.floor || '',
      buildingName: data.customer.buildingName || '',
      soi: data.customer.soi || '',
      street: data.customer.street || '',
      province: data.customer.province,
      amphur: data.customer.amphur,
      tumbol: data.customer.tumbol,
      zipCode: data.customer.zipCode,
      mobileNo: data.mobileNo,
    };
    this.transaction.data.action = data.action;
  }

  async readCard(): Promise<any> {
    const data = await this.readCardFromWebSocket();
    this.customer = await data;
    this.nameTextBySmartCard = this.customer.titleName + ' ' + this.customer.firstName + ' ' + this.customer.lastName;
    console.log(' this.customer : ',  this.customer);

    await this.zipcode(data);
    this.addressTextBySmartCard = await this.customerInfoService.convertBillingAddressToString(this.customer);
    await this.getBillingByIdCard();
  }

  private getBillingByIdCard(): void {
    this.customerInfoService.getBillingByIdCard(this.customer.idCardNo)
    .then((res: any) => {
      console.log('response getBillingByIdCard : ', res);
      if (res && res.data && res.data.billingAccountList) {
        this.listBillingAccount = res.data.billingAccountList.filter((item: any) => {
          // console.log('item : ', item);
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
    // tslint:disable-next-line: max-line-length
    return this.http.get(`/api/customerportal/newRegister/queryZipcode?provinceId=${customer.province}&amphurName=${customer.amphur}&tumbolName=${customer.tumbol}`)
      .toPromise()
      .then((res: any) => {
        this.customer.zipCode = res.data.zipCode;
      })
      .catch((error) => {
        this.pageLoadingService.closeLoading();
      });
  }

  readCardFromWebSocket = () => {
    let width: number = 1;
    this.messages = '';
    this.messages = 'โปรดเสียบบัตรประชาชน';
    $('#button-read-smart-card').addClass('disabledbutton');
    const readCardEvent: any = {
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
      this.readCardService.onReadCard().subscribe((readCard: any) => {
        if (readCard.eventName === readCardEvent.EVENT_CARD_REMOVED) {
          this.messages = '';
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
              this.messages = 'โปรดเสียบบัตรประชาชน';
              this.progressBarArea.nativeElement.style.display = 'none';
            }
          }, 10);
        }
        if (readCard.eventName === readCardEvent.EVENT_CARD_INSERTED) {
          width = 0;
          this.messages = '';
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
            $('#button-read-smart-card').removeClass('disabledbutton');
            this.progressBarReadSmartCard.nativeElement.style.width = '100%';
            this.messages = 'ตรวจสอบสำเร็จ โปรดดึงบัตรออก';
            resolve(customer);
          }
          this.progressBarArea.nativeElement.style.display = 'none';
        }
      });

    }).catch(() => {
      this.pageLoadingService.closeLoading();
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาเสียบบัตรใหม่อีกครั้ง');
    });
    return promises;
  }

  public closeModalBillingMobileNo(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingMobileNo(): void {
    const billingAddressSelected = this.selectBillingAddressForm.value.billingAddress;
    const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
    this.customerInfoService.getBillingByMobileNo(mobileNo)
    .then((res: any) => {
      console.log('res : ', res);
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
    // if (billingAddressSelected === this.ADDRESS_BY_SMART_CARD) {
    //   this.isSelect = true;
    //   this.modalBillAddress.hide();
    //   this.canReadSmartCard = true;
    //   this.customerInfo.emit({
    //     customer: this.infoBySmartCard,
    //     action: TransactionAction.READ_CARD
    //   });
    // } else {
    //   this.pageLoadingService.openLoading();
    //   const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
    //   this.customerInfoService.getBillingByMobileNo(mobileNo)
    //     .then((res) => {
    //       this.customerInfoService.setSelectedMobileNo(mobileNo);
    //       this.customerInfo.emit({
    //         customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
    //         action: TransactionAction.KEY_IN
    //       });
    //       this.modalBillAddress.hide();
    //       this.canReadSmartCard = true;
    //       this.pageLoadingService.closeLoading();
    //   })
    //   .catch((err) => {
    //     this.alertService.error(err.error.resultDescription);
    //   });
    // }
  }

  onBack = () => {

  }

  onHome = () => {
    this.homeService.goToHome();
  }

  onNext(): void {

  }

}

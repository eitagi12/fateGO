import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionAction, BillDeliveryAddress } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile, PageLoadingService } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
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

  public ADDRESS_BY_SMART_CARD: string = 'addressBySmartCard';
  public profile: ReadCardProfile;
  public messages: String;
  public canReadSmartCard: boolean = true;
  public selectBillingAddressForm: FormGroup;
  public infoBySmartCard: Object ;
  public nameTextBySmartCard: string;
  public addressTextBySmartCard: string;
  public listBillingAccount: Array<any>;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private customerInfoService: CustomerInformationService,
    private pageLoadingService: PageLoadingService
  ) {}

  ngOnInit(): void {
    this.createSelectBillingAddressForm();
    this.progressBarArea.nativeElement.style.display = 'none';
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': ['', [Validators.required]],
    });
  }

  readingCard(): any {
    let width: number;
    const  readCardEvent: any = {
      EVENT_CARD_INITIALIZED: 'OnInitialized',
      EVENT_CARD_INSERTED: 'OnCardInserted',
      EVENT_CARD_LOAD_PROGRESS: 'OnCardLoadProgress',
      EVENT_CARD_LOAD_COMPLETED: 'OnCardLoadCompleted',
      EVENT_CARD_LOAD_ERROR: 'OnCardLoadError',
      EVENT_CARD_REMOVED: 'OnCardRemoved',
    };
    const promises: any = new Promise((resolve, reject) => {
      this.readCardService.onReadCard().subscribe((readCard: any) =>  {
        this.progressBarArea.nativeElement.style.display = 'none';
        if (readCard.eventName === readCardEvent.EVENT_CARD_REMOVED) {
          this.messages =  '';
          width = 0;
          this.progressBarArea.nativeElement.style.display = 'block';
          this.progressBarReadSmartCard.nativeElement.style.width = '0%';
        }

        if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_COMPLETED) {
          this.messages =  'ตรวจสอบสำเร็จ โปรดดึงบัตรออก';
          this.progressBarArea.nativeElement.style.display = 'block';
          const customer: String = readCard.profile;
          if (customer) {
            resolve(customer);
          }
        }

        if (readCard.eventName === readCardEvent.EVENT_CARD_LOAD_ERROR) {
            alert('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาเสียบบัตรใหม่อีกครั้ง');
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
      });
    }).catch((err) => {
      console.log(err);
    });
      return promises;
  }

  public getbillingCycle(customer: any): void {
    this.infoBySmartCard = customer;
    this.nameTextBySmartCard = customer.titleName + ' ' + customer.firstName + ' ' + customer.lastName;
    const billDeliveryAddress: BillDeliveryAddress = {
      homeNo: customer.homeNo,
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
      })
      .catch(() => {
        this.listBillingAccountBox.nativeElement.style.display = 'none';
      });
  }

  public readCard(): void {
    new Promise((resolve, reject): void => {
      resolve(this.readingCard());
    }).then((customer: any) => {
      this.getbillingCycle(customer);
    }).catch((err) => {
      console.log(err);
    });
  }

  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingAddress(): void {
    const billingAddressSelected = this.selectBillingAddressForm.value.billingAddress;
    if (billingAddressSelected === this.ADDRESS_BY_SMART_CARD) {
      this.customerInfo.emit({
        customer: this.infoBySmartCard,
        action: TransactionAction.READ_CARD
      });
      this.modalBillAddress.hide();
      this.canReadSmartCard = true;
    } else {
      this.pageLoadingService.openLoading();
      const mobileNo = this.listBillingAccount[billingAddressSelected].mobileNo[0];
      this.customerInfoService.getBillingByMobileNo(mobileNo)
        .then((res) => {
          this.customerInfo.emit({
            customer: this.customerInfoService.mapAttributeFromGetBill(res.data.billingAddress),
            action: TransactionAction.KEY_IN
          });
          this.modalBillAddress.hide();
          this.canReadSmartCard = true;
          this.pageLoadingService.closeLoading();
      })
      .catch(() => {
        this.pageLoadingService.closeLoading();
      });
    }
  }
}

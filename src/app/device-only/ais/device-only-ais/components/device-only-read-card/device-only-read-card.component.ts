import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionAction } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile } from 'mychannel-shared-libs';
import { CustomerInformationService } from '../../services/customer-information.service';
@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})
export class DeviceOnlyReadCardComponent implements OnInit {
  public profile: ReadCardProfile;
  public messages: String;

  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  public canReadSmartCard: boolean = true;
  public selectBillingAddressForm: FormGroup;
  public infoBySmartCard: Object ;
  public nameTextBySmartCard: string;
  public addressTextBySmartCard: string;
  public listBillingAccount: Array<Object>;

  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  @ViewChild('progressBarArea') progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard') progressBarReadSmartCard: ElementRef;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private customerInformationService: CustomerInformationService
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
    this.addressTextBySmartCard = this.customerInformationService.convertBillingAddressToString(customer);
    this.customerInformationService.getBillingByIdCard(customer.idCardNo)
      .then((res) => {
        console.log('getBillingByIdCard : res ==>> ', res);
        if (res && res.data && res.data.billingAccountList) {
          this.listBillingAccount = res.data.billingAccountList;
          this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
        } else {
          // hide layout for list billing account
          // alert('ไม่มีข้อมูลอยู่ในระบบกรุณาตรวจสอบรายการใหม่');
        }
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
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
    this.customerInfo.emit({
      customer: this.listBillingAccount[0],
      action: TransactionAction.READ_CARD
    });
  }
}

import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TransactionAction } from 'src/app/shared/models/transaction.model';
import { ReadCardService, ReadCardProfile } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { promise } from 'protractor';
import { resolve, reject } from 'q';
// import { ReadCardProfile, ReadCardService, ReadCard } from '../../helpers/read-card.service';
@Component({
  selector: 'app-device-only-read-card',
  templateUrl: './device-only-read-card.component.html',
  styleUrls: ['./device-only-read-card.component.scss']
})
export class DeviceOnlyReadCardComponent implements OnInit {
  kioskApi: boolean;
  profile: ReadCardProfile;
  @Output() customerInfo: EventEmitter<Object> = new EventEmitter<Object>();

  public customerInfoMock: Array<Object> ;
  // =
  // [
  //   {
  //     idCardNo: '1234500678910',
  //     idCardType: 'บัตรประชาชน',
  //     titleName: 'นาย',
  //     firstName: 'ธีระยุทธ',
  //     lastName: 'เจโตวิมุติพงศ์',
  //     birthdate: '2019-12-10',
  //     gender: 'M',
  //     taxId: '1234500678910',
  //     name: 'นาย ธีระยุทธ เจโตวิมุติพงศ์',
  //     mobileNo: '0889540584',
  //     billingAddress: 'ซ.พหลโยธิน 9 ตึก ESV ชั้น 22 แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
  //     status: 'Active'
  //   }
  // ];
  public canReadSmartCard: boolean = true;
  public selectBillingAddressForm: FormGroup;

  @ViewChild('select_billing_address')
  selectBillingAddressTemplate: TemplateRef<any>;
  modalBillAddress: BsModalRef;

  @ViewChild('progressBarArea') progressBarArea: ElementRef;
  @ViewChild('progressBarReadSmartCard') progressBarReadSmartCard: ElementRef;

  constructor(
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private readCardService: ReadCardService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.createSelectBillingAddressForm();
    this.progressBarArea.nativeElement.style.display = 'none';
  }

  public createSelectBillingAddressForm(): void {
    this.selectBillingAddressForm = this.fb.group({
      'billingAddress': '',
    });
  }

  readingCard(): void {
    if (this.canReadSmartCard) {
      let width = 1;
      this.progressBarArea.nativeElement.style.display = 'block';
      this.canReadSmartCard = false;
      const id = setInterval(() => {
        if (width >= 100) {
          clearInterval(id);
        } else {
          width += 2;
          // this.progressBarReadSmartCard.nativeElement.style.width = width + '%';
          this.readCardService.onReadCard().subscribe(function(readCard: any): void {
            console.log(readCard);
            this.progressBarReadSmartCard.nativeElement.style.width = readCard.progress + '%';
            if (readCard.progress === 100 && readCard.profile) {
              const customer: String = readCard.profile.idCardNo;
              if (customer) {
                this.idCard = customer;
                return readCard;
                // resolve(customer);
              }
            } else {

            }
          });
        }
      }, 25);
      } else {
          setTimeout(() => {
            this.canReadSmartCard = true;
          }, 10);
      }
  }
  public getbillingCycle(customer: String): void {
    this.http.get(`/api/customerportal/newRegister/${1670300171423}/queryBillingAccount`).toPromise()
    .then((resp: any) => {
      this.customerInfoMock = resp.data.billingAccountList;
      if (this.customerInfoMock.length > 0) {
        this.modalBillAddress = this.bsModalService.show(this.selectBillingAddressTemplate);
      } else {
        alert('ไม่มีข้อมูลอยู่ในระบบกรุณาตรวจสอบรายการใหม่');
      }
    });
  }
  public readCard(): void {
    this.getbillingCycle('1670300171423');
    // console.log(this.readingCard());
    // new Promise((resolve, reject): void => {
    // }).then((customer: String) => {
    //   this.getbillingCycle(customer);
    // }).catch((err) => {
    //     console.log(err);
    // });
  }
  public closeModalSelectAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
  }

  public selectBillingAddress(): void {
    this.modalBillAddress.hide();
    this.canReadSmartCard = true;
    this.customerInfo.emit({
      customer: this.customerInfoMock[0],
      action: TransactionAction.READ_CARD
    });
  }
 public onError($event: String): void {

  }
  public onCompleted($event: String): void {

  }
}

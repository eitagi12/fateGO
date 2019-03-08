import { Component, OnInit, OnChanges } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';

export interface SelectPaymentDetail {
  paymentType?: string; // 'qrcode' | 'credit' | 'debit';
  qrCode?: PaymentDetailQRCode;
  bank?: PaymentDetailBank;
}
export interface PaymentDetailBank {
  abb: string;
  name: string;
  imageUrl: string;
  promotion?: string;
  installments: PaymentDetailInstallment[];
  remark?: string;
}
export interface PaymentDetailInstallment {
  installmentPercentage: number;
  installmentMonth: number;
}
export interface PaymentDetail {
  title?: string;
  header?: string;
  price?: string;
  headerAdvancePay?: string;
  priceAdvancePay?: string;
  specialAmountPercent?: string;
  specialAmountBaht?: string;
  qrCodes?: PaymentDetailQRCode[];
  banks?: PaymentDetailBank[];
  installments?: PaymentDetailInstallment[];
}
export interface PaymentDetailQRCode {
  id: number;
  name: string;
  imageUrl: string;
  qrType: string;
}
export interface PaymentDetailOption {
  isInstallment: boolean;
  isEnable: boolean;
}
@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;
  paymentForm: FormGroup;
  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail = {};
  paymentDetailOption: PaymentDetailOption;
  constructor(
   private fb: FormBuilder,
   private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.paymentDetail = {
      title: 'รูปแบบชำระเงิน',
      header: 'ค่าเครื่อง IPHONEX64 สี BLACK',
      price: '20780',
      headerAdvancePay: '',
      priceAdvancePay: '',
      specialAmountPercent: '',
      specialAmountBaht: '',
      qrCodes: this.getQRCodeData(),
      banks: this.getBankData()
    };

    this.selectPaymentDetail = {
      paymentType: 'qrcode',
      qrCode: this.getQRCodeData()[1],
      bank: {
        abb: 'CITI',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITI_CITI.png',
        installments: [{ installmentPercentage: 0, installmentMonth: 6 }],
        name: 'ซิตี้แบงก์',
        remark: null,
      }
    };

    this.paymentDetailOption = {
      isInstallment: true,
      isEnable: true
    };
  }
  onHome(): void {
  }

  onBack(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      paymentType: [null, Validators.required]
    });
  }

  getQRCodeData(): PaymentDetailQRCode[] {
    return [
      {
        id: 1,
        name: 'Thai QR Payment',
        imageUrl: 'assets/images/icon/Thai_Qr_Payment.png',
        qrType: '003'
      },
      {
        id: 2,
        name: 'Rabbit Line Pay',
        imageUrl: 'assets/images/icon/Rabbit_Line_Pay.png',
        qrType: '002'
      }
    ];
  }

  getBankData(): PaymentDetailBank[] {
    return [
      {
        abb: 'CITIREADY',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITIREADY_citibank02.jpg',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'ซิตี้แบงก์ เรดดี้เครดิต',
        remark: null,
      },
      {
        abb: 'CITI',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/CITI_CITI.png',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'ซิตี้แบงก์',
        remark: null,
      },
      {
        abb: 'SCB',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCB_SCB02.png',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'ไทยพาณิชย์ จำกัด (มหาชน)',
        remark: null,
      },
      {
        abb: 'KBNK',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/KBNK_kBank02.png',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'กสิกรไทย จำกัด (มหาชน)',
        remark: null,
      },
      {
        abb: 'NBNK',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/NBNK_NBNK.png',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'ธนชาต จำกัด(มหาชน)',
        remark: null,
      },
      {
        abb: 'SCIB',
        imageUrl: 'https://10.104.249.89/CPC-FE-WEB/api/contents/upload/SCIB_siamcitybank.jpg',
        installments: [
          {
            installmentPercentage: 0,
            installmentMonth: 3
          },
          {
            installmentPercentage: 0,
            installmentMonth: 6
          },
          {
            installmentPercentage: 0,
            installmentMonth: 12
          },
        ],
        name: 'นครหลวงไทย  จำกัด (มหาชน)',
        remark: null,
      }
    ];
  }
  onSelectQRCode(qrCode: PaymentDetailQRCode): void {
    console.log('onSelectQRCode', qrCode);
    this.selectPaymentDetail.qrCode = qrCode;

  }
  onSelectBank(bank: PaymentDetailBank): void {
    console.log('onSelectBank', bank);
    this.selectPaymentDetail.bank = bank;
    console.log('bank.installments', bank.installments);
    console.log('this.paymentDetail.installments', this.paymentDetail.installments);

    this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
  }
  onSelectInstallment(installment: PaymentDetailInstallment[]): void {
    console.log('onSelectInstallment', installment);
    this.selectPaymentDetail.bank.installments = installment;
  }
  onSelectPaymentType(paymentType: string): void {
    console.log('onSelectPaymentType', paymentType);
    this.selectPaymentDetail.paymentType = paymentType;
  }
  onSelectPaymentTypeAdvancePay(paymentType: string): void {
    console.log('onSelectPaymentType', paymentType);
    this.selectPaymentDetail.paymentType = paymentType;
  }
}

import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { ShoppingCart, PaymentDetail, PaymentDetailQRCode, PaymentDetailBank, SelectPaymentDetail, PaymentDetailInstallment, PaymentDetailOption } from '../../../../../../../node_modules/mychannel-shared-libs';

@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ONLY_AIS;
  shoppingCart: ShoppingCart;
  paymentDetail: PaymentDetail;
  selectPaymentDetail: SelectPaymentDetail = {};
  paymentDetailOption: PaymentDetailOption;
  constructor() { }

  ngOnInit() {
    this.shoppingCart = {
      fullName: 'นาย ธีระยุทธ เจโตวิมุติพงศ์',
      mobileNo: '0889540584',
      campaignName: 'AIS Hot Deal',
      commercialName: 'APPLE',
      qty: 1,
      price: 20780
    };

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
onSelectQRCode(qrCode: PaymentDetailQRCode) {
  console.log('onSelectQRCode', qrCode);
  this.selectPaymentDetail.qrCode = qrCode;

}
onSelectBank(bank: PaymentDetailBank) {
  console.log('onSelectBank', bank);
  this.selectPaymentDetail.bank = bank;
  console.log('bank.installments', bank.installments);
  console.log('this.paymentDetail.installments', this.paymentDetail.installments);

  this.paymentDetail.installments = bank.installments; // Object.assign({}, bank.installments);
}
onSelectInstallment(installment: PaymentDetailInstallment[]) {
  console.log('onSelectInstallment', installment);
  this.selectPaymentDetail.bank.installments = installment;
}
onSelectPaymentType(paymentType: string) {
  console.log('onSelectPaymentType', paymentType);
  this.selectPaymentDetail.paymentType = paymentType;
}
onSelectPaymentTypeAdvancePay(paymentType: string) {
  console.log('onSelectPaymentType', paymentType);
  this.selectPaymentDetail.paymentType = paymentType;
}
}

import { Injectable } from '@angular/core';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { TokenService, User } from 'mychannel-shared-libs';
import * as moment from 'moment';
import { Transaction } from '../models/transaction.model';

const Moment = moment;
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private user: User;
  constructor(
    private tokenService: TokenService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.tokenService.getUser();
  }

  private get settings(): NgxResource<Transaction> {
    return this.localStorageService
      .load(`OmniNewRegister`)
      .setDefaultValue({});
  }

  remove(): void {
    this.settings.remove();
  }

  save(transaction: Transaction): void {
    this.settings.save(transaction);
  }

  update(transaction: Partial<Transaction>): void {
    this.remove();
    this.settings.update(transaction);
  }

  load(): Transaction {
    return this.settings.value;
  }

  public setDataMockup(): void {

    const transaction: any = {
      data: {
        orderType: 'STOCK_ONLINE',
        productType: 'DEVICE',
        productSubType: 'HANDSET',
        brand: 'SAMSUNG',
        model: 'J200',
        color: 'BLACK',
        company: 'AWN',
        matcode: 'NEWSAM0J200-BK01',
        productPrice: '45000.00',
        productDiscount: '1000.00',
        productNetPrice: '44000.00',
        locationDestination: '1100',
        locationDestName: 'สาขาอาคารเอไอเอส 2',
        preBookingNo: 'WS20200108102233',
        cusName: 'นางสาวปิ่นแก้ว ศิริวรรณา',
        receiptNum: '117720010003450',
        receiptType: 'FULL',
        docType: 'RECEIPT',
        receiptDt: '08/01/2020',
        deliveryDt: '08/01/2020 14:27',
        endProjectDt: '15/01/2020',
        statusFlg: 'CRC',
        statusText: 'WAITING',
        commercialName: 'J200 GALAXY J2',
        cardId: '1101500737451',
        statusDtm: '08/01/2020 16:48:28',
        action: 'READ_CARD',
        transactionType: 'OmniNewRegister',
        flagKnoxguard: false,
        customer: {
          zipCode: '11110',
          province: 'นนทบุรี',
          amphur: 'บางบัวทอง',
          tumbol: 'บางคูรัด',
          street: '',
          soi: '0',
          moo: '10',
          homeNo: '447/165',
          mainMobile: '',
          caNumber: '',
          expireDate: '23/04/2567',
          issueDate: '30/05/2558',
          gender: 'F',
          birthdate: '24/04/2537',
          lastNameEn: 'Siriwanna',
          firstNameEn: 'Pinkaew',
          lastName: 'ศิริวรรณา',
          firstName: 'ปิ่นแก้ว',
          titleName: 'น.ส.',
          idCardType: 'บัตรประชาชน',
          // tslint:disable-next-line: max-line-length
          imageReadSmartCard: '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',
          idCardNo: '1101500737451',
        },
        mainPackage: {
          mainPackageCode: 'P00001',
          mainPackageName: 'แพ็กเกจ NEXT G Max Speed 1599 บาท',
          // tslint:disable-next-line: max-line-length
          mainPackageDesc: 'NEXT G Max Speed ค่าบริการ 1599 บาท โทร 1200 นาที เน็ต 4G/3G ไม่จำกัดความเร็วสูงสุดไม่เกิน 300Mbps, AIS SUPER WiFi และ NEXT G ไม่จำกัด, ส่วนเกินโทร/VDO call นาทีละ 1.50บ., SMS 3บ., MMS 4บ., 12 รอบบิล พร้อมความบันเทิงเต็ม MAX',
          matAirtime: 'AIRTIME4000EXVAT_DISC400_10M',
          promotionPrice: 899.00,
          payAdvance: 2000.00,
          payAdvanceDiscount: 400,
          durationContract: '10'
        },
        campaign: {
          campaignName: 'Hot deal NEW',
          campaignDesc: 'Hot deal NEW',
          conditionCode: 'CONDITION_2'
        },
        simCard: {
          simSerial: '',
          mobileNo: '0880521111'
        },
        signature: '',
        billingInformation: {
          billCycles: [
            {
              billingName: 'KANYARATH RIDNIM Billing A-- 0889544399',
              mobileNo: [
                '0889544399'
              ],
              billCycleFrom: '1',
              billCycleTo: 'สิ้นเดือน',
              payDate: '',
              billingAddr: 'ที่อยู่ 1   ตำบลป่าโมก อำเภอป่าโมก อ่างทอง 14130',
              billAcctNo: '31900050206923',
              bill: '',
              billingSystem: 'IRB',
              productPkg: '',
              billMedia: 'SMS and eBill'
            }
          ],
          billCyclesNetExtreme: [
            {
              billingName: 'KANYARATH RIDNIM Billing A-- 0889544399',
              mobileNo: [
                '0889544399'
              ],
              billCycleFrom: '1',
              billCycleTo: 'สิ้นเดือน',
              payDate: '',
              billingAddr: 'ที่อยู่ 1   ตำบลป่าโมก อำเภอป่าโมก อ่างทอง 14130',
              billAcctNo: '31900050206923',
              bill: '18',
              billingSystem: 'IRB',
              productPkg: '',
              billMedia: 'SMS and eBill'
            }
          ],
          billCycleData: [
            {
              email: 'test@test.com',
              receiveBillMethod: '',
              billMedia: 'SMS and eBill',
              billChannel: '',
              mobileNoContact: '0994480011',
              phoneNoContact: '0895634778',
              billingMethodText: '',
              billCycleText: '',
              billAddressText: '',
            }
          ]
        }
      }
    };
    localStorage.setItem('OmniNewRegister', JSON.stringify(transaction));
  }

}

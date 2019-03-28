import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from '../models/transaction.model';
import { Utils, TokenService, AWS_WATERMARK, ImageUtils } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class CreatePreToPostService {

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService
  ) {
  }

  createPreToPost(transaction: Transaction): Promise<any> {
    return this.getRequestCreatePreToPost(transaction).then((data) => {
      // console.log('data', data);
      return this.http.post(
        '/api/customerportal/newRegister/createConvertPreToPost',
        data
      ).toPromise();
    });
  }

  getRequestCreatePreToPost(transaction: Transaction): Promise<any> {
    return new Promise((resolve, reject) => {

      const user = this.tokenService.getUser();
      const action = transaction.data.action;
      const customer = transaction.data.customer;
      const billingInformation = transaction.data.billingInformation;
      const mainPackage = transaction.data.mainPackage;
      const mainPackageOneLove = transaction.data.mainPackageOneLove;
      const onTopPackage = transaction.data.onTopPackage;
      const simCard = transaction.data.simCard;
      const billDeliveryAddress = transaction.data.billingInformation.billDeliveryAddress;

      const billCycleData = billingInformation.billCycleData;

      const data: any = {
        isNewCa: !!!customer.caNumber, /*required*/
        isNewBa: billingInformation.mergeBilling ? false : true, /*required*/
        imageSignature: customer.imageSignature || '', /*required*/
        ascCode: '',
        idCardType: customer.idCardType, /*required*/
        idCardNo: customer.idCardNo, /*required*/
        firstName: customer.firstName, /*required*/
        lastName: customer.lastName, /*required*/
        caNumber: customer.caNumber || '',
        birthdate: customer.birthdate || '',
        gender: customer.gender || 'M', /*required*/
        mobileNumberContact: billCycleData.mobileNoContact,
        phoneNumberContact: billCycleData.phoneNoContact || '',
        emailAddress: billCycleData.email || '',
        receiveBillMethod: billCycleData.receiveBillMethod, /*required*/
        billCycleEApp: billCycleData.billCycleText, /*required*/
        orderType: 'Change Charge Type', /*required*/
        simSerialNo: simCard.simSerial, /*required*/
        mobileNo: simCard.mobileNo, /*required*/
        locationCode: user.locationCode, /*required*/
        employeeId: '',
        baNumber: billingInformation.mergeBilling ? billingInformation.mergeBilling.billAcctNo : '',
        billMedia: billingInformation.mergeBilling ? billingInformation.mergeBilling.billMedia : billCycleData.billMedia, /*required*/
        billName: billingInformation.mergeBilling ? billingInformation.mergeBilling.billingName : '',
        billCycle: billingInformation.mergeBilling ? billingInformation.mergeBilling.bill : customer.billCycle,
        billDeliveryAddress: billingInformation.mergeBilling ? billingInformation.mergeBilling.billingAddr : '',
        billHomeNo: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.homeNo : customer.homeNo || '',
        // tslint:disable-next-line:max-line-length
        billBuildingName: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.buildingName : customer.buildingName || '',
        billFloor: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.floor : customer.floor || '',
        billRoom: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.room : customer.room || '',
        billMoo: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.moo : customer.moo || '',
        billMooBan: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.mooBan : customer.mooBan || '',
        billSoi: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.soi : customer.soi || '',
        billStreet: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.street : customer.street || '',
        billTumbol: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.tumbol : customer.tumbol || '',
        billAmphur: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.amphur : customer.amphur || '',
        // tslint:disable-next-line:max-line-length
        billProvince: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.province : customer.province || '',
        // tslint:disable-next-line:max-line-length
        billZipCode: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.zipCode : customer.zipCode || '',
        orderVerify: '',
        /* eApplication Parameters */
        homeNo: customer.homeNo || '',
        buildingName: customer.buildingName || '',
        floor: customer.floor || '',
        room: customer.room || '',
        moo: customer.moo || '',
        mooBan: customer.mooBan || '',
        soi: customer.soi || '',
        street: customer.street || '',
        tumbol: customer.tumbol || '',
        amphur: customer.amphur || '',
        province: customer.province || '',
        zipCode: customer.zipCode || '',
        isPersoSim: simCard.persoSim,
        mainPackage: {
          packageName: mainPackage.promotionPackage, /*required*/
          shortNameThai: mainPackage.shortNameThai || '',
          statementThai: mainPackage.statementThai || '',
          mainPackageOneLove: [],
          attributeValues: [
            simCard.mobileNo || ''
          ],
        }, /*required*/
        onTopPackages: [],
        promotionActionStatus1: 'Add', /*When SelectedPackages*/
      };

      // เช็ค Eng Flag จากจังหวัด
      if (data.billProvince.match(/[a-z]/i)) {
        data.engFlag = 'Y';
      } else {
        data.engFlag = 'N';
      }

      if (action === TransactionAction.READ_PASSPORT || action === TransactionAction.READ_PASSPORT_REPI) {
        data.accountSubCat = 'FOR';
        data.titleName = customer.titleName;
        data.citizenship = customer.nationality;

        if (customer.nationality !== 'Thailand') {
          data.billLanguage = 'English';
        }

      } else {
        data.accountSubCat = 'THA';
        data.titleName = this.utils.getPrefixName(customer.titleName); /*required*/
      }

      // orderVerify
      if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
        data.orderVerify = 'Smart Card';
      } else {
        data.orderVerify = 'User';
      }

      // has one love
      if (mainPackageOneLove && mainPackageOneLove.length > 0) {
        data.mainPackage.mainPackageOneLove = [];
        data.mainPackage.mainPackageOneLove = mainPackageOneLove.map((onelove) => {
          return {
            Parameter: onelove
          };
        });

        // ถ้าเป็น one love ต้องไม่ส่ง promotionActionStatus1
        delete data.promotionActionStatus1;
      }

      // Select on top package
      if (onTopPackage) {
        data.promotionActionStatus2 = '';
        // TODO ...
        // data.promotionActionStatus2 = 'Add';
      }

      // Net exstream and Merge billing
      if (billingInformation.mergeBilling && billingInformation.mergeBilling.mobileNo) {
        data.mobileNoRef = ''; /*เบอร์รวมบิล*/
        data.mobileNoRef = billingInformation.mergeBilling.mobileNo[0];
      }

      if (action === TransactionAction.READ_CARD || action === TransactionAction.READ_CARD_REPI) {
        data.imageReadSmartCard = customer.imageReadSmartCard;
        data.firstNameEn = customer.firstNameEn;
        data.lastNameEn = customer.lastNameEn;
        data.issueDate = customer.issueDate;
        data.expireDate = customer.expireDate;
        return resolve(data);
      }

      if (action === TransactionAction.READ_PASSPORT || action === TransactionAction.READ_PASSPORT_REPI) {
        new ImageUtils().combine([
          customer.imageReadPassport,
          customer.imageSignatureSmartCard,
          AWS_WATERMARK
        ]).then((imageSmatCard) => {
          data.imageTakePhoto = imageSmatCard;
          return resolve(data);
        }).catch((error) => {
          return reject(error);
        });
        return; // end read passport
      }

      if (action === TransactionAction.KEY_IN) {
        new ImageUtils().combine([
          customer.imageReadPassport,
          customer.imageSignatureSmartCard,
          AWS_WATERMARK
        ]).then((imageSmatCard) => {
          data.imageTakePhoto = imageSmatCard;
          return resolve(data);
        }).catch((error) => {
          return reject(error);
        });
        return; // end key in
      }

    });
  }
}

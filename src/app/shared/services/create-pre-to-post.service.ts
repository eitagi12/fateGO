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
      return this.http.post(
        '/api/customerportal/newRegister/createConvertPreToPost',
        data
      ).toPromise();
    });
  }

  getRequestCreatePreToPost(transaction: Transaction): any {

    const user = this.tokenService.getUser();
    const action = transaction.data.action;
    const customer = transaction.data.customer;
    const billingInformation = transaction.data.billingInformation;
    const mainPackage = transaction.data.mainPackage;
    const mainPackageOneLove = transaction.data.mainPackageOneLove;
    const onTopPackage = transaction.data.onTopPackage;
    const simCard = transaction.data.simCard;
    const customerDeliveryAddress = transaction.data.billingInformation.billDeliveryAddress;

    const billCycleData = billingInformation.billCycleData;

    const data: any = {
      isNewCa: !!!customer.caNumber, /*required*/
      isNewBa: billingInformation.mergeBilling ? false : true, /*required*/
      imageSignature: customer.imageSignature || '', /*required*/
      ascCode: '',
      accountSubCat: 'THA',
      idCardType: customer.idCardType, /*required*/
      idCardNo: customer.idCardNo, /*required*/
      titleName: this.utils.getPrefixName(customer.titleName), /*required*/
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
      billHomeNo: billingInformation.mergeBilling ? '' : customerDeliveryAddress.homeNo || customer.homeNo,
      billBuildingName: billingInformation.mergeBilling ? '' : customerDeliveryAddress.buildingName || customer.buildingName,
      billFloor: billingInformation.mergeBilling ? '' : customerDeliveryAddress.floor || customer.floor,
      billRoom: billingInformation.mergeBilling ? '' : customerDeliveryAddress.room || customer.room,
      billMoo: billingInformation.mergeBilling ? '' : customerDeliveryAddress.moo || customer.moo,
      billMooBan: billingInformation.mergeBilling ? '' : customerDeliveryAddress.mooBan || customer.mooBan,
      billSoi: billingInformation.mergeBilling ? '' : customerDeliveryAddress.soi || customer.soi,
      billStreet: billingInformation.mergeBilling ? '' : customerDeliveryAddress.street || customer.street,
      billTumbol: billingInformation.mergeBilling ? '' : customerDeliveryAddress.tumbol || customer.tumbol,
      billAmphur: billingInformation.mergeBilling ? '' : customerDeliveryAddress.amphur || customer.amphur,
      billProvince: billingInformation.mergeBilling ? '' : customerDeliveryAddress.province || customer.province,
      billZipCode: billingInformation.mergeBilling ? '' : customerDeliveryAddress.zipCode || customer.zipCode,
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

    // orderVerify
    if (this.isReadCard(action)) {
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

    if (this.isReadCard(action)) {
      data.imageReadSmartCard = customer.imageReadSmartCard;
      data.firstNameEn = customer.firstNameEn;
      data.lastNameEn = customer.lastNameEn;
      data.issueDate = customer.issueDate;
      data.expireDate = customer.expireDate;
      return Promise.resolve(data);
    } else {
      return new ImageUtils().combine([
        customer.imageSmartCard,
        customer.imageSignatureSmartCard,
        AWS_WATERMARK
      ]).then((imageSmatCard) => {
        data.imageTakePhoto = imageSmatCard;
        return Promise.resolve(data);
      });
    }
  }

  isReadCard(action: TransactionAction): boolean {
    return !!(action === TransactionAction.READ_CARD ||
      action === TransactionAction.READ_CARD_REPI);
  }
}

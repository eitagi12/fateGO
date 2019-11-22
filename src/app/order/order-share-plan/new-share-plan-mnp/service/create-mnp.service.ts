import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utils, TokenService, AWS_WATERMARK, ImageUtils } from 'mychannel-shared-libs';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CreateMnpService {

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService
  ) { }

  createMnp(transaction: Transaction): Promise<any> {
    return this.getRequestCreateMnp(transaction).then((data) => {
      return this.http.post(
        '/api/customerportal/newRegister/createOrderPortIn',
        data
      ).toPromise();
    });
  }

  getRequestCreateMnp(transaction: Transaction): any {
    const user = this.tokenService.getUser();
    const action = transaction.data.action;
    const customer = transaction.data.customer;
    const billingInformation = transaction.data.billingInformation;
    const simCard = transaction.data.simCard;
    const mainPackage = transaction.data.mainPackageMember;
    const mainPackageOneLove = transaction.data.mainPackageOneLove;
    const onTopPackage = transaction.data.onTopPackage;
    const billDeliveryAddress = transaction.data.billingInformation.billDeliveryAddress;
    const billCycleData = billingInformation.billCycleData;
    const reasonCode = transaction.data.reasonCode;

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
      mobileNumberContact: billCycleData.mobileNoContact || '',
      phoneNumberContact: billCycleData.phoneNoContact || '',
      emailAddress: billCycleData.email || '',
      receiveBillMethod: billCycleData.receiveBillMethod || '',
      billCycleEApp: billCycleData.billCycleText || '',
      orderType: 'Port - In', /*required*/
      simSerialNo: simCard.simSerialMember || '', /*required*/
      mobileNo: simCard.mobileNoMember || '', /*required*/
      locationCode: user.locationCode || '', /*required*/
      employeeId: '',
      baNumber: billingInformation.mergeBilling ? billingInformation.mergeBilling.billAcctNo : '',
      billMedia: billingInformation.mergeBilling ? billingInformation.mergeBilling.billMedia : billCycleData.billMedia, /*required*/
      billName: billingInformation.mergeBilling ? billingInformation.mergeBilling.billingName : '',
      // tslint:disable-next-line: max-line-length
      billCycle: billingInformation.mergeBilling ? billingInformation.mergeBilling.bill : billingInformation.billCycle.bill ? billingInformation.billCycle.bill : customer.billCycle,
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
      billProvince: billingInformation.mergeBilling ? '' : billDeliveryAddress ? (billDeliveryAddress.province || '').replace(/มหานคร$/, '') : (customer.province || '').replace(/มหานคร$/, ''),
      // tslint:disable-next-line:max-line-length
      billZipCode: billingInformation.mergeBilling ? '' : billDeliveryAddress ? billDeliveryAddress.zipCode : customer.zipCode || '',
      orderVerify: '',
      /* eApplication Parameters */
      homeNo: customer.homeNo || '',
      buildingName: '',
      floor: customer.floor || '',
      room: customer.room || '',
      moo: customer.moo || '',
      mooBan: customer.mooBan || '',
      soi: customer.soi || '',
      street: customer.street || '',
      tumbol: customer.tumbol || '',
      amphur: customer.amphur || '',
      province: (customer.province || '').replace(/มหานคร$/, ''),
      zipCode: customer.zipCode || '',
      reasonCode: reasonCode, /*required*/
      chargeType: 'Post-paid' || '',
      customerPinCode: customer.customerPinCode || '12345678',
      orderChannel: '',
      mainPackage: {
        packageName: mainPackage.customAttributes.promotionName, /*required*/
        shortNameThai: mainPackage.shortNameThai || '',
        statementThai: mainPackage.statementThai || '',
        mainPackageOneLove: [],
        attributeValues: [
          simCard.mobileNo || ''
        ]
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

    if (action === TransactionAction.READ_CARD) {
      data.imageReadSmartCard = customer.imageReadSmartCard;
      data.firstNameEn = customer.firstNameEn;
      data.lastNameEn = customer.lastNameEn;
      data.issueDate = customer.issueDate;
      data.expireDate = customer.expireDate;
      return Promise.resolve(data);
    }
    if (action === TransactionAction.READ_PASSPORT) {
      return new ImageUtils().combine([
        // customer.imageReadPassport,
        customer.imageSignatureSmartCard,
        AWS_WATERMARK
      ]).then((imageSmatCard) => {
        data.imageTakePhoto = imageSmatCard;
        return Promise.resolve(data);
      }).catch((error) => {
        throw new Error(error);
      });
    }

    if (action === TransactionAction.KEY_IN) {
      return new ImageUtils().combine([
        // customer.imageReadPassport,
        customer.imageSignatureSmartCard,
        AWS_WATERMARK
      ]).then((imageSmatCard) => {
        data.imageTakePhoto = imageSmatCard;
        return Promise.resolve(data);
      }).catch((error) => {
        throw new Error(error);
      });
    }
  }

  isReadCard(action: TransactionAction): boolean {
    return !!(action === TransactionAction.READ_CARD);
  }

}

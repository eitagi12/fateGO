import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionAction } from '../models/transaction.model';
import { TokenService, Utils, ImageUtils, AWS_WATERMARK } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class CreateNewRegisterService {

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private tokenService: TokenService
  ) {
  }

  createNewRegister(transaction: Transaction): Promise<any> {
    return this.saveFaceImage(transaction)
      .then(() => {
        return this.getRequestCreateNewRegister(transaction).then((data) => {
          return this.http.post(
            '/api/customerportal/newRegister/createNewRegistration',
            data
          ).toPromise();
        });
      });
  }

  saveFaceImage(transaction: Transaction): Promise<any> {
    const user = this.tokenService.getUser();
    const customer = transaction.data.customer;
    const faceRecognition = transaction.data.faceRecognition;
    const simCard = transaction.data.simCard;
    const action = transaction.data.action;
    const channelKyc = transaction.data.faceRecognition.kyc;
    let channel = 'MC';
    if (channelKyc) {
      channel += '_KYC';
    }
    if (transaction.data.action === TransactionAction.KEY_IN) {
      channel += '_PT';
    } else {
      channel += '_SM';
    }
    let base64Card: any;
    if (action === TransactionAction.READ_CARD) {
      base64Card = customer.imageReadSmartCard;
    } else if (action === TransactionAction.READ_PASSPORT) {
      base64Card = customer.imageReadPassport;
    } else {
      base64Card = customer.imageSmartCard;
    }

    const param: any = {
      userId: user.username,
      locationCode: user.locationCode,
      idCardType: customer.idCardType === 'บัตรประชาชน' ? 'Thai National ID' : 'OTHER',
      customerId: customer.idCardNo || '',
      mobileNo: simCard.mobileNo || '',
      base64Card: base64Card ? `data:image/jpg;base64,${base64Card}` : '',
      base64Face: faceRecognition.imageFaceUser ? `data:image/jpg;base64,${faceRecognition.imageFaceUser}` : '',
      channel: channel,
      userchannel: 'MyChannel'
    };
    return this.http.post('/api/facerecog/save-imagesV2', param).toPromise()
      .catch(e => {
        console.log(e);
        return Promise.resolve(null);
      });

  }

  getRequestCreateNewRegister(transaction: Transaction): Promise<any> {
    try {
      const user = this.tokenService.getUser();
      const action = transaction.data.action;
      const customer = transaction.data.customer;
      const faceRecognition = transaction.data.faceRecognition;
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
        orderType: 'New Registration', /*required*/
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
        billProvince: billingInformation.mergeBilling ? '' : billDeliveryAddress ? (billDeliveryAddress.province || '').replace(/มหานคร$/, '') : (customer.province || '').replace(/มหานคร$/, ''),
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
        province: (customer.province || '').replace(/มหานคร$/, ''),
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
        engFlag: 'N',
        promotionActionStatus1: 'Add', /*When SelectedPackages*/
      };

      // เช็ค Eng Flag จากจังหวัด
      if (data.billProvince.match(/[a-z]/i)) {
        data.engFlag = 'Y';
      } else {
        data.engFlag = 'N';
      }

      if (action === TransactionAction.READ_PASSPORT) {
        data.accountSubCat = 'FOR',
          data.titleName = customer.titleName,
          data.citizenship = customer.nationality;
      } else {
        data.accountSubCat = 'THA',
          data.titleName = this.utils.getPrefixName(customer.titleName); /*required*/
      }

      // orderVerify
      if (faceRecognition && faceRecognition.kyc) {
        if (action === TransactionAction.READ_CARD) {
          data.orderVerify = 'Smart KYC';
        } else {
          data.orderVerify = 'User KYC';
        }
      } else {
        if (action === TransactionAction.READ_CARD) {
          data.orderVerify = 'Smart Face';
        } else {
          data.orderVerify = 'User Face';
        }
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
        if (customer.nationality !== 'Thailand') {
          data.billLanguage = 'English';
        }
        return new ImageUtils().combine([
          customer.imageReadPassport,
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
    } catch (error) {
      console.log('error', error);

    }

  }

}

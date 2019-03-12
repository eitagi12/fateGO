import { ChargeType, PaymentDetailBank, PaymentDetailQRCode, } from 'mychannel-shared-libs';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';
import { DeviceOrderAisNewRegisterConfirmUserInformationPageComponent } from 'src/app/device-order/ais/device-order-ais-new-register/containers/device-order-ais-new-register-confirm-user-information-page/device-order-ais-new-register-confirm-user-information-page.component';

export enum TransactionType {
  DEVICE_ORDER_NEW_REGISTER_AIS = 'NewRegisterAIS',
  DEVICE_ORDER_NEW_REGISTER_ASP = 'NewRegisterASP',
  DEVICE_ORDER_PRE_TO_POST_AIS = 'ConvertPreToPostAIS',
  DEVICE_ORDER_PRE_TO_POST_ASP = 'ConvertPreToPostASP',
  DEVICE_ORDER_MNP_AIS = 'Port-InAIS',
  DEVICE_ORDER_MNP_ASP = 'Port-InASP',
  DEVICE_ORDER_EXISTING_AIS = 'ExistingAIS',
  DEVICE_ORDER_EXISTING_ASP = 'ExistingASP',
  // pure
  ORDER_NEW_REGISTER = 'NewRegister',
  ORDER_PRE_TO_POST = 'ConvertPreToPost',
  ORDER_MNP = 'Port-In',
  ORDER_EXISTING = 'Existing'
}

export enum TransactionAction {
  READ_CARD = 'READ_CARD',
  READ_CARD_REPI = 'READ_CARD_REPI',
  KEY_IN = 'KEY_IN',
  KEY_IN_REPI = 'KEY_IN_REPI',
}

export interface Transaction {
  transactionId?: string;
  createDate?: string;
  createBy?: string;
  lastUpdateDate?: string;
  lastUpdateBy?: string;
  data?: TransactionData;
  issueBy?: string;
}

export interface TransactionData {
  transactionType: TransactionType;
  action: TransactionAction;
  mainPromotion?: MainPromotion;
  airTime?: AirTime;
  customer?: Customer;
  simCard?: SimCard;
  mainPackage?: MainPackage;
  onTopPackage?: OnTopPackage;
  mainPackageOneLove?: any[];
  mobileCarePackage?: MobileCarePackage;
  faceRecognition?: FaceRecognition;
  existingMobileCare?: ExistingMobileCare;
  order?: Order;
  reasonCode?: string;
  billingInformation?: BillingInformation;
  seller?: Seller;
  payment?: Payment;
  advancePayment?: Payment;
  receiptInfo?: ReceiptInfo;
  queue?: Queue;
  preBooking?: Prebooking;
  status?: Status;
  discount?: Discount;
}

export interface ProductStock {
  model: string;
  company: string;
  subStock?: string;
  productType: number;
  productSubType: string;
  productName: string;
  brand: string;
  color: string;
  location?: string;
  locationName?: string;
  qty: number;
  flagReserve?: string;
  flagWaiting?: string;
  thumbnail?: string;
  colorCode?: string;
}

export interface Payment {
  method: string;
  type: string;
  qrCode: PaymentDetailQRCode;
  bank: PaymentDetailBank;
}
export interface MainPromotion {
  campaign: any;
  privilege?: any;
  trade?: any;
}

// tslint:disable-next-line:no-empty-interface
export interface AirTime {
  [key: string]: any;
}

export interface Customer {
  idCardNo: string;
  idCardType: string;
  titleName: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  homeNo?: string;
  moo?: string;
  mooBan?: string;
  buildingName?: string;
  floor?: string;
  room?: string;
  street?: string;
  soi?: string;
  tumbol?: string;
  amphur?: string;
  province?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  issueDate?: string;
  expireDate?: string;
  zipCode?: string;
  mainMobile?: string;
  mainPhone?: string;
  billCycle?: string;
  caNumber?: string;
  imageSignature?: string; // Contract signature
  imageSignatureSmartCard?: string;
  imageSmartCard?: string;
  imageReadSmartCard?: string;
  customerPinCode?: string;
  privilegeCode?: string;
}

export interface SimCard {
  mobileNo: string;
  simSerial?: string;
  imei?: string;
  billingSystem?: string;
  moblieNoTypeA?: string;
  chargeType?: ChargeType;
  persoSim?: boolean;
}

export interface MainPackage {
  [key: string]: any;
}

export interface OnTopPackage {
  [key: string]: any;
}

export interface MainPackageOneLove {
  [key: string]: any;
}

export interface MobileCarePackage {
  [key: string]: any;
}

export interface FaceRecognition {
  imageFaceUser: string;
  kyc?: boolean;
}

export interface Order {
  orderNo?: string;
  orderDate?: string;
  soId?: string;
}

export interface BillingInformation {
  mergeBilling?: BillingAccount;
  // รอบบิลใหม่
  billCycle?: BillCycle;
  // all billing account
  billCycles?: BillingAccount[];
  // net extrem billing
  billCyclesNetExtreme?: BillingAccount[];
  // change value billing
  billCycleData?: BillingAccountData;
  // send bill devilery address
  billDeliveryAddress?: BillDeliveryAddress;
}

export interface BillCycle {
  bill: string;
  billCycle: string;
  billDefault: string;
  payDate: string;
}

export interface BillingAccount {
  bill: string;
  billAcctNo: string;
  billCycleFrom: string;
  billCycleTo: string;
  billChannel?: 'eBill' | 'other' | 'address';
  billMedia: string;
  billingAddr: string;
  billingName: string;
  billingSystem: string;
  mobileNo: string[];
  payDate: string;
  productPkg: string;
}

export interface BillingAccountData {
  email?: string;
  receiveBillMethod?: string;
  billMedia?: string;
  billChannel?: 'eBill' | 'other' | 'address';

  mobileNoContact?: string;
  phoneNoContact?: string;

  billingMethodText?: string;
  billCycleText?: string;
  billAddressText?: string;
}

export interface BillDeliveryAddress {
  homeNo: string;
  moo?: string;
  mooBan?: string;
  room?: string;
  floor?: string;
  buildingName?: string;
  soi?: string;
  street?: string;
  province: string;
  amphur: string;
  tumbol: string;
  zipCode: string;
}

export interface Seller {
  sellerName?: string;
  locationName?: string;
  locationCode?: string;
  sellerNo?: string;
  shareUser?: string;
  employeeId?: string;
  ascCode?: string;
}

export interface Queue {
  [key: string]: any;
}

export interface ExistingMobileCare {
  promotionName: string;
  productClass: string;
  produuctGroup: string;
  productPkg: string;
  productCd: string;
  endDt?: string;
  shortNameThai?: string;
  shortNameEng?: string;
  startDt?: string;
  descThai?: string;
  descEng?: string;
  inStatementThai?: string;
  inStatementEng?: string;
  priceType?: string;
  productSeq?: string;
  monthlyFee?: string;
  crmFlg?: string;
  paymentMode?: string;
  priceExclVat?: string;
  integrationName?: string;
  flagMain?: string;
  handSet?: HandSetMobileCare;
}

export interface HandSetMobileCare {
  brand?: string;
  model?: string;
  color?: string;
  imei?: string;
}

export interface Prebooking {
  preBookingNo: string;
  depositAmt: string;
  reserveNo?: string;
  deliveryDt: string;
}

export interface Status {
  code: string;
  description: string;
}
export interface Discount {
  type: string;
}

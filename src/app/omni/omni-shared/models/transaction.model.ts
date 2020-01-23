import { ChargeType } from 'mychannel-shared-libs';

export enum TransactionType {
  OMNI_NEW_REGISTER = 'OmniNewRegister',
  OMNI_NEW_SHARE_PLAN_MNP = 'OmniNewSharePlanMNP'
}

export enum TransactionAction {
  READ_CARD = 'READ_CARD',
  READ_CARD_PI = 'READ_CARD_PI',
  READ_CARD_REPI = 'READ_CARD_REPI',
  KEY_IN = 'KEY_IDCARD',
  KEY_IN_FBB = 'KEY_IN_FBB',
  KEY_IN_MOBILE_NO = 'KEY_IN_MOBILE_NO',
  KEY_IN_PI = 'KEY_IN_PI',
  KEY_IN_REPI = 'KEY_IN_REPI',
  READ_PASSPORT = 'READ_PASSPORT'
}

export interface Transaction {
  transactionId?: string;
  createDate?: string;
  createBy?: string;
  lastUpdateDate?: string;
  lastUpdateBy?: string;
  data?: TransactionData;
  issueBy?: any;
}

export interface TransactionData {
  transactionType: TransactionType;
  action: TransactionAction;
  campaign?: Campaign;
  airTime?: AirTime;
  customer?: Customer;
  simCard?: SimCard;
  mainPackage?: MainPackage;
  mainPackageMember?: MainPackageMember;
  currentPackage?: CurrentPackage;
  onTopPackage?: OnTopPackage;
  deleteOntopPackage?: DeleteOntopPackage[];
  mainPackageOneLove?: any[];
  // mobileCarePackage?: MobileCarePackage;
  faceRecognition?: FaceRecognition;
  // existingMobileCare?: ExistingMobileCare;
  order?: Order;
  reasonCode?: string;
  billingInformation?: BillingInformation;
  seller?: Seller;
  payment?: any;
  advancePayment?: Payment;
  receiptInfo?: ReceiptInfo;
  queue?: Queue;
  preBooking?: Prebooking;
  discount?: Discount;
  contract?: Condition;
  promotionsShelves?: PromotionsShelves;
  contractFirstPack?: ContractFirstPack;
  // MPAY
  mpayPayment?: QrCodePrePostMpayModel;
  status?: Status;
  device?: Device;
  knoxguard?: KnoxGuard;
  tradeType?: string;
  // Rom Agent
  romAgent?: RomAgent;
  romTransaction?: RomTransactionData;
  // Omise
  // omise?: Omise;
  locationDestName?: any;
  brand?: any;
  model?: any;
  color?: any;
  productPrice?: any;
  productDiscount?: any;
  productNetPrice?: any;
  cardId?: string;
  cusMobileNo?: string;
  packageName?: string;
}

export interface Omise {
  orderId?: string;
  tranDtm?: string;
  tranId?: string;
  amount?: number;
  qrType?: string;
  status?: string;
  locationCode?: string;
  offerId?: string;
  startDtm?: string;
  // QR Code AirTime
  companyStock?: 'AWN' | 'WDS';
  omiseStatus?: MPayStatus;
  qrAirtimeTransId?: string;
  qrAirtimeAmt?: string;
  qrOrderId?: string;
  qrCodeStr?: string;
  creditCardNo?: string;
  cardExpireDate?: string;
}

export interface Condition {
  conditionCode: string;
  conditionName?: string;
  conditionText?: string;
}

export interface ContractFirstPack {
  firstPackage?: number;
  inPackage?: string[];
  initialPackage?: number;
  minPrice?: number;
}

export interface Payment {
  paymentQrCodeType: 'THAI_QR' | 'LINE_QR';
  paymentType: 'DEBIT' | 'CREDIT' | 'QR_CODE';
  paymentForm: 'FULL' | 'INSTALLMENT';
  paymentBank: any;
  paymentMethod: any;
  qrCode?: any;
  type?: any;
  paymentOnlineCredit?: any;
}

export interface Campaign {
  campaignName?: any;
  campaignDesc?: any;
  conditionCode?: any;
}

// tslint:disable-next-line:no-empty-interface
export interface AirTime {
  [key: string]: any;
}

export interface Receipt {
  taxId: string;
  branch: string;
  buyer: string;
  buyerAddress: string;
  telNo: string;
  locationName: string;
}

export interface Customer {
  idCardNo: string;
  idCardType?: string;
  titleName?: string;
  titleNameEN?: string;
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  gender?: string;
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
  imageSignatureWithWaterMark?: string;
  imageSmartCard?: string;
  imageReadSmartCard?: string;
  customerPinCode?: string;
  provinceName?: string;
  portalCode?: string;
  // passport
  issuingCountry?: string;
  nationality?: string;
  imageReadPassport?: string;

  selectedMobile?: string;
  otherPhoneNumber?: string;
  shipaddress?: Recipientinformation;
  selectedLocation?: SelectedLocation;
  privilegeCode?: string;
  repi?: boolean;
  mobileNo?: string;

  // block chain
  chipID?: string;
  requestNo?: string;
  laserCode?: string;
  isBlockChain?: boolean;
  campaign: string;
  locationDestName: string;
}

export interface Recipientinformation {
  shipCusName?: string;
  shipCusAddr?: string;
}

export interface SelectedLocation {
  locationCode?: string;
  locationNameEN?: string;
  locationNameTH?: string;
  // passport
  issuingCountry?: string;
  nationality?: string;
  imageReadPassport?: string;
}

export interface SimCard {
  mobileNo?: string;
  simSerial?: string;
  persoSim?: string;
}

export interface MainPackage {
  // billingSystem?: string;
  // duration?: string;
  // itemId: string;
  // itemsPriority?: string;
  // numberOfMobile?: string;
  // packageType?: string;
  // productPkg?: string;
  // promotionPackage?: string;
  // shortNameThai: string;
  // statementThai?: string;
  // shortNameEng?: string;
  // statementEng?: string;
  // parameters?: any;
  // [key: string]: any;
  // memberMainPackage?: Array<any>;

  mainPackageCode?: any;
  mainPackageName?: any;
  mainPackageDesc?: any;
  matAirtime?: any;
  promotionPrice?: any;
  payAdvance?: any;
  payAdvanceDiscount?: any;
  durationContract?: any;
}

export interface MainPackageMember {
  billingSystem?: string;
  duration?: string;
  itemId: string;
  itemsPriority?: string;
  numberOfMobile?: string;
  packageType?: string;
  productPkg?: string;
  promotionPackage?: string;
  shortNameThai: string;
  statementThai?: string;
  shortNameEng?: string;
  statementEng?: string;
  parameters?: any;
  [key: string]: any;
}

export interface CurrentPackage {
  [key: string]: any;
}

export interface PromotionsShelves {
  [key: string]: any;
}
export interface DeleteOntopPackage {
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
  orderNoMNP?: string;
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
  billDeliveryAddress?: Customer;
  // วันที่มีผลการใช้งาน B: รอบถัดไป D: วันถัดไป I: มีผลทันที
  overRuleStartDate?: string;
  effectiveDate?: string;
  // check do createAndChangeBillingAccount Provisioning
  isNewBAFlag?: boolean;
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
  billCycleTextEng?: string;
  billAddressText?: string;
}

export interface ProductInfo {
  sku: any;
  colorCode: string;
  colorName: string;
  images: ProductImage;
  qty?: number;
  company?: string;
  qtyWH?: number;
  brand?: string;
  model?: string;
  tradeReserve?: any;
}
export class ProductImage {
  thumbnail: string;
  baseView: BaseView[];
}
export class BaseView {
  imageUrl: string;
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
  isAscCode?: boolean;
  sellerName?: string;
  locationDestName?: string;
  locationCode?: string;
  sellerNo?: string;
  shareUser?: string;
  employeeId?: string;
  ascCode?: string;
  sharedUser?: string;
}
export interface ShopLocation {
  id?: string;
  code?: string;
  displayName?: string;
  regions?: string;
  province?: string;
  distinct?: string;
  subDistinct?: string;
  locationType?: string;
  regionCode?: string;
}
export interface ShopEmployeeDetail {
  pin?: string;
  username?: string;
  thPrefix?: string;
  thFirstName?: string;
  thLastName?: string;
  enPrefix?: string;
  enFirstName?: string;
  enLastName?: string;
  email?: string;
  employeeType?: string;
  employeeGroup?: string;
  positionId?: string;
  positionCode?: string;
  positionDesc?: string;
  telNo?: string;
  orgCode?: string;
  orgName?: string;
  orgDesc?: string;
  companyCode?: string;
  coName?: string;
  nickName?: string;
  dpCode?: string;
  dpName?: string;
  dpDesc?: string;
  scCode?: string;
  scName?: string;
  scDesc?: string;
  mobileNo?: string;
  // flow deposit ใช้ ยังลบไม่ได้
  employeeId?: string;
}

export interface ReceiptInfo {
  branch?: string;
  buyer: string;
  buyerAddress: string;
  taxId?: string;
  telNo?: string;
}

export interface Queue {
  queueNo: string;
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
  changeMobileCareFlag: boolean;
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
export interface QrCodePrePostMpayModel {
  orderId?: string;
  tranDtm?: string;
  tranId?: string;
  amount?: number;
  qrType?: string;
  status?: string;
  locationCode?: string;
  offerId?: string;
  startDtm?: string;
  // QR Code AirTime
  companyStock?: 'AWN' | 'WDS';
  mpayStatus?: MPayStatus;
  qrAirtimeTransId?: string;
  qrAirtimeAmt?: string;
  qrOrderId?: string;
}

export interface MPayStatus {
  amountDevice: string;
  amountAirTime: string;
  amountTotal: string;
  statusDevice: 'SUCCESS' | 'WAITING' | null;
  statusAirTime: 'SUCCESS' | 'WAITING' | null;
  installmentFlag: 'Y' | 'N';
  orderIdDevice?: string;
  orderIdAirTime?: string;
  tranIdDevice?: string;
  tranIdAirTime?: string;
}

export interface Device {
  imei?: string;
  model?: string;
  brand?: string;
  amount?: string;
  name?: string;
  colorName?: string;
  colorCode?: string;
  productType?: string;
  productSubtype?: string;
}

export interface KnoxGuard {
  orderType?: string;
  serviceCode?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  orderReason?: string;
  userName?: string;
}

export interface RomAgent {
  mobileNoAgent?: string;
  pinAgent?: string;
  agentId?: string;
  tokenType?: string;
  accessToken?: string;
  transactionIdRom?: string;
  usernameRomAgent?: string;
  locationCode?: string;
}

export interface RomTransaction {
  transactionId: string;
  ssid: string;
  romNo: string;
  cusMobileNo: string;
  price: string;
  packId?: string;
  username: string;
  locationcode: string;
  transactionType: string;
  status: string;
  asccode?: string;
  appversion: string;
}

export interface VasPackage {
  ssid: string;
  msisdn: string;
  imsi: string;
  vlr: string;
  shortcode: string;
  serviceNumber: string;
  menuLevel: string;
  cos: string;
  spName: string;
  brandId: string;
  language: string;
  mobileLocation: string;
  customerState: string;
  servicePackageId: string;
}
export interface RomTransactionData {
  romData?: RomData[];
  romTransaction?: RomData;
  username?: string;
  pin?: string;
  refNo?: string;
  massageStatus?: string;
}

export interface RomData {
  createDate?: string;
  cusMobileNo?: string;
  locationcode?: string;
  packId?: string;
  price?: string;
  romNo?: string;
  ssid?: string;
  status?: string;
  transactionId?: string;
  transactionType?: 'VAS' | 'TOPUP';
  username?: string;
  time?: string;
  _id?: string;
}

export class SignatureAndImageSmartCard {
  dataSignature?: string;
  dataImageSmartCard?: string;
}

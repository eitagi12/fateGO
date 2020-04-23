import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils, User, TokenService } from 'mychannel-shared-libs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_EDIT_BILLING_ADDRESS_PAGE } from '../../ais/device-only-ais/constants/route-path.constant';
@Component({
  selector: 'app-summary-payment-detail',
  templateUrl: './summary-payment-detail.component.html',
  styleUrls: ['./summary-payment-detail.component.scss']
})
export class SummaryPaymentDetailComponent implements OnInit {

  @Output() completed: EventEmitter<any> = new EventEmitter<any>();

  public enoughBalance: boolean;
  priceOption: PriceOption;
  transaction: Transaction;
  customerAddress: string;
  price: string;
  isShowReceiptTnfomation: boolean = false;
  user: User;
  $customer: string;
  editName: boolean = false;
  editCustomerName: FormGroup;
  billingAddress: any;
  isLineShop: boolean = false;

  constructor(
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private utils: Utils,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
    if (this.user.locationCode === '63259') {
      this.isLineShop = true;
    }
  }

  ngOnInit(): void {
    this.checkUserType();
    this.getDataCustomer();
    if (this.isLineShop) {
      this.getCustomerAddress();
    }
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
  }

  private checkUserType(): boolean {
    return this.isShowReceiptTnfomation = this.user.userType === 'ASP' ? false : true;
  }

  getDataCustomer(): void {
    const customer = this.transaction.data.customer;
    if (this.isLineShop) {
      const shippingInfo: any = this.transaction.data.shippingInfo || '';
      if (!shippingInfo && !shippingInfo.firstName) {
        this.$customer = customer.firstName + ' ' + customer.lastName;
      } else {
        this.$customer = this.transaction.data.shippingInfo.firstName + ' ' + this.transaction.data.shippingInfo.lastName;
      }
    }
    if (customer) {
      this.customerAddress = this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode
      });
    } else {
      this.customerAddress = '';
    }
  }

  showEditCustomerName(): void {
    this.editName = true;
    this.createForm();
  }

  createForm(): void {
    const customer = this.transaction.data.customer;
    this.editCustomerName = this.formBuilder.group({
      'firstName': ['', Validators.compose([Validators.required])],
      'lastName': ['', Validators.compose([Validators.required])],
    });
    if (!this.transaction.data.shippingInfo.firstName && !this.transaction.data.shippingInfo.lastName) {
      this.editCustomerName.controls['firstName'].setValue(customer.firstName);
      this.editCustomerName.controls['lastName'].setValue(customer.lastName);
    } else {
      const shippingInfo = this.transaction.data.shippingInfo;
      this.editCustomerName.controls['firstName'].setValue(shippingInfo.firstName);
      this.editCustomerName.controls['lastName'].setValue(shippingInfo.lastName);
    }
  }

  getCustomerAddress(): void {
    let customer;
    const shippingInfo: any = this.transaction.data.shippingInfo || '';
    if (shippingInfo && shippingInfo.firstName) {
      customer = this.transaction.data.shippingInfo;
    } else {
      customer = this.transaction.data.customer;
      this.transaction.data = {
        ...this.transaction.data,
        shippingInfo: {
          titleName: 'คุณ',
          firstName: customer.firstName,
          lastName: customer.lastName,
          homeNo: customer.homeNo,
          moo: customer.moo,
          mooBan: customer.mooBan,
          room: customer.room,
          floor: customer.floor,
          buildingName: customer.buildingName,
          soi: customer.soi,
          street: customer.street,
          tumbol: customer.tumbol,
          amphur: customer.amphur,
          province: customer.province,
          zipCode: customer.zipCode,
          telNo: this.transaction.data.receiptInfo.telNo
        }
      };
    }

    const customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      mooBan: customer.mooBan,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    });

    this.billingAddress = {
      text: customerAddress,
      onEdit: () => {
        this.router.navigate([ROUTE_DEVICE_ONLY_AIS_EDIT_BILLING_ADDRESS_PAGE]);
      }
    };
    this.transactionService.update(this.transaction);
  }

  onComplete(): void {
    this.completed.emit({
      firstName: this.editCustomerName.controls['firstName'].value,
      lastName: this.editCustomerName.controls['lastName'].value
    });
  }

}

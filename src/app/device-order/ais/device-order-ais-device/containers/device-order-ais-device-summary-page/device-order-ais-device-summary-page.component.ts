import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TelNoBillingInfo, TokenService, PageLoadingService, AlertService, ShoppingCart, Utils, User } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE, ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE, ROUTE_DEVICE_AIS_DEVICE_EDIT_SHIPPING_ADDRESS_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';

@Component({
  selector: 'app-device-order-ais-device-summary-page',
  templateUrl: './device-order-ais-device-summary-page.component.html',
  styleUrls: ['./device-order-ais-device-summary-page.component.scss']
})
export class DeviceOrderAisDeviceSummaryPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  customerAddress: string;
  shippingAddress: string;
  telNoBillingInfo: TelNoBillingInfo;
  seller: Seller;
  sellerCode: string;
  employeeDetailForm: FormGroup;
  shipCusNameFormControl: FormGroup;
  isEditShipCusName: boolean = false;
  user: User;
  warehouse: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private utils: Utils,
    public summaryPageService: SummaryPageService,

  ) {
    this.user = this.tokenService.getUser();
    this.warehouse = this.user.locationCode === '63259';
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length
    const customer = this.transaction.data && this.transaction.data.billingInformation && this.transaction.data.billingInformation.billDeliveryAddress ?
      this.transaction.data.billingInformation.billDeliveryAddress : this.transaction.data.customer;
    const shippingInfo = this.transaction.data.shippingInfo;

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.setCustomerAddress(customer);
    this.setShippingAddress(shippingInfo);
    this.createEmployeeForm();
    this.shipCusNameFormControlForm();
    this.getSeller();
  }

  private setCustomerAddress(customer: any): void {
    this.customerAddress = this.utils.getCurrentAddress({
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
  }

  private setShippingAddress(shippingInfo: any): void {
    this.shippingAddress = this.utils.getCurrentAddress({
      homeNo: shippingInfo.homeNo,
      moo: shippingInfo.moo,
      mooBan: shippingInfo.mooBan,
      room: shippingInfo.room,
      floor: shippingInfo.floor,
      buildingName: shippingInfo.buildingName,
      soi: shippingInfo.soi,
      street: shippingInfo.street,
      tumbol: shippingInfo.tumbol,
      amphur: shippingInfo.amphur,
      province: shippingInfo.province,
      zipCode: shippingInfo.zipCode
    });
  }

  getSeller(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    const seller = this.transaction.data.seller;
    if (seller && seller.locationName) {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: seller.locationName,
        locationCode: user.locationCode
      };
      this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
        .then((emResponse: any) => {
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
            this.employeeDetailForm.patchValue({ ascCode: this.sellerCode });
          }
          this.pageLoadingService.closeLoading();
        }).catch(() => {
          this.sellerCode = '';
          this.pageLoadingService.closeLoading();
        });
    }

  }

  createEmployeeForm(): void {
    this.employeeDetailForm = this.fb.group({
      ascCode: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });
  }

  shipCusNameFormControlForm(): void {
    const shippingInfo: any = this.transaction.data && this.transaction.data.shippingInfo ? this.transaction.data.shippingInfo : {};
    this.shipCusNameFormControl = this.fb.group({
      firstName: [shippingInfo.firstName || '', [Validators.required]],
      lastName: [shippingInfo.lastName || '', [Validators.required]],
    });
  }

  get ascCodeToken(): string {
    return this.seller ? this.sellerCode : '';
  }

  get sellerName(): string {
    return this.seller ? this.seller.sellerName : '';
  }

  get offsetName(): string {
    return this.seller ? this.seller.locationName : '';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE], { queryParams: { ebilling: true } });
  }

  onNext(): void {
    const user = this.tokenService.getUser();
    this.pageLoadingService.openLoading();
    const ascCode = this.employeeDetailForm.controls['ascCode'].value || '';
    this.http.get(`/api/customerportal/checkSeller/${ascCode.trim()}`).toPromise().then((resp: any) => {
      const checkSeller: any = resp && resp.data ? resp.data : {};
      if (checkSeller.condition) {
        this.transaction.data.seller = {
          ...this.transaction.data.seller,
          sellerNo: this.sellerCode,
          employeeId: ascCode,
          sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username
        };
        if (this.editShipCusName) {
          this.transaction.data.shippingInfo = {
            ...this.transaction.data.shippingInfo,
            firstName: this.shipCusNameFormControl.value.firstName ? this.shipCusNameFormControl.value.firstName
              : this.transaction.data.shippingInfo.firstName,
            lastName: this.shipCusNameFormControl.value.lastName ? this.shipCusNameFormControl.value.lastName
              : this.transaction.data.shippingInfo.lastName
          };
        }
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE]);
      } else {
        this.alertService.warning(checkSeller.message);
      }
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenDetail(detail: string): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/dt/remove-cart', {
            soId: transaction.data.order.soId,
            userId: this.user.username
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  editShipCusName(): void {
    this.isEditShipCusName = !this.isEditShipCusName;
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  editAddressDelivery(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_EDIT_SHIPPING_ADDRESS_PAGE]);
  }

  _keyPress(event: any): any {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && charCode < 49) || (charCode > 90 && charCode < 97) || (charCode > 47 && charCode < 65)
      || (charCode > 122 && charCode < 128) || (charCode > 143 && charCode < 146) || (charCode > 185 && charCode < 223)) {
      event.preventDefault();
    }
  }

}

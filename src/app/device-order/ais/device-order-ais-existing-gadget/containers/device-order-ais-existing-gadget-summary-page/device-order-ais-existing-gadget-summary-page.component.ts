import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Seller, Customer } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, PageLoadingService, TokenService, AlertService, Utils } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ProfileFbbService } from 'src/app/shared/services/profile-fbb.service';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ECONTRACT_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_ONTOP_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-summary-page',
  templateUrl: './device-order-ais-existing-gadget-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-summary-page.component.scss']
})
export class DeviceOrderAisExistingGadgetSummaryPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;
  profileFbb: ProfileFbb;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller;
  packageOntopList: any[] = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private modalService: BsModalService,
    private utils: Utils,
    private shoppingCartService: ShoppingCartService,
    private profileFbbService: ProfileFbbService,
    public summaryPageService: SummaryPageService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.profileFbb = this.profileFbbService.load();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.packageOntopList = this.transaction.data.deleteOntopPackage;
    this.customerAddress = this.utils.getCurrentAddress(this.mappingCustomer(customer));
    this.createForm();
    this.callServiceEmployee();
  }

  callServiceEmployee(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
      return this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
        .then((emResponse: any) => {
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
          }
        }).catch(() => {
          this.sellerCode = '';
        });
    });
  }

  mappingCustomer(customer: Customer): any {
    return {
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
    };
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const nextUrl: string = this.checkBackNavigate();
    this.router.navigate([nextUrl]);
  }

  checkBackNavigate(): string {

    return ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_PAYMENT_DETAIL_PAGE ;

    /* ยกเลิกเปลี่ยน main pro รอคุย solution การเปลี่ยน main pro ที่ MC
    if (this.transaction.data.mainPackage) {
      if (this.transaction.data.onTopPackage) {
        return ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_ONTOP_PAGE;
      } else {
        return ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE;
      }
    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE;
    }
    */
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.sellerCode.trim()}`).toPromise()
      .then((shopCheckSeller: any) => {
        if (shopCheckSeller.data.condition) {
          this.transaction.data.seller = {
            ...this.seller,
            sellerNo: this.sellerCode
          };
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_ECONTRACT_PAGE]);
        } else {
          this.alertService.error(shopCheckSeller.data.message);
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });

    if (this.sellerCode) {
      this.checkSellerForm.patchValue({ checkSeller: this.sellerCode });
    }

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.sellerCode = value.checkSeller;
      }
    });
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
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }
}
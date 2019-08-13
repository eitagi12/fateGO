import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { CustomerInfo, HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-gadget-select-package-ontop-page',
  templateUrl: './device-order-ais-existing-gadget-select-package-ontop-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-select-package-ontop-page.component.scss']
})
export class DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent implements OnInit, OnDestroy {
  @ViewChild('detailTemplate')
  detailTemplate: any;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  modalRef: BsModalRef;
  detail: string;
  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;
  packageOntopList: any[] = [];
  packageOntopForm: FormGroup;
  effectiveEndDt: any;
  priceOption: PriceOption;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private priceOptionService: PriceOptionService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.createForm();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    this.callService(mobileNo);
    const mainPackEndDt: any = this.transaction.data
      && this.transaction.data.mainPackage
      && this.transaction.data.mainPackage.customAttributes
      && this.transaction.data.mainPackage.customAttributes.effectiveEndDt
      ? this.transaction.data.mainPackage.customAttributes.effectiveEndDt : '-';
    this.effectiveEndDt = moment(mainPackEndDt).format('DD/MM/YYYY');
  }
  callService(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    const data = this.transaction.data.onTopPackage;
    const packageOntop = data.filter((packageOntopList: any) => {
      return packageOntopList.priceType === 'Recurring' && packageOntopList.priceExclVat > 0;
    }).sort((a: any, b: any) => a.priceExclVat - b.priceExclVat);
    const checkChangePromotions = (packageOntop || []).map((ontop: any) => {
      return this.http.post('/api/customerportal/checkChangePromotion', {
        mobileNo: mobileNo,
        promotionCd: ontop.promotionCode
      }).toPromise().then((responesOntop: any) => {
        return responesOntop.data;
      })
        .catch(() => false);
    });
    Promise.all(checkChangePromotions).then((respones: any[]) => {
      this.packageOntopList = packageOntop.filter((ontop, index) => {
        return respones[index];
      });
      this.packageOntopList.forEach((ontopList: any) => {
        const checked = !!(this.transaction.data.deleteOntopPackage || []).find(ontopDelete => {
          return ontopList.promotionCode === ontopDelete.promotionCode;
        });
        this.packageOntopForm.setControl(ontopList.promotionCode, this.fb.control(checked));
      });
    }).then(() => this.pageLoadingService.closeLoading());
  }
  createForm(): void {
    this.packageOntopForm = this.fb.group({});

    this.packageOntopForm.valueChanges.pipe(debounceTime(100)).subscribe((controls: any[]) => {
      const keys = Object.keys(controls);
      const promotionCodeList = keys.filter((key) => {
        return controls[key];
      });
      const packageOntop = this.packageOntopList.filter((ontop) => {
        return !!(promotionCodeList || []).find(promotionCode => ontop.promotionCode === promotionCode);
      });
      this.transaction.data.deleteOntopPackage = packageOntop;
      this.transactionService.update(this.transaction);
    });
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
  handleError(err: any): void {
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : this.translateService.instant(`ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`));
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  packageTitle(value: any = {}): string {
    return this.translateService.currentLang === 'EN' ? (value.shortNameEng || value.titleEng) : (value.shortNameThai || value.title);
  }

  packageInStatement(value: any = {}): string {
    return this.translateService.currentLang === 'EN' ? value.inStatementEng : value.inStatementThai || '';
  }

  onOpenModal(value: any = {}): void {
    this.detail = this.translateService.currentLang === 'EN' ? value.detailEng : value.detail || '';
    this.modalRef = this.modalService.show(this.detailTemplate, {
      class: 'pt-5 mt-5'
    });
  }
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}

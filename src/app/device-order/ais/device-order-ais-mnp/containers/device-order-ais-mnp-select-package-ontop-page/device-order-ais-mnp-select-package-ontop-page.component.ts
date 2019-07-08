import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE } from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-mnp-select-package-ontop-page',
  templateUrl: './device-order-ais-mnp-select-package-ontop-page.component.html',
  styleUrls: ['./device-order-ais-mnp-select-package-ontop-page.component.scss']
})
export class DeviceOrderAisMnpSelectPackageOntopPageComponent implements OnInit, OnDestroy {
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

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.createForm();
  }

  ngOnInit(): void {
    const mobileNo = this.transaction.data.simCard.mobileNo;
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    this.callService(mobileNo);
  }
  callService(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    this.http
      .get(`/api/customerportal/mobile-detail/${mobileNo}`)
      .toPromise()
      .then((resp: any) => {
        const data = resp.data.packageOntop || {};

        const packageOntop = data.filter((packageOntopList: any) => {
          // tslint:disable-next-line:typedef
          const isexpiredDate = moment().isBefore(moment(packageOntopList.expiredDate, 'DD-MM-YYYY'));
          return (
            /On-Top/.test(packageOntopList.productClass) && packageOntopList.priceType === 'Recurring' &&
            packageOntopList.priceExclVat > 0 && isexpiredDate
          );
        }).sort((a: any, b: any) => a.priceExclVat - b.priceExclVat);
        const checkChangPromotions = (packageOntop || []).map((ontop: any) => {
          return this.http.post('/api/customerportal/checkChangePromotion', {
            mobileNo: mobileNo,
            promotionCd: ontop.promotionCode
          }).toPromise().then((responesOntop: any) => {
            return responesOntop.data;
          })
            .catch(() => false);
        });
        return Promise.all(checkChangPromotions).then((respones: any[]) => {
          this.packageOntopList = packageOntop.filter((ontop , index) => {
            return respones[index];
          });
          this.packageOntopList.forEach((ontopList: any) => {
            const checked = !!(this.transaction.data.deleteOntopPackage || []).find(ontopDelete => {
              return ontopList.promotionCode === ontopDelete.promotionCode;
            });
            this.packageOntopForm.setControl(ontopList.promotionCode, this.fb.control(checked));
          });
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
  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  packageTitle(value: any = {}): string {
    return this.translateService.currentLang === 'EN' ? value.titleEng : value.title || '';
  }

  currentPackageInStatement(value: any = {}): string {
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

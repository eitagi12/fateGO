import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCart, PageLoadingService, HomeService } from 'mychannel-shared-libs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-new-register-mnp-select-package-ontop-page',
  templateUrl: './new-register-mnp-select-package-ontop-page.component.html',
  styleUrls: ['./new-register-mnp-select-package-ontop-page.component.scss']
})
export class NewRegisterMnpSelectPackageOntopPageComponent implements OnInit, OnDestroy {

  @ViewChild('detailTemplate')
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  packageOntopForm: FormGroup;
  modalRef: BsModalRef;
  effectiveEndDt: any;
  packageOntopList: any[] = [];
  detail: string;
  detailTemplate: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private modalService: BsModalService,
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
    const mainPackEndDt: any = this.transaction.data
      && this.transaction.data.mainPackage
      && this.transaction.data.mainPackage.customAttributes
      && this.transaction.data.mainPackage.customAttributes.effectiveEndDt
      ? this.transaction.data.mainPackage.customAttributes.effectiveEndDt : '-';
    this.effectiveEndDt = moment(mainPackEndDt).format('DD/MM/YYYY');
  }

  callService(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    this.http
      .get(`/api/customerportal/mobile-detail/${mobileNo}`)
      .toPromise()
      .then((resp: any) => {
        const data = resp.data.packageOntop || {};
        const packageOntop = data.filter((packageOntopList: any) => {
          const isexpiredData = moment().isBefore(moment(packageOntopList.expiredData, 'DD-MM-YYYY'));
          return (
            /On-Top/.test(packageOntopList.productClass) && packageOntopList.priceType === 'Recurring' &&
            packageOntopList.priceExIvat > 0 && isexpiredData
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
          this.packageOntopList = packageOntop.filter((ontop, index) => {
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
    this.router.navigate([]);
  }

  onNext(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([]);
    } else {
      this.router.navigate([]);
    }
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

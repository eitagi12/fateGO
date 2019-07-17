import { Component, OnInit, ElementRef, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE, ROUTE_VAS_PACKAGE_OTP_PAGE } from '../../constants/route-path.constant';
import { PackageProductsService } from '../../services/package-products.service';
import { HomeService, BannerSlider, SalesService, User, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter } from 'minimatch';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionType, Transaction } from 'src/app/shared/models/transaction.model';
import * as moment from 'moment';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-vas-package-select-vas-package-page',
  templateUrl: './vas-package-select-vas-package-page.component.html',
  styleUrls: ['./vas-package-select-vas-package-page.component.scss']
})
export class VasPackageSelectVasPackagePageComponent implements OnInit, OnDestroy {

  mobileForm: FormGroup;
  mobileNo: string;
  bannerSliders: BannerSlider[];
  priceOptionDetailService: Promise<any>;
  salesService: SalesService;
  user: User;
  shelves: any;
  packageBestSaller: Array<any> = [];
  transaction: Transaction;
  packageCat: Array<any> = [];
  tabs: Array<any> = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private packageProductsService: PackageProductsService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // this.getPackageProducts();
    this.callService();
    this.createForm();
    //  this.callPriceOptionsService(this.packageBestSaller);
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  /**
   *  @Customer
   *    ให้เช็ค Network type ของเบอร์ และ pack ว่า allow หรือไม่
   *    1.Call get-profile-type เพื่อเอา network type เบอร์ (eg. 3PE or3PO)
   *        ** ต้องเรียก (/api/customerportal/asset/:mobileNo/profile)
   *    2. เอา network type ของเบอร์มาเช็คกับ Pack ที่เลือกจากค่า  allow_ntype (eg. 3PE or3PO)
   *    3. ถ้าไม่ตรงให้ แจ้ง error message “ไม่สามารถสมัครแพ๊กเกจได้เนื่อง Network type ไม่ตรง”
   *      3.1 เช็ค balance (/api/newRegister/{mobileNo}/queryBalance) ลูกค้าว่า พอหรือไม่
   *        ถ้าไม่พอ ให้ แจ้ง error message แล้ว พาไป remain Balance
   *    4. ส่ง OTP : /api/customerportal/newRegister/0951000001/sendOTP
   *
   *  @ROM
   *    A.ให้เช็ค Network type ของเบอร์ และ pack ว่า allow หรือไม่
   *      1.Call get-profile-type เพื่อเอา networkType เบอร์(eg.3PE ,3PO)
   *          ** หรือเรียก (/api/customerportal/asset/:mobileNo/profile)
   *      2. เอา network type ของเบอร์มาเช็คกับ Pack ที่เลือกจากค่า
   *          allow_ntype (eg. 3PE or3PO)
   *      3. ถ้าไม่ตรงให้ แจ้ง error message
   *    B.ให้ช็ค ServiceYear ของเบอร์ลูกค้า กับ Pack ที่เลือกฟิลใน CPC  “days_of_service_year”
   *      1. call (api/customerportal/greeting/${mobileNo}/profile)
   *          เพื่อเอา serviceYear
   *      2. “day”  > “day_of_service_year” ถึงจะ allow ให้ซื้อ
   *      3. ถ้าไม่เข้าเงื่อนไขให้แจ้ง error message
   *
   **/
  onSelectPackage(selectedPackage: any): void {
    if (!this.mobileNo) {
      this.alertService.error('กรุณาระบุหมายเลขโทรศัพท์');
      return;
    }

    switch (this.transaction.data.transactionType) {
      case TransactionType.VAS_PACKAGE_CUSTOMER: {

        this.pageLoadingService.openLoading();
        this.http.get(`/api/customerportal/asset/${this.mobileNo}/profile`).toPromise()
          .then((resProfile: any) => {
            if (resProfile && resProfile.resultCode !== '20000') {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              return;
            }

            const matchNType: any = [...selectedPackage.customAttributes.allow_ntype.split(',')].includes(resProfile.data.product);
            if (!matchNType) {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก Network type ไม่ตรง');
              return;
            }

            if (resProfile.data.chargeType !== selectedPackage.customAttributes.charge_type) {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก Network type ไม่ตรง');
              return;
            }
            const isPrepaid: boolean = resProfile.data.chargeType === 'Pre-paid';
            if (isPrepaid) {
              this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
                .then((resBalance: any) => {
                  if (resBalance && resBalance.resultCode !== '20000') {
                    this.pageLoadingService.closeLoading();
                    this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                    return;
                  }

                  const isEnough: any = +(resBalance.data.remainingBalance) >= +(selectedPackage.customAttributes.customer_price);
                  if (!isEnough) {
                    this.pageLoadingService.closeLoading();
                    this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจากยอดเงินคงเหลือไม่เพียงพอสำหรับแพ็กเกจนี้ ยอดเงินคงเหลือ: '
                      + (+resBalance.data.remainingBalance) + ' บาท');
                    return;
                  }

                  this.pageLoadingService.closeLoading();
                  this.savePackage(this.mobileNo, selectedPackage);
                  this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
                });
            } else {
              this.pageLoadingService.closeLoading();
              this.savePackage(this.mobileNo, selectedPackage);
              this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
            }
          });
        break;
      }
      case TransactionType.VAS_PACKAGE_ROM: {
        this.pageLoadingService.openLoading();
        this.http.get(`/api/customerportal/asset/${this.mobileNo}/profile`).toPromise()
          .then((resProfile: any) => {
            if (resProfile && resProfile.resultCode !== '20000') {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              return;
            }

            const matchNType: any = [...selectedPackage.customAttributes.allow_ntype.split(',')].includes(resProfile.data.product);
            if (!matchNType) {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก Network type ไม่ตรง');
              return;
            }

            if (resProfile.data.chargeType !== selectedPackage.customAttributes.charge_type) {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก Network type ไม่ตรง');
              return;
            }

            this.http.get(`/api/customerportal/greeting/${this.mobileNo}/profile`).toPromise()
              .then((greeting: any) => {
                if (greeting && greeting.resultCode !== '20000') {
                  this.pageLoadingService.closeLoading();
                  this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                  return;
                }

                const registerDate = moment()
                  .subtract(+greeting.data.serviceYear.year, 'years')
                  .subtract(+greeting.data.serviceYear.month, 'months')
                  .subtract(+greeting.data.serviceYear.day, 'days');
                const packageDate = moment().subtract(+selectedPackage.days_of_service_year, 'days');
                const isBefore = registerDate.isBefore(packageDate);
                if (!isBefore) {
                  this.pageLoadingService.closeLoading();
                  this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก service years ไม่ถึง');
                  return;
                }

                const isPrepaid: boolean = resProfile.data.chargeType === 'Pre-paid';
                if (isPrepaid) {
                  this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
                    .then((resBalance: any) => {
                      if (resBalance && resBalance.resultCode !== '20000') {
                        this.pageLoadingService.closeLoading();
                        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                        return;
                      }

                      const isEnough: any = +(resBalance.data.remainingBalance) >= +(selectedPackage.customAttributes.regular_price);
                      if (!isEnough) {
                        this.pageLoadingService.closeLoading();
                        this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจากยอดเงินคงเหลือไม่เพียงพอสำหรับแพ็กเกจนี้ ยอดเงินคงเหลือ: '
                          + (+resBalance.data.remainingBalance) + ' บาท');
                        return;
                      }
                      this.pageLoadingService.closeLoading();
                      this.savePackage(this.mobileNo, selectedPackage);
                      this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
                    });
                } else {
                  this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
                  this.savePackage(this.mobileNo, selectedPackage);
                  this.pageLoadingService.closeLoading();
                }
              });
          });
        break;
      }
      default:
        break;
    }

  }

  savePackage(mobileNo: any, selectPackage: any): void {
    this.transaction.data = {
      ...this.transaction.data,
      simCard: {
        mobileNo: mobileNo
      },
      mainPackage: selectPackage
    };
  }
  onSelectedBestSellerPackage(event: any): void {
    this.onSelectPackage(event);
  }

  getPackageProducts(): void {
    const userId = 'bMfAlzjKaZSSKY3s6c3farMxbUaEsFnIIAgbjsXKA3cOhnKfvawKb60MITINd04Os73YJBQ5aWypkxFk';
    this.packageProductsService.getPackageProducts(userId);
  }

  createForm(): void {
    this.mobileForm = this.formBuilder.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    this.mobileForm.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });
  }

  callService(): any {
    const userId = 'bMfAlzjKaZSSKY3s6c3farMxbUaEsFnIIAgbjsXKA3cOhnKfvawKb60MITINd04Os73YJBQ5aWypkxFk';
    this.http.post('/api/salesportal/promotion-vas', { userId }).toPromise()
      .then((response: any) => {
        // console.log('best_seller_priority', .items[0].customAttributes.best_seller_priority);
        response.data.data.map((data: any) => {
          data.subShelves.map((subShelves: any) => {
            subShelves.items.map((item: any) => {
              if (+item.customAttributes.best_seller_priority > 0) {
                // console.log('item ', item);
                item.mainTitle = data.title;
                if (data.title === 'เน็ตและโทร') {
                  item.icon = 'assets/images/icon/Phone_net.png';
                } else if (data.title === 'เน้นคุย') {
                  item.icon = 'assets/images/icon/Call.png';
                } else {
                  item.icon = 'assets/images/icon/Net.png';
                }
                this.packageBestSaller.push(item);
              } else {
                this.packageCat.push(item);
              }

            }).sort((a: any, b: any) => (+a.customAttributes.best_seller_priority) - (b.customAttributes.best_seller_priority));
          });
        });
      }).then(() => {
        this.tabs = this.getTabsFormPriceOptions(this.packageCat);
      });
  }
  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
  getTabsFormPriceOptions(packageCat: any[]): any[] {
    const tabs = [];
    const categorys: any = [];
    packageCat.forEach((ca: any) => {
      if (!categorys.find((tab: any) => tab.name === ca.customAttributes.category)) {
        categorys.push({
          name: ca.customAttributes.category,
          active: false,
          packages: []
        });
      }
    });
    categorys.forEach((cate: any) => {
      const setPack: any = [];
      packageCat.forEach((pack: any) => {
        if (cate.name === pack.customAttributes.category) {
          setPack.push(pack);
        }
      });
      tabs.push({
        name: cate.name,
        active: false,
        packages: setPack
      });
    });

    if (tabs.length > 0) {
      tabs[0].active = true;
    }
    console.log(tabs);
    return tabs;
  }

  setActiveTabs(tabCode: any): void {
    this.tabs = this.tabs.map((tabData) => {
      tabData.active = !!(tabData.name === tabCode);
      return tabData;
    });
  }

}

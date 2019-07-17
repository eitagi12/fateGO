import { Component, OnInit, ElementRef, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from '../../constants/route-path.constant';
import { PackageProductsService } from '../../services/package-products.service';
import { HomeService, BannerSlider, SalesService, User, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter } from 'minimatch';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionType, Transaction } from 'src/app/shared/models/transaction.model';
import * as moment from 'moment';

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

  onSelectPackage(): void {
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

    const selectedPackage = {
      customer_price: '39',
      allow_ntype: '3PE',
      days_of_service_year: '30'
    };
    switch (this.transaction.data.transactionType) {
      case TransactionType.VAS_PACKAGE_CUSTOMER: {
        this.pageLoadingService.openLoading();
        this.http.get(`/api/customerportal/asset/${this.mobileNo}/profile`).toPromise()
          .then((resProfile: any) => {
            if (resProfile && resProfile.resultCode !== '20000') {
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              this.pageLoadingService.closeLoading();
              return;
            }

            const matchNType: any = resProfile.data.product === selectedPackage.allow_ntype;
            if (!matchNType) {
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่อง Network type ไม่ตรง');
              this.pageLoadingService.closeLoading();
              return;
            }
            return resProfile.data;
          })
          .then((profile) => {
            const isPrepaid: boolean = profile.chargeType === 'Pre-paid';
            if (isPrepaid) {
              this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
                .then((resBalance: any) => {
                  if (profile && profile.resultCode !== '20000') {
                    this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                    this.pageLoadingService.closeLoading();
                    return;
                  }

                  const isEnough: any = +(resBalance.data.remainingBalance) > +(selectedPackage.customer_price);
                  if (+isEnough) {
                    this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                    this.pageLoadingService.closeLoading();
                    return;
                  }
                });
            } else {
              this.pageLoadingService.closeLoading();
            }
          });
        break;
      }
      case TransactionType.VAS_PACKAGE_ROM: {
        this.pageLoadingService.openLoading();
        this.http.get(`/api/customerportal/asset/${this.mobileNo}/profile`).toPromise()
          .then((resProfile: any) => {
            if (resProfile && resProfile.resultCode !== '20000') {
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              this.pageLoadingService.closeLoading();
              return;
            }

            const matchNType: any = resProfile.data.product === selectedPackage.allow_ntype;
            if (!matchNType) {
              this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่อง Network type ไม่ตรง');
              this.pageLoadingService.closeLoading();
              return;
            }
            return resProfile.data;
          })
          .then((profile) => {
            this.http.get(`/api/customerportal/greeting/${this.mobileNo}/profile`).toPromise()
              .then((greeting: any) => {
                const registerDate = moment()
                  .subtract(+greeting.data.serviceYear.year, 'years')
                  .subtract(+greeting.data.serviceYear.month, 'months')
                  .subtract(+greeting.data.serviceYear.day, 'days');
                const packageDate = moment().subtract(+selectedPackage.days_of_service_year, 'days');
                const isBefore = registerDate.isBefore(packageDate);
                if (!isBefore) {
                  this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่อง service years ไม่ถึง');
                  this.pageLoadingService.closeLoading();
                  return;
                }

                const isPrepaid: boolean = profile.chargeType === 'Pre-paid';
                if (isPrepaid) {
                  this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/queryBalance`).toPromise()
                    .then((resBalance: any) => {
                      if (profile && profile.resultCode !== '20000') {
                        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                        this.pageLoadingService.closeLoading();
                        return;
                      }

                      const isEnough: any = +(resBalance.data.remainingBalance) > +(selectedPackage.customer_price);
                      if (+isEnough) {
                        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
                        this.pageLoadingService.closeLoading();
                        return;
                      }
                    })
                    .catch(() => {
                      this.pageLoadingService.closeLoading();
                    });
                } else {
                  this.pageLoadingService.closeLoading();
                }
              });
          });
        break;
      }
      default:
        break;
    }

    // this.onNext();
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
                console.log('item ', item);
                item.mainTitle = data.title;
                if (data.title === 'เน็ตและโทร') {
                  item.icon = 'assets/images/icon/Phone_net.png';
                } else if (data.title === 'เน้นคุย') {
                  item.icon = 'assets/images/icon/Call.png';
                } else {
                  item.icon = 'assets/images/icon/Net.png';
                }
                this.packageBestSaller.push(item);
              }

            }).sort((a: any, b: any) => (+a.customAttributes.best_seller_priority) - (b.customAttributes.best_seller_priority));
          });
        });
      }).then(() => {
        console.log('res', this.packageBestSaller);
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}

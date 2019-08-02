import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE, ROUTE_VAS_PACKAGE_OTP_PAGE } from '../../constants/route-path.constant';
import { HomeService, BannerSlider, User, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TransactionType, Transaction } from 'src/app/shared/models/transaction.model';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';

@Component({
  selector: 'app-vas-package-select-vas-package-page',
  templateUrl: './vas-package-select-vas-package-page.component.html',
  styleUrls: ['./vas-package-select-vas-package-page.component.scss']
})
export class VasPackageSelectVasPackagePageComponent implements OnInit, OnDestroy {

  mobileForm: FormGroup;
  mobileNo: string;
  bannerSliders: BannerSlider[];
  packageVasService: Promise<any>;
  user: User;
  shelves: any;
  packagesBestSellers: Array<any> = [];
  transaction: Transaction;
  packageCat: Array<any> = [];
  tabs: Array<any> = [];
  selectedTab: any;
  nType: string;
  mobileProfile: any;
  packLoading: any = false;
  readonly: boolean = false;
  usernameSub: Subscription;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private aisNativeOrderService: AisNativeOrderService,
  ) {
    this.transaction = this.transactionService.load();
    this.mobileNo = this.transaction.data.simCard ? this.transaction.data.simCard.mobileNo : '';
  }

  ngOnInit(): void {
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

  onSelectPackage(selectedPackage: any): void {
    if (!this.mobileNo) {
      this.alertService.error('กรุณาระบุหมายเลขโทรศัพท์');
      return;
    }
    this.pageLoadingService.openLoading();
    this.getNTypeMobileNo(this.mobileNo).then((resProfile: any) => {
      const status: string = (resProfile && resProfile.data && resProfile.data.detail.state) ? resProfile.data.detail.state : '';
      if (!['active'].includes(status.toLowerCase())) {
        if (status) {
          this.alertService.error('หมายเลขนี้ไม่สามารถทำรายการได้ กรุณาติดต่อ Call Center 1175');
        } else {
          this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
        }
        return;
      }
      const matchNType: any = selectedPackage.customAttributes.allow_ntype.indexOf(resProfile.data.detail.networkType) !== -1;
      console.log('matchNType', matchNType);
      if (!matchNType) {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจาก Network type ไม่ตรง');
        return;
      }
      if (this.transaction.data.transactionType === TransactionType.VAS_PACKAGE_ROM) {
        this.http.get(`/api/customerportal/mobile-detail/${this.mobileNo}`).toPromise()
          .then((mobileDetail: any) => {
            if (mobileDetail && mobileDetail.resultCode !== '20000') {
              this.pageLoadingService.closeLoading();
              this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
              return;
            }
            if (selectedPackage && selectedPackage.customAttributes && selectedPackage.customAttributes.days_of_service_year) {
              const registerDate = moment()
                .subtract(+mobileDetail.data.serviceYear.year, 'years')
                .subtract(+mobileDetail.data.serviceYear.month, 'months')
                .subtract(+mobileDetail.data.serviceYear.day, 'days').format('YYYY-MM-DD');
              const packageDate = moment().subtract(+selectedPackage.customAttributes.days_of_service_year, 'days').format('YYYY-MM-DD');
              const isSameOrAfter = moment(registerDate).isSameOrAfter(packageDate);
              if (!isSameOrAfter) {
                this.pageLoadingService.closeLoading();
                this.alertService.error('ไม่สามารถสมัครแพ็กเกจได้เนื่องจากเบอร์ไม่เข้าเงื่อนไข service year');
                return;
              }
            }

            this.pageLoadingService.closeLoading();
            this.savePackage(this.mobileNo, selectedPackage);
            this.getRomByUser();
          });
      } else {
        const isPrepaid: boolean = resProfile.data.chargeType === 'Pre-paid';
        if (isPrepaid) {
          this.http.get(`/api/customerportal/newRegister/${this.mobileNo}/getBalance`).toPromise()
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
      }
    });
  }

  savePackage(mobileNo: any, selectPackage: any): void {
    this.transaction.data = {
      ...this.transaction.data,
      simCard: {
        mobileNo: mobileNo
      },
      onTopPackage: selectPackage
    };
  }

  onSelectedBestSellerPackage(event: any): void {
    this.onSelectPackage(event);
  }

  createForm(): void {
    this.mobileForm = this.formBuilder.group({
      'mobileNo': ['', Validators.compose([
        Validators.pattern(/^0[6-9]{1}[0-9]{8}/),
        Validators.required,
      ])]
    });

    if (this.mobileNo) {
      this.mobileForm.controls.mobileNo.setValue(this.mobileNo);
      this.pageLoadingService.openLoading();
      this.mobileProfile = null;
      this.getNTypeMobileNo(this.mobileNo).then((profile) => {
        this.nType = profile.data.detail.networkType;
        setTimeout(() => document.body.focus(), 1);
        return profile;
      })
        .then((profile) => {
          const status: string = (profile && profile.data && profile.data.detail.state) ? profile.data.detail.state : '';
          this.pageLoadingService.closeLoading();
          if (!['active'].includes(status.toLowerCase())) {
            this.pageLoadingService.closeLoading();
            if (status) {
              this.alertService.error('หมายเลขนี้ไม่สามารถทำรายการได้ กรุณาติดต่อ Call Center 1175');
            } else {
              this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
            }
          }
          setTimeout(() => document.body.focus(), 1);
        })
        .catch((error) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
        });
    }

    this.mobileForm.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
      if (this.mobileForm.controls.mobileNo.valid) {
        this.pageLoadingService.openLoading();
        this.mobileProfile = null;
        this.getNTypeMobileNo(this.mobileNo).then((profile) => {
          this.nType = profile.data.detail.networkType;
          this.pageLoadingService.closeLoading();
          return profile;
        }).then((profile) => {
          const status: string = (profile && profile.data && profile.data.detail.state) ? profile.data.detail.state : '';
          if (!['active'].includes(status.toLowerCase())) {
            if (status) {
              this.alertService.error('หมายเลขนี้ไม่สามารถทำรายการได้ กรุณาติดต่อ Call Center 1175');
            } else {
              this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
            }
          }
          this.readonly = true;
        }).catch((error: any) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
        });
      }
    });
  }

  keyPress(event: any): void {
    const charCode: number = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  onActiveInput(): void {
    this.readonly = false;
  }

  callService(): any {
    const userId = 'bMfAlzjKaZSSKY3s6c3farMxbUaEsFnIIAgbjsXKA3cOhnKfvawKb60MITINd04Os73YJBQ5aWypkxFk';
    this.packLoading = true;
    this.packageVasService = this.http.post('/api/salesportal/promotion-vas', { userId }).toPromise();
    this.packageVasService.then((response: any) => {
      const bestSellerItem = [];
      const packageCat = [];
      response.data.data.map((data: any) => {
        data.subShelves.map((subShelves: any) => {
          const listPackage = this.filterRomPackage(subShelves.items);
          listPackage.map((item: any) => {
            item.idCategory = data.priority;
            if (+item.customAttributes.best_seller_priority > 0) {
              item.mainTitle = data.title;
              if (data.title === 'เน็ตและโทร') {
                item.icon = 'assets/images/icon/Phone_net.png';
              } else if (data.title === 'เน้นคุย') {
                item.icon = 'assets/images/icon/Call.png';
              } else {
                item.icon = 'assets/images/icon/Net.png';
              }
              bestSellerItem.push(item);
            }
            packageCat.push(item);
          });
        });
      });
      return {
        best: bestSellerItem.sort((a: any, b: any) => (
          +a.customAttributes.best_seller_priority) - (b.customAttributes.best_seller_priority)),
        pack: packageCat
      };
    }).then(({ best, pack }) => {
      this.packageCat = pack;
      this.packagesBestSellers = best;
      this.tabs = this.getTabs(pack);
      this.selectedTab = this.tabs[0];
      this.packLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    if (this.usernameSub) {
      this.usernameSub.unsubscribe();
    }
  }

  getTabs(packageCat: any[]): any[] {
    const tabs = [];
    const categorys: any = [];
    packageCat.forEach((ca: any) => {
      if (!categorys.find((tab: any) => tab.name === ca.customAttributes.category)) {
        categorys.push({
          id: ca.idCategory,
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
        id: cate.id,
        name: cate.name,
        active: false,
        packages: setPack
      });
    });

    if (tabs.length > 0) {
      tabs.sort((a, b) => {
        return a.id - b.id;
      });
      tabs[0].active = true;
    }
    return tabs;
  }

  filterRomPackage(listPackage: any): any {
    try {
      if (this.transaction.data.transactionType === 'RomAgent') {
        return listPackage.filter(p => p.customAttributes.destination_server === 'ROM');
      } else {
        return listPackage.filter(p => p.customAttributes.destination_server !== 'ROM');
      }
    } catch (error) {
      return listPackage;
    }
  }

  toggleActiveTabs(tabName: any): void {
    this.tabs = this.tabs.map((tabData) => {
      if (tabData.name === tabName) {
        tabData.active = true;
      } else {
        tabData.active = false;
      }
      return tabData;
    });
    this.selectedTab = this.tabs.filter(tabData => tabData.name === tabName)[0];
  }

  getNTypeMobileNo(mobileNo: string): any {
    if (!this.mobileProfile) {
      return this.http.get(`/api/customerportal/get-profile-type`,
        { params: { mobileNo: mobileNo } }).toPromise().then((resProfile: any) => {
          this.mobileProfile = resProfile;
          return resProfile;
        }).catch((error) => {
          this.pageLoadingService.closeLoading();
          this.alertService.error('ไม่สามารถทำรายการได้ เลขหมายนี้ไม่ใช่ระบบ AIS');
        });
    } else {
      return Promise.resolve(this.mobileProfile);
    }
  }

  onSellBestSellerPackage(value: any): void {
    this.onSelectPackage(value);
  }

  getRomByUser(): any {
    this.aisNativeOrderService.getNativeUsername();
    this.usernameSub = this.aisNativeOrderService.getUsername().subscribe((response: any) => {
      this.http.get(`/api/easyapp/get-rom-by-user?username=${response.username}`).toPromise()
        .then((res: any) => {
          this.transaction.data.romAgent = {
            ...this.transaction.data.romAgent,
            usernameRomAgent: response.username,
            locationCode: response.locationCode,
            mobileNoAgent: res.data.mobileNo ? res.data.mobileNo : ''
          };
          this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
        }).catch((error) => {
          this.alertService.error(error);
        });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Transaction, HandsetSim5G } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreatePreToPostService } from 'src/app/shared/services/create-pre-to-post.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-pre-to-post-result-page',
  templateUrl: './order-pre-to-post-result-page.component.html',
  styleUrls: ['./order-pre-to-post-result-page.component.scss']
})
export class OrderPreToPostResultPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  serviceChange: any;
  createTransactionService: Promise<any>;
  isSuccess: boolean = false;

  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private createPreToPostService: CreatePreToPostService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private translationService: TranslateService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.createTransactionService = this.createPreToPostService.createPreToPost(this.transaction)
      .then(resp => {
        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.transactionService.update(this.transaction);
        return this.http.get(`/api/customerportal/newRegister/${this.transaction.data.simCard.mobileNo}/queryCurrentServices`).toPromise();
      })
      .then((resp: any) => {
        const currentServices = resp.data || [];
        this.serviceChange = currentServices.services.filter(service => service.canTransfer);
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.isSuccess = false;
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu(): void {
    // bug gotohome จะ unlock เบอร์ ทำให้ออก orderไม่สำเร็จ
    window.location.href = '/smart-digital/main-menu';
    // this.homeService.goToHome();
  }

  getMessage5G(): string {
    const handsetSim5G: HandsetSim5G = this.transaction.data.handsetSim5G || {} as HandsetSim5G;
    const sim: string = handsetSim5G.sim;
    const handset: string = handsetSim5G.handset;

    if (this.isPackage5G()) {
      if (sim === 'N' && handset === 'N') {
        return 'แนะนำเปลี่ยน SIM และใช้เครื่องที่รองรับ 5G เพื่อประสิทธิภาพในการใช้งาน';
      }
      if (sim === 'N') {
        return 'แนะนำเปลี่ยน SIM เพื่อประสิทธิภาพในการใช้งาน 5G';
      }
      if (handset === 'N') {
        return 'แนะนำใช้เครื่องที่รองรับ 5G เพื่อประสิทธิภาพในการใช้งาน';
      }
    } else {
      return '';
    }
  }

  isPackage5G(): boolean {
    const REGEX_PACKAGE_5G = /5[Gg]/;
    const mainPackage = this.transaction.data.mainPackage;
    if (mainPackage && REGEX_PACKAGE_5G.test(mainPackage.productPkg)) {
      return true;
    } else {
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HomeService, ShoppingCart, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-new-register-econtact-page',
  templateUrl: './device-order-ais-new-register-econtact-page.component.html',
  styleUrls: ['./device-order-ais-new-register-econtact-page.component.scss']
})
export class DeviceOrderAisNewRegisterEcontactPageComponent implements OnInit {
  wizards = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  shoppingCart: ShoppingCart;
  eContactSrc: string;
  agreement: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callService();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  callService() {
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/generate-e-document', {
      data: {
        advancePay: '6,420',
        airTimeDiscount: '642',
        airTimeMonth: '10',
        brand: 'APPLE',
        campaignName: 'AIS Hot Deal 1',
        color: 'SPACE GREY',
        // tslint:disable-next-line:max-line-length
        condition: '<br><label>1)	ข้าพเจ้าตกลงใช้บริการโทรศัพท์ที่เลือกซื้อ กับการใช้บริการหมายเลขโทรศัพท์เคลื่อนที่ในระบบ AIS รายเดือน ตามแพ็กเกจค่าบริการรายเดือนข้างต้น โดยใช้บริการต่อเนื่องตามระยะเวลาที่กำหนด และชำระค่าใช้บริการภายในวันที่บริษัทฯ กำหนด นับตั้งแต่วันที่ทำข้อตกลงฉบับนี้ หรือนับระยะเวลาต่อเนื่องจากข้อตกลงใช้บริการฉบับอื่นที่ข้าพเจ้าได้ตกลงไว้ก่อนหน้านี้ ซึ่งยังคงมีผลใช้บังคับอยู่</label><br><label>2) กรณีข้าพเจ้ายกเลิก หรือถูกยกเลิกบริการ ขอเปลี่ยนแปลงหมายเลขโทรศัพท์ ขอย้ายเครือข่ายเลขหมายเดิม ขอโอนเปลี่ยนเจ้าของ หรือขอเปลี่ยนเป็นระบบเติมเงิน ก่อนครบกำหนดเวลาที่ตกลงไว้ ถือว่าข้าพเจ้าผิดข้อตกลงนี้ และยินยอมให้บริษัทฯ มีสิทธิ์ระงับการใช้เครื่องโทรศัพท์ดังกล่าวได้ทันที รวมทั้งตกลงชำระค่าปรับเท่ากับส่วนลดค่าเครื่อง (ก่อน VAT) ตามที่ได้รับให้แก่บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด ในวันที่ยกเลิกบริการ หรือผิดข้อตกลงทันที และไม่ขอรับค่าแพ็กเกจบริการล่วงหน้าที่ชำระในโครงการนี้คืน</label><li>ผู้ใช้บริการที่ซื้อเครื่องโทรศัพท์ Samsung ราคาพิเศษรุ่นที่กำหนด จะได้กรรมสิทธิ์ในเครื่องโทรศัพท์จากบริษัท/ผู้แทนจำหน่ายของบริษัท เมื่อปฏิบัติถูกต้องและครบถ้วน ตามข้อ 1.  และ ข้อ 2. นอกจากนี้ผู้ใช้บริการยินยอมให้บริษัทดำเนินการดังต่อไปนี้ได้ทันที</li> <ol> <li>ส่งข้อความเพื่อแจ้งเตือนหากเกินกำหนดการนัดชำระค่าบริการและหมายเลขถูกระงับการโทรออก</li> <li>ดำเนินการล็อกเครื่องโทรศัพท์หากผู้ใช้บริการละเลย หรือเพิกเฉยการชำระค่าบริการภายในระยะเวลาที่กำหนด และหมายเลขถูกระงับการโทรออกและรับสายเข้า</li> </ol> </ol>',
        contract: 12,
        customerType: '',
        fullName: 'พิมพิไล อินทร์ป่าน',
        idCard: 'XXXXXXXXX1423',
        imei: '',
        locationName: 'สาขาอาคารเอไอเอส 2',
        mobileCarePackageTitle: '',
        mobileNumber: '0889540858',
        model: 'APPLE iPhone X 256GB',
        netPrice: '29,000',
        // tslint:disable-next-line:max-line-length
        packageDetail: 'ค่าบริการรายเดือน 499บ. โทรทุกเครือข่าย 100นาที โทรในเครือข่าย 06-18น. ไม่จำกัด (ครั้งละไม่เกิน60นาที) เน็ตความเร็วสูงสุด4Mbps (22-18น. ไม่จำกัด /18-22น. 2GB จากนั้นใช้ได้ต่อเนื่องความเร็ว 128Kbps), AIS SUPER WiFi, โทร1.5บ./นาที,SMS3บ.,MMS4บ. 24 รอบบิล',
        price: '35,420',
        priceDiscount: '16,000',
        priceIncludeVat: '45,000',
        signature: '',
      },
      docType: 'ECONTRACT',
      location: '1100'
    }).toPromise()
      .then((resp: any) => this.eContactSrc = resp.data)
      .then(() => this.pageLoadingService.closeLoading());
  }

}

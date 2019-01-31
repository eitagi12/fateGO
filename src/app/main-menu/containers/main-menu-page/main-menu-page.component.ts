import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit {

  menus = [
    { link: '/buy-product/brand', icon: '/assets/svg/ico-device.svg', text: 'ซื้อเครื่อง' },
    { link: '/order/new-register', icon: '/assets/svg/ico-new-register-1.svg', text: 'เปิดเบอร์ใหม่' },
    { link: '/order/mnp', icon: '/assets/svg/ico-mpn.svg', text: 'ย้ายค่ายมา AIS' },
    { link: '/order/pre-to-post', icon: '/assets/svg/ico-pre-to-post.svg', text: 'เปลี่ยนเติมเงินเป็นรายเดือน' }
  ];

  constructor() { }

  ngOnInit() {
  }

}

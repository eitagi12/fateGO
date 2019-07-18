import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-vas-package-tab',
  templateUrl: './vas-package-tab.component.html',
  styleUrls: ['./vas-package-tab.component.scss']
})
export class VasPackageTabComponent implements OnInit, OnChanges {
  @Input() categoryTab: any;
  @Input() index: any;
  @Input() transactionType: string;
  @Input() nType: string;
  @Output() selectedPackage: EventEmitter<any> = new EventEmitter<any>();

  tabs: Array<any> = [];
  filedPrograms: Array<any> = [
    ['ค่าบริการ บ.', 'เน็ตรวม', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'content', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'โทร', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'เน็ตรวม', 'โทร', 'จำนวนวัน']
  ];
  selectedTab: any;

  constructor() { }

  ngOnInit(): void {
    console.log('nType =>>> ', this.nType);
  }

  ngOnChanges(): void {
    console.log('nType =>>> ', this.nType);
    console.log('categoryTab', this.categoryTab);
    this.tabs = this.getTabs(this.categoryTab || []);
    this.selectedTab = this.tabs[0];
  }

  getTabs(packageCat: any[]): any[] {
    const tabs = [];
    const categorys: any = [];
    if (this.nType) {
      packageCat.filter((pack) => [...pack.customAttributes.allow_ntype.split(',')].includes(this.nType));
    }
    console.log('index', this.index);
    packageCat.forEach((ca: any) => {
      if (!categorys.find((tab: any) => tab.name === ca.customAttributes.sub_category)) {
        categorys.push({
          name: ca.customAttributes.sub_category,
          active: false,
          packages: []
        });
      }
    });
    categorys.forEach((cate: any) => {
      const setPack: any = [];
      packageCat.forEach((pack: any) => {
        if (cate.name === pack.customAttributes.sub_category) {
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
    return tabs;
  }

  setActiveTabs(tabCode: any): void {
    this.tabs = this.tabs.map((tabData) => {
      tabData.active = !!(tabData.code === tabCode);
      return tabData;
    });
    this.selectedTab = this.tabs.filter(tabData => tabData.name === tabCode)[0];
    console.log('package', this.selectedTab.packages);
  }
  onSelectedPackage(value: any): void {
    this.selectedPackage.emit(value);
  }

  getPrice(customAttributes: any): any {
    if (customAttributes) {
      if (this.transactionType === 'RomAgent') {
        return customAttributes.regular_price;
      } else {
        return customAttributes.customer_price;
      }
    }
  }
}

import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-vas-package-tab',
  templateUrl: './vas-package-tab.component.html',
  styleUrls: ['./vas-package-tab.component.scss']
})
export class VasPackageTabComponent implements OnInit, OnChanges {
  @Input() categoryTab: any;
  @Input() transactionType: string;
  @Input() nType: string;
  @Output() selectedPackage: EventEmitter<any> = new EventEmitter<any>();

  tabs: Array<any> = [];
  filedPrograms: Array<any> = [
    ['ค่าบริการ บ.', 'เน็ตรวม', 'โทร', 'content', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'เน็ตรวม', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'content', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'โทร', 'จำนวนวัน'],
    ['ค่าบริการ บ.', 'เน็ตรวม', 'โทร', 'จำนวนวัน']
  ];
  selectedTab: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    const catePackages = this.categoryTab ? this.categoryTab.packages || [] : [];
    this.tabs = this.getTabs(catePackages);
    this.selectedTab = this.tabs[0];
  }

  getTabs(packageCat: any[]): any[] {
    const tabs = [];
    const categories: any = [];
    if (this.nType) {
      packageCat = packageCat.filter((pack) => {
        return [...pack.customAttributes.allow_ntype.split(',')].includes(this.nType);
      });
    }
    packageCat.forEach((ca: any) => {
      if (!categories.find((tab: any) => tab.name === ca.customAttributes.sub_category)) {
        categories.push({
          name: ca.customAttributes.sub_category,
          active: false,
          packages: []
        });
      }
    });

    categories.forEach((cate: any) => {
      const setPack: any = [];
      packageCat.forEach((pack: any) => {
        if (cate.name === pack.customAttributes.sub_category) {
          setPack.push(pack);
        }
      });
      setPack.sort((a: any, b: any) => a.customAttributes.priority - b.customAttributes.priority);
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

  showDetailColumn(name: string, customAttributes: any): string {
    if (name === 'บันเทิงจัดเต็ม') {
      return customAttributes.content;
    } else if (name === 'เน้นคุย') {
      return customAttributes.call_minute;
    } else {
      return customAttributes.internet_valume;
    }
  }

  togglePackageDetail(pack: any): void {
    this.selectedTab.packages.map(p => {
      if (p.id === pack.id) {
        p.showDetail = !p.showDetail;
      } else {
        p.showDetail = false;
      }
      return p;
    });
  }
}

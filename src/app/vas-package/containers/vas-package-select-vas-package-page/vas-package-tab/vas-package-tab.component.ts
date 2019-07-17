import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vas-package-tab',
  templateUrl: './vas-package-tab.component.html',
  styleUrls: ['./vas-package-tab.component.scss']
})
export class VasPackageTabComponent implements OnInit {
  @Input() categoryTab: any;
  tabs: Array<any> = [];

  constructor() { }

  ngOnInit(): void {
    console.log('categoryTab', this.categoryTab);
    this.tabs = this.getTabsFormPriceOptions(this.categoryTab.packages);
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
      tabData.active = !!(tabData.code === tabCode);
      return tabData;
  });
}
}

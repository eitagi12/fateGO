import { Component, OnInit, Input } from '@angular/core';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TradeInService } from '../../services/trade-in.service';
import { Subscription } from 'rxjs';
import { Criteriatradein } from 'src/app/shared/models/trade-in.model';

@Component({
  selector: 'app-criteria-trade-in',
  templateUrl: './criteria-trade-in.component.html',
  styleUrls: ['./criteria-trade-in.component.scss']
})
export class CriteriaTradeInComponent implements OnInit {

  valuationlists: any;
  objCriteriatradein: Criteriatradein;
  objTradein: any;
  listForm: FormGroup;
  btnNextDisabled = true;
  criteriaForm: FormGroup;


  constructor(private router: Router,
    private homeService: HomeService,
    private tradeInService: TradeInService,
    private pageLoadingService: PageLoadingService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.setFormValuation();
    this.ListValuationTradein();
    this.objTradein = this.tradeInService.getTradein();
  }

  createForm(valuationlists: any[]) {
    const controls = valuationlists.map(() => new FormControl(false));
    this.criteriaForm = this.fb.group({
      checkedCri: this.fb.array(controls)
    });
  }
  // createForm(valuationlists: any[]) {
  //   const controls = valuationlists.map(() => new FormControl(false));
  //   console.log(controls);
  //   this.criteriaForm = this.fb.group({
  //     checkedCri: this.fb.array(controls)
  //   });
  //   console.log('criteriaForm   ');
  //   console.log(this.criteriaForm.value);
  // }

  ListValuationTradein() {
    this.pageLoadingService.openLoading();
    const tradeIn: any = JSON.parse(localStorage.getItem('Tradein'));
    const brand: any = tradeIn.brand;
    const model: any = tradeIn.model;


    this.tradeInService.getListValuationTradein(brand, model).then(
      (res: any) => {
        this.valuationlists = res.data.listValuation;
        for (const item of this.valuationlists) {
          item.valChecked = 'N';
        }
        // this.createForm(this.valuationlists);
        this.setFormValuation();
        this.pageLoadingService.closeLoading();
      },
      (err: any) => {
        this.pageLoadingService.closeLoading();
        console.log(err);
      });
  }

  selectValuationlistFn(val: any, checked: any) {
    if (checked.target.checked === true) {
      val.valChecked = 'Y';
      this.btnNextDisabled = false;
    } else if (checked.target.checked === false) {
      val.valChecked = 'N';
      this.btnNextDisabled = true;
    }
  }

  setFormValuation () {
    this.listForm = new FormGroup({
      valuationlists: new FormControl('', [Validators.required])
    });
  }

  OnDestroy() {
    this.tradeInService.removeTradein();
  }

  onHome() {
    window.location.href = '/sale-portal/dashboard';
  }

  onBack() {
    this.tradeInService.removeTradein();
    this.router.navigate(['trade-in/verify-trade-in']);
  }

  onCancel() {
    this.listForm.reset();
    console.log(this.listForm.reset());

  }

  onNext() {
    this.objCriteriatradein = {
      brand: this.objTradein.brand,
      model: this.objTradein.model,
      matCode: this.objTradein.matCode,
      serialNo: this.objTradein.serialNo,
      listValuationTradein: this.valuationlists
    };
    this.tradeInService.setValuationlistTradein(this.objCriteriatradein);
    this.router.navigate(['trade-in/confirm-trade-in']);
  }

  isNext() {
    return this.selectValuationlistFn;
  }
}

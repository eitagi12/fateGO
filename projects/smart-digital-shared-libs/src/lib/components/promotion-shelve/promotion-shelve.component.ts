import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export interface PromotionShelve {
  title: string;
  icon?: 'icon-call' | 'icon-iswop' | 'icon-net' | 'icon-net-call' | 'icon-special' | 'icon-p5G';
  active?: boolean;
  promotions?: PromotionShelveGroup[];
}

export interface PromotionShelveGroup {
  id: string;
  title: string;
  sanitizedName?: string;
  active?: boolean;
  items?: PromotionShelveItem[];
}

export interface PromotionShelveItem {
  id: string;
  title: string;
  detail: string;
  condition?: string;
  value: any;
}

@Component({
  selector: 'smart-digital-promotion-shelve',
  templateUrl: './promotion-shelve.component.html',
  styleUrls: ['./promotion-shelve.component.scss']
})
export class PromotionShelveComponent implements OnInit {

  @Input()
  promotionShelves: PromotionShelve[];

  @Input()
  selected: any;

  @Input()
  view: boolean;

  @Output()
  completed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  condition: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('template')
  template: TemplateRef<any>;

  modalRef: BsModalRef;
  detail: string;

  promotionShelveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.promotionShelveForm = this.fb.group({
      promotion: [null, Validators.required]
    });

    this.promotionShelveForm.valueChanges
      .subscribe(observer => {
        this.completed.emit(observer.promotion.value);
      });

  }

  onPromotionShelveSelected(promotionShelve: PromotionShelve): void {
    if (promotionShelve.active) {
      return;
    }
    promotionShelve.active = !promotionShelve.active;
  }

  onPromotionGroupSelected(promotionShelve: PromotionShelve, promotionShelveGroup: PromotionShelveGroup): void {
    if (promotionShelveGroup.active) {
      return;
    }

    promotionShelve.promotions.forEach((promotion: PromotionShelveGroup) => {
      promotion.active = promotion.id === promotionShelveGroup.id;
    });
  }

  onTermConditions(): void {
    let currentCondition = '';

    if (this.promotionShelveForm && this.promotionShelveForm.value.promotion) {
      currentCondition = this.promotionShelveForm.value.promotion.condition;
    }
    this.condition.emit(currentCondition);
  }

  onOpenModal(item: any): void {
    this.detail = this.getDescription(item) || '';
    this.modalRef = this.modalService.show(this.template, { class: 'pt-5 mt-5' });
  }

  getDescription(item: any): string {
    const customAttributes = (item && item.value && item.value.customAttributes) ? item.value.customAttributes : '';
    if (customAttributes) {
      return this.isEngLanguage() ? customAttributes.descriptionEng : customAttributes.descriptionThai || '';
    } else {
      return item.detail;
    }
  }

  isEngLanguage(): boolean {
    return this.translateService.currentLang === 'EN';
  }

  checked(value: any): boolean {
    // if (this.selected && this.selected.itemId === value.itemId) {
    //   return true;
    // }
    return JSON.stringify(value) === JSON.stringify(this.selected);
  }
}

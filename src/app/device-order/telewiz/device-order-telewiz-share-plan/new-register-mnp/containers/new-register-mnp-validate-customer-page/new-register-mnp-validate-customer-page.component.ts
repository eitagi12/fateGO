import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
// import { thaiIDValidator } from 'app/shared/custom-validator/thai-id.directive';
// import { ChannelType } from 'app/core/channel-type.constant';
// import { TokenService } from 'app/core/token.service';
// import { MessageValidateCustomer } from 'app/prepaid-hotdeal/constants/message-validate-customer.constant';
// import { ID_CARD, IMM_CARD, PASSPORT } from 'app/prepaid-hotdeal/constants/message.constant';
@Component({
  selector: 'app-new-register-mnp-validate-customer-page',
  templateUrl: './new-register-mnp-validate-customer-page.component.html',
  styleUrls: ['./new-register-mnp-validate-customer-page.component.scss']
})
export class NewRegisterMnpValidateCustomerPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  @Input() onNextPress: Function;
  @Input() onBackPress: Function;
  @Input() onCardImgPress: Function;
  @Input() placeholder: string;

  identityType: string;
  identityForm: FormGroup;
  activeNextBtn: boolean = false;
  identityValue: string;

  private formErrors: any = {
    identity: ''
  };

  idCardValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      thaiIdDigit: 'กรุณากรอกหมายเลขบัตรประชาชนให้ถูกต้อง',
      minlength: 'กรุณากรอกหมายเลขบัตรประชาชนให้ครบทั้ง 13 หลัก',
      maxlength: 'กรุณากรอกหมายเลขบัตรประชาชนให้ครบทั้ง 13 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  idMMCardValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอกบัตรประจำตัวคนต่างด้าวให้ครบทั้ง 13 หลัก',
      maxlength: 'กรุณากรอกบัตรประจำตัวคนต่างด้าวให้ครบทั้ง 13 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  idPassportValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอกหนังสือเดินทางให้ครบทั้ง 9 หลัก',
      maxlength: 'กรุณากรอกหนังสือเดินทางให้ครบทั้ง 9 หลัก',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  commonValidationMessages: any = {
    identity: {
      required: 'กรุณากรอกหมายเลขบัตรเพื่อยืนยันตัวตน',
      minlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      maxlength: 'กรุณากรอก หมายเลขบัตรประชาชน',
      pattern: 'กรุณากรอกหมายเลขบัตรโดยไม่มีอักษระพิเศษ'
    }
  };

  constructor(
    // private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {
    // super();
    this.placeholder = this.placeholder || 'หมายเลขบัตรประชาชน';
  }

  ngOnInit(): void {
    if (this.identityType) {
      this.buildForm(this.identityType);
    } else {
      this.buildForm();
    }
  }

  buildForm(identityType?: string): void {
    this.identityForm = this.formBuilder.group({
      identity: [this.identityValue, Validators.minLength(9)]
    });

    // this.identityForm.controls['identity'].valueChanges
    //   .debounceTime(500)
    //   .subscribe((identityValue: any) => {
    //     this.onValueChanged(identityValue);
    //   });
  }

  onValueChanged(data?: any): void {
    // let flow: boolean = JSON.parse(localStorage.getItem('flowLotus'));
    // if (data[0] === '0' && !(flow)) {
    //   this.identityType = IMM_CARD;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.maxLength(13),
    //     Validators.minLength(13),
    //     Validators.pattern('[0-9.]+')
    //   ]);
    // } else if (data.match(/^[a-z]/ig) && !(flow)) {
    //   this.identityType = PASSPORT;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.maxLength(9),
    //     Validators.minLength(9),
    //     Validators.pattern('^[A-Z]{2}[0-9]{7}')
    //   ]);
    //   this.identityForm.controls.identity.setValue(data.toUpperCase());
    // } else {
    //   this.identityType = ID_CARD;
    //   this.identityForm.controls.identity.setValidators([
    //     Validators.required,
    //     Validators.pattern('[0-9.]+'),
    //     Validators.maxLength(13),
    //     Validators.minLength(13),
    //     thaiIDValidator()
    //   ]);
    // }
    // if (!this.identityForm) { return; }
    // const form: any = this.identityForm;

    // // tslint:disable-next-line: forin
    // for (const field in this.formErrors) {
    //   this.formErrors[field] = '';
    //   const control = form.get(field);
    //   if (control && !control.valid) {
    //     this.activeNextBtn = false;
    //     const messages = this.getErrorMessages(this.identityType)[field];
    //     // tslint:disable-next-line: forin
    //     for (const key in control.errors) {
    //       this.formErrors[field] += messages[key] + ' ';
    //     }
    //   } else if (control && control.valid) {
    //     this.activeNextBtn = true;
    //   }
    // }
  }

  getErrorMessages(identityType: string): any {
    // switch (identityType) {
    //   case ID_CARD:
    //     return this.idCardValidationMessages;
    //   case IMM_CARD:
    //     return this.idMMCardValidationMessages;
    //   case PASSPORT:
    //     return this.idPassportValidationMessages;
    //   default:
    //     return this.commonValidationMessages;
    // }
  }

  onNextPressCaller(): void {
    // this.onNextPress($('#txtRegNumVerifyStartKeyInCard').val());
  }

  onBackPressCaller(): void {
    // this.onBackPress();
  }

  onCardImgPressCaller(): void {
    // this.onCardImgPress();
  }
}

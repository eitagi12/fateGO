import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_OMNI_NEW_SHARE_PLAN_MNP } from 'src/app/omni/constants/wizard.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-share-plan-mnp-face-confirm-page',
  templateUrl: './new-share-plan-mnp-face-confirm-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-confirm-page.component.scss']
})
export class NewSharePlanMnpFaceConfirmPageComponent implements OnInit {

  wizards: string[] = WIZARD_OMNI_NEW_SHARE_PLAN_MNP;
  confirmForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.confirmForm = this.fb.group({
      code: ['******', Validators.required]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

}

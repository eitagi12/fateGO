import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentComponent } from './select-payment.component';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Pipe({name: 'translate'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
      return value;
    }
}

describe('SelectPaymentComponent', () => {
  let component: SelectPaymentComponent;
  let fixture: ComponentFixture<SelectPaymentComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      TranslateModule
    ],
    declarations: [
      SelectPaymentComponent,
      MockPipe
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

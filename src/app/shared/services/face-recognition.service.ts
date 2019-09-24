import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionAction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})

export class FaceRecognitionService {

  constructor(
    private http: HttpClient,
    private transactionService: TransactionService
  ) {}

  facecompare(): Promise<any>  {
    const transaction: Transaction = this.transactionService.load();
    return this.http.post(
      '/api/facerecog/facecompare',
      this.getRequestFaceRecognition(transaction)).toPromise();
  }

  getRequestFaceRecognition(transaction: Transaction): any {
    const customer: any = transaction.data.customer;
    const faceRecognition: any = transaction.data.faceRecognition;
    const data: any = {
      cardBase64Imgs: this.isReadCard() ? customer.imageReadSmartCard : (customer.imageSmartCard || customer.imageReadPassport),
      selfieBase64Imgs: faceRecognition.imageFaceUser
    };
    return data;
  }

  private isReadCard(): boolean {
    const transaction: Transaction = this.transactionService.load();
    return transaction.data.action === TransactionAction.READ_CARD;
  }

}

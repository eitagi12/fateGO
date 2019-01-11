import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt-trade-in',
  templateUrl: './receipt-trade-in.component.html',
  styleUrls: ['./receipt-trade-in.component.scss']
})
export class ReceiptTradeInComponent implements OnInit {

  title = "Trade In Form";

  Commpany = "AIS";
  brand = "APPLE";
  model = "I6 Plus";
  grade = "AAAAA";
  price = "5,000";
  tradeinNo = "1111111111111";
  serialNo = "222222222222"

  constructor() { }

  ngOnInit() {

  }

  receiptTradeinPrint(){
  // let  brand = this.brand;
  // let  model = this.model;
  // let  grade = this.grade;
  // let  price = this.price;
  }

}

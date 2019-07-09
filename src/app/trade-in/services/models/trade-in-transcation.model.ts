export enum TransactionType {
    TRADE_IN = 'Trade-In'
  }

export interface TradeInTranscation {
    transactionId?: string;
    createDate?: string;
    createBy?: string;
    lastUpdateDate?: string;
    lastUpdateBy?: string;
    data?: TradeInTranscationData;
}

export interface TradeInTranscationData {
    transactionType: TransactionType;
    tradeIn?: TradeIn;
}

export interface TradeIn {
    brand: string;
    model: string;
    matCode?: string;
    serialNo: string;
    tradeInNo?: string;
    tradeInPrice?: string;
    tradeInGrade?: string;
    listValuation?: ValValuation[];
    company?: string;
  }

  export interface ValValuation {
    valCode?: string;
    valChecked?: string;
    valDesc?: string;
  }

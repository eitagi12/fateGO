export interface TradeInTranscation {
    transactionId?: string;
    createDate?: string;
    createBy?: string;
    lastUpdateDate?: string;
    lastUpdateBy?: string;
    data?: TradeInTranscationData;
}

export interface TradeInTranscationData {
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
  }

  export interface ValValuation {
    valCode?: string;
    valChecked?: string;
    valDesc?: string;
  }


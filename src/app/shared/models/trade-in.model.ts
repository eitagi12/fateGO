export interface Tradein {
    brand: string;
    model: string;
    matCode: string;
    serialNo: string;
}

export interface Criteriatradein {
    brand?: string;
    model?: string;
    matCode?: string;
    serialNo?: string;
    listValuationTradein: [ValValuation];
}

export interface RequestEstimateTradein {
    locationCode: string;
    userId: string;
    brand: string;
    model: string;
    matCode: string;
    serialNo: string;
    aisFlg: string;
    listValuation: ValValuation;
}

export interface ValValuation {
    valCode: string;
    valChecked: string;
    valDesc: string;
}

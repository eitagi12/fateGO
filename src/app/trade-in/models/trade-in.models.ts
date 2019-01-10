export interface Tradein {
    brand: string;
    model: string;
    matCode: string;
    serialNo: string;
}

export interface EstimateTradein {
    locationCode: string;
    userId: string;
    brand: string;
    model: string;
    matCode: string;
    serialNo: string;
    aisFlg: string;
    listValuation: any;
}

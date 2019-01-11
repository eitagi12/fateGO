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
    listValuationTradein: object;
}

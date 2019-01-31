

export interface PriceOption {
    queryParams: any;
    productStock: any;
    campaign: any;
    trade: any;
}

export interface PrivilegeTradeAdvancePay {
    amount: number;
    installmentFlag: string;
    matAirtime: string;
    description: string;
    promotions: PrivilegeTradeAdvancePayPromotion[];
}
export interface PrivilegeTradeAdvancePayPromotion {
    promotionCode: string;
    promotionName: string;
    productType: string;
    billingSystem: string;
}
export interface PrivilegeTradeBank {
    abb: string;
    name: string;
    imageUrl: string;
    promotion: string;
    installment: PrivilegeTradeInstallment;
    remark: string;
    installmentDatas?: PrivilegeTradeInstallment[];
}
export interface PrivilegeTradeInstallment {
    installmentPercentage: number;
    installmentMounth: number;
}

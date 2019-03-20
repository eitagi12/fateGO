export class PriceOptionUtils {

    static getInstallmentsFromCampaign(campaign: any): any[] {

        return this.getInstallmentsFromTrades(
            campaign.privileges.flatMap(privilege => privilege.trades)
        );

    }

    static getInstallmentsFromTrades(trades: any): any[] {
        const data = (trades || []).map((trade: any) => {
            const advancePay = trade.advancePay || {};
            return trade.banks.map((bank: any) => {
                const installment = (bank.installment || '').split(/(%|เดือน)/);
                const percentage = +(installment[0] || 0);
                const month = +(installment[2] || 0);
                const advancePayAmount = advancePay.installmentFlag === 'Y' && +advancePay.amount > 0 ? +advancePay.amount : 0;
                return {
                    abb: bank.abb,
                    imageUrl: bank.imageUrl,
                    percentage: percentage,
                    month: month,
                    name: bank.name,
                    advancePay: this.calculateAdvancePay(+trade.promotionPrice, advancePayAmount, month, percentage),
                    promotionPrice: this.calculatePrice(+trade.promotionPrice, month, percentage),
                    showAdvancePay: advancePayAmount > 0 ? true : false
                };
            })
                .filter(bank => {
                    return bank.month > 0;
                })
                .reduce((prev, curr) => {
                    const key = `${curr.percentage} - ${curr.month}`;
                    if (!prev[key]) {
                        prev[key] = [];
                    }
                    prev[key] = prev[key].filter(p => curr.abb !== p.abb);
                    prev[key].push(curr);
                    return prev;
                }, {});

        })
            .filter(trade => Object.keys(trade).length > 0)
            .reduce((prev, curr) => {
                Object.keys(curr).forEach(key => {
                    if (!prev[key]) {
                        prev[key] = [];
                    }
                    prev[key] = prev[key].concat(curr[key])
                        .sort((a, b) => a.abb.localeCompare(b.abb));
                });
                return prev;
            }, {});

        // Filter bank abb unique
        const installments = Object.keys(data).map((key: any) => {
            const trade = data[key];
            const advancePay = trade.map(o => o.advancePay).sort((a, b) => a - b);
            const promotionPrice = trade.map(o => o.promotionPrice);
            return {
                group: key,
                month: trade[0].month, // array ที่มีค่าเดียวกัน
                percentage: trade[0].percentage, // array ที่มีค่าเดียวกัน
                advancePay: {
                    min: trade[0].showAdvancePay ? Math.min(...advancePay) : 0,
                    max: trade[0].showAdvancePay ? Math.max(...advancePay) : 0
                },
                promotionPrice: {
                    min: Math.min(...promotionPrice),
                    max: Math.max(...promotionPrice)
                },
                banks: trade.filter((bank, index) => {
                    const i = index + 1;
                    if (trade.length > i) {
                        return bank.abb !== trade[i].abb;
                    } else {
                        return true;
                    }
                }).map((o: any) => {
                    return {
                        abb: o.abb,
                        imageUrl: o.imageUrl,
                        name: o.name
                    };
                })
            };
        }).sort((a: any, b: any) => { // จ่ายน้อยผ่อนนาน
            return a.month > b.month ? -1 : 1;
        });
        return installments;
    }

    static getDiscountFromCampaign(campaign: any): any {

        let discounts: number[] = [];
        (campaign.privileges || []).forEach((privilege: any) => {
            const amounts = (privilege.trades || []).filter((trade: any) => {
                return trade.discount
                    && trade.discount.specialAmount
                    && trade.discount.specialType === 'P'
                    && trade.banks
                    && trade.banks.length > 0;
            }).map(trade => +trade.discount.specialAmount);

            if (amounts && amounts.length > 0) {
                discounts = discounts.concat(amounts);
            }
        });
        return discounts.filter(discount => discount).sort((a, b) => a !== b ? a < b ? -1 : 1 : 0);
    }

    // คำนวนเปอร์เซ็น
    static calculatePrice(amount: number, month: number, percentage: number) {
        if (month === 0 && percentage === 0) {
            return 0;
        }
        if (percentage === 0) {
            return Math.round(amount / month);
        } else {
            return Math.round((amount + (month * (month * Math.ceil(percentage) / 100))) / month);
        }
    }

    // คำนวนผ่อนชำระค่าเครื่องพร้อมค่าแพ็กเกจล่วงหน้า
    static calculateAdvancePay(price: number, advancePay: number, month: number, percentage: number) {
        if (price <= 0 || month === 0 && percentage === 0) {
            return 0;
        }

        if (percentage === 0) {
            return Math.round((price + advancePay) / month);
        } else {
            return Math.round((
                (price + advancePay + (month *
                    (price + advancePay) * Math.ceil(percentage) / 100)
                )
            ) / month);
        }
    }

}

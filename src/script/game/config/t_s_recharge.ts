// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_recharge
*/
export default class t_s_recharge {
        public mDataList: t_s_rechargeData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_rechargeData(list[i]));
                }
        }
}

export class t_s_rechargeData extends t_s_baseConfigData {
        //ProductId（游戏商品ID, 唯一）
        public ProductId: string;
        //ProductType(游戏商品类型)
        public ProductType: number;
        //ProductName(商品名称)
        public ProductName: string;
        //ProductDesc(商品描述)
        public ProductDesc: string;
        //MoneyType（货币单位）
        public MoneyType: string;
        //MoneyNum（对应支付币种的金额）
        public MoneyNum: string;
        //VIPEx（对应赠送VIP经验）
        public VIPEx: number;
        //Para1（参数1）
        public Para1: string;
        //Para2（参数2）
        public Para2: string;
        //Para3（参数3）
        public Para3: string;
        //Para4（参数4）
        public Para4: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

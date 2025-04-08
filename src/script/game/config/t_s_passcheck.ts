// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_passcheck
*/
export default class t_s_passcheck {
        public mDataList: t_s_passcheckData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_passcheckData(list[i]));
                }
        }
}

/**
 *      "FreeReward": "208005,2",
        "Grade": 2,
        "Id": 1002,
        "Index": 2,
        "IsTips": 0,
        "PayReward": "208023,5"
 */
export class t_s_passcheckData extends t_s_baseConfigData {
        //主键ID
        public Id: number;
        //等级 增加Grade=-1的奖励, 为溢出等级的固定奖励
        public Grade: number;
        //所需经验
        // public NeedExperience: number;
        //免费奖励
        public FreeReward: string;
        //进阶奖励
        public PayReward: string;
        //是否为预览档位
        public IsTips: number;
        //对应职业 6)	战令奖励取消职业区分, t_s_passcheck表中Job字段删去
        // public Job: number; 
        //新增Index控制期数, 默认为0, 优先读取非默认配置
        public Index: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

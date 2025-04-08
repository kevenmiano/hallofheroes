// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_actiontemplate
*/
export default class t_s_actiontemplate {
        public mDataList: t_s_actiontemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_actiontemplateData(list[i]));
                }
        }
}

export class t_s_actiontemplateData extends t_s_baseConfigData {
        //ActionId(编号)
        public ActionId: number;
        //ActionName(注释, 程序不调用)
        public ActionName: string;
        //AttackTimes(攻击次数, 需要与t_s_action模板中对应动作的受击次数(3/11/12)之和相等)
        public AttackTimes: number;
        //FrameNum(动作总帧数, 如果是奥义则需要增加30帧)
        public FrameNum: number;
        //AttackType(统一设为1)
        public AttackType: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

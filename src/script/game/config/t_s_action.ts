import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_action
*/
export default class t_s_action {
        public mDataList: t_s_actionData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_actionData(list[i]));
                }
        }
}

export class t_s_actionData extends t_s_baseConfigData {
        //关键Key
        public key: number;
        //ActionId(编号)
        public ActionId: number;
        //ActionType(动作类型,详见说明,每个action必须有99标示的结束帧)
        public ActionType: number;
        //Frame(帧数)
        public Frame: number;
        //Para(参数,详见说明)
        public Para: string[];
        //音效
        public Sound: string;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

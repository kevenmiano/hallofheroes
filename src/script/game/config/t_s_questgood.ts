import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_questgood
*/
export default class t_s_questgood {
        public mDataList: t_s_questgoodData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_questgoodData(list[i]));
                }
        }
}

export class t_s_questgoodData extends t_s_baseConfigData {
        //TemplateId(任务编号)
        public TemplateId: number;
        //RewardItemID(奖励物品编号)
        public RewardItemID: number;
        //RewardItemCount(数量)
        public RewardItemCount: number;
        //ToJob(职业)
        public ToJob: number;
        //ValidDate(有效分钟)
        public ValidDate: number;
        //IsSelect(是否可选)
        public IsSelect: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        public fitJob(job: number): boolean {
                if (this.ToJob == 0) return true;
                if (job == this.ToJob) return true;
                return false;
        }
}

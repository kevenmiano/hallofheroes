// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_uiplaylevel
*/
export default class t_s_uiplaylevel {
        public mDataList: t_s_uiplaylevelData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_uiplaylevelData(list[i]));
                }
        }
}

export class t_s_uiplaylevelData extends t_s_baseConfigData {

        /**UiLevelId(主键ID)*/
        public UiLevelId: number;
        /**UiLevelSort(关卡顺序)*/
        public UiLevelSort: number;
        /**UiPlayId(玩法Id)*/
        public UiPlayId: number;
        /**BossId(怪物)*/
        public BossId: string;
        /**Grade(所需等级)*/
        public Grade: number;
        /**ConsumeType(消耗类型)*/
        public ConsumeType: number;
        /**ConsumeNum(消耗数量)*/
        public ConsumeNum: number;
        /**IsContinuity(是否可扫荡)*/
        public IsContinuity: number;
        /**ContinuityGold(扫荡金币)*/
        public ContinuityGold: number;
        /**Image(背景图)*/
        public Image: string;
        /**FristReward(首通奖励)*/
        public FristReward: number;
        /**Reward(通关奖励)*/
        public Reward: number;
        /**Item(掉落预览)*/
        public Item: string;
        /**Description(关卡描述)*/
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }


        private DescriptionKey: string = "Description";
        public get DescriptionLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DescriptionKey);
        }
}

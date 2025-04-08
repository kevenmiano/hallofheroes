import LangManager from "../../core/lang/LangManager";
import { CommonConstant } from "../constant/CommonConstant";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_campaign
*/
export default class t_s_campaign {
        public mDataList: t_s_campaignData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_campaignData(list[i]));
                }
        }
}

export class t_s_campaignData extends t_s_baseConfigData {
        //CampaignId(ID)
        public CampaignId: number;
        //SonTypes(子类型)
        public SonTypes: number;
        //Types(副本类型, 0为普通副本, 其他需要根据需求单独定义)
        public Types: number;
        //StandardDamage(标准伤害)
        public StandardDamage: number;
        //StandardHurt(标准受到伤害)
        public StandardHurt: number;
        //CampaignName(副本名称)
        protected CampaignName: string;
        protected CampaignName_en: string = "";
        protected CampaignName_es: string = "";
        protected CampaignName_fr: string = "";
        protected CampaignName_pt: string = "";
        protected CampaignName_tr: string = "";
        protected CampaignName_zhcn: string = "";
        protected CampaignName_zhtw: string = "";
        //Description(副本描述,仅对世界boss\战场\黄昏之地有效)
        protected Description: string;
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Descriptio_zhtw: string = "";
        protected Description_zhcn: string = "";
        //MinLevel(进入最小等级)
        public MinLevel: number;
        //MaxLevel(进入最大等级)
        public MaxLevel: number;
        //PreCampaignId(前置副本)
        public PreCampaignId: number;
        //Capacity(人数)
        public Capacity: number;
        //DungeonId(单人战役和多人副本的分页)
        public DungeonId: number;
        //AreaId(单人战役和多人副本的页内分区)
        public AreaId: number;
        //DifficutlyGrade(难度, 1为普通, 2为英雄/噩梦, 3为地狱)
        public DifficutlyGrade: number;
        //BaseGp(通关基础经验)
        public BaseGp: number;
        //Item(掉落预览)
        public Item: number[];
        //StandSecond(通关标准时间)
        public StandSecond: number;
        //OpenTime(开放时间, 仅对世界boss和魔灵有效)
        public OpenTime: string;
        //StopTime(关闭时间, 仅对世界boss和魔灵有效)
        public StopTime: string;
        //PosX(单人副本在区域中的X坐标)
        public PosX: number;
        //PosY(单人副本在区域中的Y坐标)
        public PosY: number;
        //LandId(大陆ID, 仅单人副本有用)
        public LandId: number;
        //NextCampaignId(无用)
        public NextCampaignId: number;
        //MapIds(无用)
        public MapIds: number;
        //CardPayment(无用)
        public CardPayment: number;
        //是否需要转职
        public NeedTransfer: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private CampaignNameKey: string = "CampaignName";
        public get CampaignNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.CampaignNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.CampaignNameKey);
        }

        private DescriptionKey: string = "Description";
        public get DescriptionLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DescriptionKey);
        }

        /**
         *本地维护（0 开放, 1 不可接 ,  2 已过期） 
         */
        public state: number;
        public get stateValue(): string {
                if (this.state == 0) {
                        return LangManager.Instance.GetTranslation("yishi.datas.templates.stateValue01");
                }
                else if (this.state == 1) {
                        return LangManager.Instance.GetTranslation("yishi.datas.templates.stateValue02");
                }
                else if (this.state == 2) {
                        return LangManager.Instance.GetTranslation("yishi.datas.templates.stateValue03");
                }
                return "";
        }

        private _timeValue: number = 0;
        public get TimeValue(): number {
                if (this._timeValue != 0) return this._timeValue;
                var arr: any[] = this.OpenTime.split(":");
                var hour: number = parseInt(arr[0].toString());
                var munite: number = parseInt(arr[1].toString());
                var date: Date = new Date();
                date.setHours(hour, munite, 0, 0);
                return date.getTime();
        }

        public set TimeValue(value: number) {
                if (isNaN(value)) return;
                this._timeValue = value;
        }
        /**
         *是否是王者之塔 
         * @return 
         * 
         */
        public get isKingTower(): boolean {
                if (this.SonTypes == CommonConstant.KINGTOWER_SONTYPE) {
                        return true;
                }
                return false;
        }

        /**
         * 是否是试炼之塔 
         * @return 
         * 
         */
        public get isTrailTower(): boolean {
                if (this.SonTypes == CommonConstant.TRAILTOWER_SONTYPE) {
                        return true;
                }
                return false;
        }


        /**
         *是否是元素森林
         * @return 
        * 
         */
        public get isYuanShu(): boolean {
                if (this.CampaignId == 9013
                        || this.CampaignId == 9113
                        || this.CampaignId == 9213) {
                        return true;
                }
                return false;
        }

        /**
                 *是否是泰拉神庙(周副本、团队副本)
                 * 
                 */
        public get isTaila(): boolean {
                let b: boolean = false;
                if (this.AreaId == CommonConstant.TAILA_SHENMIAO) b = true;
                return b;
        }

}

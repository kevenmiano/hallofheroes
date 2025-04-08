import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_skillbuffertemplate
*/
export default class t_s_skillbuffertemplate {
        public mDataList: t_s_skillbuffertemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_skillbuffertemplateData(list[i]));
                }
        }
}

export class t_s_skillbuffertemplateData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //BufferName(名称)
        protected BufferName: string;
        protected BufferName_en: string = "";
        protected BufferName_es: string = "";
        protected BufferName_fr: string = "";
        protected BufferName_pt: string = "";
        protected BufferName_tr: string = "";
        protected BufferName_zhcn: string = "暴击率提高5%";
        protected BufferName_zhtw: string = "";
        //AttackType(伤害类型)
        public AttackType: number;
        //ResistSkill(抵抗技能)
        public ResistSkill: string;
        //CountWay(单个BUFF在一场战斗中的最大生效次数)
        public CountWay: number;
        //AttackValue(伤害值)
        public AttackValue: number;
        //ValuePercent(伤害百分比)
        public ValuePercent: number;
        //Icon(图标)
        public Icon: string;
        //Random(触发率)
        public Random: number;
        //TargetType(目标类型)
        public TargetType: number;
        //AppearTime(作用方向)
        public AppearTime: number;
        //TalentEffIds(天赋影响)
        public TalentEffIds: string;
        //BufferCd(冷却时间)
        public BufferCd: number;
        //LimitValue(上限)
        public LimitValue: number;
        //BufferEffCd(作用CD)
        public BufferEffCd: number;
        //AcceptObject(作用对象)
        public AcceptObject: number;
        //AttackObject(作用对象,同技能作用对象)
        public AttackObject: number;
        //AddWay(添加方式,1行动时, 2受伤时, 3造成伤害时, 4格挡时, 5暴击时, 6被暴击时,7行动后)
        public AddWay: number;
        //AttackWay(作用方式,1行动时, 2受伤时, 3造成伤害后, 4立即, 5治疗时, 6死亡后)
        public AttackWay: number;
        //AddEffect(添加特效)
        public AddEffect: string;
        //ActionEffect(作用特效)
        public ActionEffect: string;
        //LastEffect(持续特效,格式:特效连接,位置,特效播放间隔帧.位置1头2身体3脚)
        public LastEffect: string;
        //AttackData(增益/减益)
        public AttackData: number;
        //Dispel(0为可驱散, 1为不可驱散)
        public Dispel: number;
        //PressCount(最大可叠加)
        public PressCount: number;
        //ValidCount(单个BUFF触发后的持续回合数)
        public ValidCount: number;
        //覆盖类型, 用于Multiple判断
        public CoverType: number;
        // 允许共存, 0不允许, 1允许, 是否允许多个玩家给同一个目标添加效果, 详细规则: 
        // buff覆盖类型不同, 不覆盖
        // 若buff覆盖类型相同, 如果施加者相同, 则覆盖
        // 若buff覆盖类型相同, 且施加者不同, 如果能共存则不覆盖, 如果不能共存则覆盖
        // 覆盖定义: 重置buff的有效次数/持续回合, 如果buff可叠加, 则当前叠加层数+1
        public Multiple: number;

        private _addEffectArr: any[];
        private _actionEffectArr: any[];
        private _lastEffectArr: any[];


        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        /**
         * 取得添加时的效果的资源描述列表
         * arr[0]为资源链接名字
         * arr[1]为播放时间间隔
         * arr[2]为 特效位置1: 头上, 2: 身体, 3: 脚下
         * @return
         *
         */
        public getAddEffectArr(): any[] {
                if (!this._addEffectArr) {
                        this._addEffectArr = this.AddEffect.split(",");
                        if (this._addEffectArr.length < 1 || this._addEffectArr[0] == "" || this._addEffectArr[0] == "undefined") {
                                this._addEffectArr[0] = null;
                        }
                        if (this._addEffectArr.length < 2) {
                                this._addEffectArr[1] = 0;
                        }
                }

                return this._addEffectArr;
        }
        /**
         * 取得动作时的效果的资源描述列表
         * arr[0]为资源链接名字
         * arr[1]为播放时间间隔
         * arr[2]为 特效位置1: 头上, 2: 身体, 3: 脚下
         * @return
         *
         */
        public getActionEffectArr(): any[] {
                if (!this._actionEffectArr) {
                        this._actionEffectArr = this.ActionEffect.split(",");
                        if (this._actionEffectArr.length < 1 || this._actionEffectArr[0] == "" || this._actionEffectArr[0] == "undefined") {
                                this._actionEffectArr[0] = null;
                        }
                        if (this._actionEffectArr.length < 2) {
                                this._actionEffectArr[1] = 0;
                        }
                        if (this._actionEffectArr.length < 3) {
                                this._actionEffectArr[2] = 0;
                        }
                        this._actionEffectArr[1] = Number(this._actionEffectArr[1])
                        this._actionEffectArr[2] = Number(this._actionEffectArr[2])
                }
                return this._actionEffectArr;
        }
        /**
         * 取得持续效果资源描述列表
         * arr[0]为资源链接名字
         * arr[1]为 特效位置1: 头上, 2: 身体, 3: 脚下
         * arr[2]为播放时间间隔
         * @return
         *
         */
        public getLastEffectArr(): any[] {
                if (!this._lastEffectArr) {
                        this._lastEffectArr = this.LastEffect.split(",");
                        if (this._lastEffectArr.length < 1 || this._lastEffectArr[0] == "" || this._lastEffectArr[0] == "undefined") {
                                this._lastEffectArr[0] = null;
                        }
                        if (this._lastEffectArr.length < 2) {
                                this._lastEffectArr[1] = 0;
                        }
                        if (this._lastEffectArr.length < 3) {
                                this._lastEffectArr[2] = 0;
                        }
                        this._lastEffectArr[1] = Number(this._lastEffectArr[1])
                        this._lastEffectArr[2] = Number(this._lastEffectArr[2])
                }
                return this._lastEffectArr;
        }

        private BufferNameKey: string = "BufferName";
        public get BufferNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.BufferNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.BufferNameKey);
        }
}

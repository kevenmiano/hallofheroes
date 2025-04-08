// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_talenteffecttemplate
*/
export default class t_s_talenteffecttemplate {
        public mDataList: t_s_talenteffecttemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_talenteffecttemplateData(list[i]));
                }
        }
}

export class t_s_talenteffecttemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //EffSkillType(影响技能(-1所有))
        public EffSkillType: number;
        //EffSpPercent(怒气百分比)
        public EffSpPercent: number;
        //EffSpValue(怒气影响值)
        public EffSpValue: number;
        //EffDamPercent(伤害百分比)
        public EffDamPercent: number;
        //EffDamValue(伤害影响值)
        public EffDamValue: number;
        //EffCdPercent(CD百分比)
        public EffCdPercent: number;
        //EffCdValue(CD影响值)
        public EffCdValue: number;
        //EffCtPercent(施法百分比)
        public EffCtPercent: number;
        //EffCtValue(施法影响值)
        public EffCtValue: number;
        //EffCriValue(暴击影响值)
        public EffCriValue: number;
        //EffAttackObject(攻击对象)
        public EffAttackObject: number;
        //EffBuffer(影响携带BUFF(0加1替))
        public EffBuffer: number;
        //EffBufferIds(BUFF影响值)
        public EffBufferIds: number[];
        //EffBufferType(影响BUFF类型)
        public EffBufferType: number;
        //EffBuffPercent(影响BUFF类型百分比)
        public EffBuffPercent: number;
        //EffBuffValue(影响BUFF类型具体值)
        public EffBuffValue: number;
        //EffRandPercent(影响几率百分比)
        public EffRandPercent: number;
        //EffRandValue(影响几率值)
        public EffRandValue: number;
        //EffCountPercent(影响持续时间百分比)
        public EffCountPercent: number;
        //EffCountValue(影响持续时间值)
        public EffCountValue: number;
        //EffIsActive(类型(0产生1受到))
        public EffIsActive: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

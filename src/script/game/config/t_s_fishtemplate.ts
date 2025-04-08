// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_fishtemplate
*/
export default class t_s_fishtemplate {
        public mDataList: t_s_fishtemplateData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_fishtemplateData(list[i]));
                }
        }
}

export class t_s_fishtemplateData extends t_s_baseConfigData {
        //TemplateId(ID)
        public TemplateId: number;
        //Channels(所属通道)
        public Channels: number;
        //Speed(速度)
        public Speed: number;
        //Length(长度)
        public Length: number;
        //TemplateName(名字)
        public TemplateName: string;
        //IsBlock(是否障碍物)
        public IsBlock: number;
        //Path(资源路径)
        public Path: string;
        //RewardId(奖励物品)
        public RewardId: number;
        //RewardICount(奖励数量)
        public RewardCount: number;
        //RageId1(狂暴玩家奖励)
        public RageId1: number;
        //RewardICount1(狂暴玩家奖励数量)
        public RageCount1: number;
        //RageId3(狂暴奖励（协助者）)
        public RageId2: number;
        //RewardICount2(协助者奖励数量)
        public RageCount2: number;
        //Type(类型)
        public Type: number;
        //Level(需要等级)
        public Level: number;
        //Gp(奖励经验)
        public Gp: number;
        //Score(积分)
        public Score: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

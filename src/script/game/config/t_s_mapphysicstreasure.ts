// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_mapphysicstreasure {
    public mDataList: t_s_mapphysicstreasureData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_mapphysicstreasureData(list[i]));
        }
    }
}

export class t_s_mapphysicstreasureData extends t_s_baseConfigData {
    public Id: number;
    public Type: number;
    protected Name: string;
    protected Name_en: string = "";
    protected Name_es: string = "";
    protected Name_fr: string = "";
    protected Name_pt: string = "";
    protected Name_tr: string = "";
    protected Name_zhcn: string = "";
    protected Name_zhtw: string = "";
    //读取指定路径下的资源文件
    public Swf: string;
    //英雄 调用herotemplate的怪物ID
    public Heros: string;
    //兵力 调用pawntemplate的怪物ID
    public Soldiers: string;
    //坐标 调用 t_s_mapphysicstemplate 里面的Id
    public Coordinate: string;
    //一次性奖励  （进入和平期时一次性发放） 物品ID,数量|物品ID,数量
    public Reward: string;
    //公会奖励  此处填入加成的百分比（只对玩家外城金矿的奖励进行加成)
    public LeagueReward: number;

    constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

    private NameKey: string = "Name";
    public get NameLang(): string {
        let value = this.getKeyValue(this.getLangKey(this.NameKey));
        if (value) {
            return value;
        }
        return "";//return this.getKeyValue(this.NameKey);
    }

}
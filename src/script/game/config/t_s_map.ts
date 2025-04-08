// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_map
*/
export default class t_s_map {
        public mDataList: t_s_mapData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_mapData(list[i]));
                }
        }
}

export class t_s_mapData extends t_s_baseConfigData {
        //Id(地图id)
        public Id: number;
        //CampaignId(对应t_s_campaign中的CampaignId)
        public CampaignId: number;
        //MapName(地图名称, 会显示在副本内的右上角)
        protected MapName: string;
        protected MapName_en: string = "";
        protected MapName_es: string = "";
        protected MapName_fr: string = "";
        protected MapName_pt: string = "";
        protected MapName_tr: string = "";
        protected MapName_zhcn: string = "";
        protected MapName_zhtw: string = "";
        //Types(0为大地图, 1为副本, 5为天空之城)
        public Types: number;
        //Width(宽)
        public Width: number;
        //Height(高)
        public Height: number;
        //MapFileId(map文件的路径名, 可以多张地图对应同一个map文件)
        public MapFileId: number;
        //BattleGround(在该地图发生战斗时的战斗场景)
        public BattleGround: number;
        //MusicPath(副本背景音乐)
        public MusicPath: string;
        //Description(仅用于地下迷宫的掉落显示预览)
        public Description: string;
        //MinLevel(仅用于设定大地图生成矿点的最低等级)
        public MinLevel: number;
        //MaxLevel(仅用于设定大地图生成矿点的最高等级)
        public MaxLevel: number;
        //WildLandCount(仅用于设定大地图生成各类型矿点的数量)
        public WildLandCount: string;
        //AI(仅用于设定新手副本AI)
        public AI: string;
        //Index(仅用于表示紫晶矿场的层数)
        public Index: number;
        //Param1(仅用于设定英灵岛刷新时间分钟间隔)
        public Param1: number;
        //Param2(仅用于设定英灵岛可刷新数量上限)
        public Param2: number;
        //BornPoints(无用)
        public BornPoints: number;
        //SmallMapIcon(无用)
        public SmallMapIcon: number;
        //MessageBoxType（聊天气泡控制, 1天空之城, 2野外场景, 3副本地图, 4活动地图）
        public MessageBoxType: number;

        public state: number;
        public levelRect: string;//进入该区的等级范围

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private MapNameKey: string = "MapName";
        public get MapNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.MapNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.MapNameKey);
        }
}

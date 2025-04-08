// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_campaigndata
*/
export default class t_s_campaigndata {
        public mDataList: t_s_campaigndataData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_campaigndataData(list[i]));
                }
        }
}

export class t_s_campaigndataData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //CampaignId(战役ID)
        public CampaignId: number;
        //NodeName(节点名字)
        protected NodeName: string;
        protected NodeName_en: string = "";
        protected NodeName_es: string = "";
        protected NodeName_fr: string = "";
        protected NodeName_pt: string = "";
        protected NodeName_tr: string = "";
        protected NodeName_zhcn: string = "";
        protected NodeName_zhtw: string = "";
        //MasterType(主类型)
        public MasterType: number;
        //SonType(节点样式, 对应地图资源表build目录下的资源编号, 怪物则对应/swf/npc目录下的资源编号)
        public SonType: number;
        //Resource(资源类型, 1为图片, 2为动画)
        public Resource: number;
        //Heros(英雄)
        public Heros: string;
        //Soldiers(士兵)
        public Soldiers: string;
        //HeroGP(节点战斗胜利获得经验)
        public HeroGP: number;
        //AI(脚本)
        public AI: string;
        //Param1(P1)
        public Param1: number;
        //Param2(P2)
        public Param2: number;
        //Param3(P3)
        public Param3: string;
        //Param4(P4)
        public Param4: string;
        //Param5(P5)
        public Param5: string;
        //Param6(P6)
        public Param6: string;
        //FixX(像素X坐标)
        public FixX: number;
        //FixY(像素Y坐标)
        public FixY: number;
        //Property1(格子X坐标)
        public Property1: number;
        //Property2(格子Y坐标)
        public Property2: number;
        //Property3(回退点X坐标)
        public Property3: number;
        //Property4(回退点Y坐标)
        public Property4: number;
        //NextNodeIds(后继)
        public NextNodeIds: number;
        //PreNodeIds(前置节点)
        public PreNodeIds: number;
        //MoveToNodeIds(传送目标点)
        public MoveToNodeIds: number[];
        //PatrolPos(巡逻点)
        public PatrolPos: string;
        //AttackTypes(主动攻击)
        public AttackTypes: number;
        //NameColor(名称颜色)
        public NameColor: number;
        //Toward(朝向)
        public Toward: number;
        //BornPoints(出生点)
        public BornPoints: string;
        //Level(等级)
        public Level: number;
        //NodeState(节点状态)
        public NodeState: number;
        //HandlerRange(触发范围)
        public HandlerRange: number;
        //IsReport(重复触发, 0为不可以, 1为可以)
        public IsReport: number;
        //RefreshSpeed(恢复速度)
        public RefreshSpeed: number;
        //BattleType(战斗类型)
        public BattleType: number;
        //StyleType(样式)
        public StyleType: number;
        //Formation(阵型)
        public Formation: number;
        //SizeType(体型大小)
        public SizeType: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private NodeNameKey: string = "NodeName";
        public get NodeNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.NodeNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.NodeNameKey);
        }
}

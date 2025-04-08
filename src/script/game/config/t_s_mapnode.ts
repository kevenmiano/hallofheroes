// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_mapnode
*/
export default class t_s_mapnode {
        public mDataList: t_s_mapnodeData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_mapnodeData(list[i]));
                }
        }
}

export class t_s_mapnodeData extends t_s_baseConfigData {
        //Id(节点编号)
        public Id: number;
        //NodeName(节点名称)
        protected NodeName: string;
        protected NodeName_en: string = "";
        protected NodeName_es: string = "";
        protected NodeName_fr: string = "";
        protected NodeName_pt: string = "";
        protected NodeName_tr: string = "";
        protected NodeName_zhcn: string = "";
        protected NodeName_zhtw: string = "";
        //Dialogue(对白)
        protected Dialogue: string;
        protected Dialogue_en: string = "";
        protected Dialogue_es: string = "";
        protected Dialogue_fr: string = "";
        protected Dialogue_pt: string = "";
        protected Dialogue_tr: string = "";
        protected Dialogue_zhcn: string = "";
        protected Dialogue_zhtw: string = "";
        //BornPoints(出生点)
        public BornPoints: string;
        //MapId(对应地图ID)
        public MapId: number;
        //MasterType(主类型)
        public MasterType: number;
        //SonType(节点样式)
        public SonType: number;
        //PosX(X坐标)
        public PosX: number;
        //PosY(Y坐标)
        public PosY: number;
        //FixX(确切X坐标)
        public FixX: number;
        //FixY(确切Y坐标)
        public FixY: number;
        //MoveToMapId(传送到场景地图ID)
        public MoveToMapId: number;
        //MoveToNodeId(传送到的点)
        public MoveToNodeId: number;
        //Toward(站立时的朝向)
        public Toward: number;
        //Resource(资源类型, 1为图片, 2为动画)
        public Resource: number;
        //HandlerRange(触发范围)
        public HandlerRange: number;
        //Param1(AI相关数据)
        public Param1: number;
        //Param2(AI相关数据)
        public Param2: number;
        //Param3(AI相关数据)
        protected Param3: string;
        protected Param3_en: string = "";
        protected Param3_es: string = "";
        protected Param3_fr: string = "";
        protected Param3_pt: string = "";
        protected Param3_tr: string = "";
        protected Param3_zhcn: string = "";
        protected Param3_zhtw: string = "";
        //Param4(AI相关数据)
        public Param4: string;
        //Param5(AI相关数据)
        protected Param5: string;
        protected Param5_en: string = "";
        protected Param5_es: string = "";
        protected Param5_fr: string = "";
        protected Param5_pt: string = "";
        protected Param5_tr: string = "";
        protected Param5_zhcn: string = "";
        protected Param5_zhtw: string = "";
        //BackPosX(回退点X坐标)
        public BackPosX: number;
        //BackPosY(回退点Y坐标)
        public BackPosY: number;
        //PatrolPos(巡逻点)
        public PatrolPos: string;
        //NameColor(名字颜色)
        public NameColor: number;
        //SizeType(体型大小)
        public SizeType: number;
        //Sort(排序)
        public Sort: number;

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

        private DialogueKey: string = "Dialogue";
        public get DialogueLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DialogueKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DialogueKey);
        }

        private Param3Key: string = "Param3";
        public get Param3Lang(): string {
                let value = this.getKeyValue(this.getLangKey(this.Param3Key));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.Param3Key);
        }

        private Param5Key: string = "Param5";
        public get Param5Lang(): string {
                let value = this.getKeyValue(this.getLangKey(this.Param5Key));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.Param5Key);
        }
}

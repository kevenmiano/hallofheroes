// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_mapbossconfig
*/
export default class t_s_mapbossconfig {
        public mDataList: t_s_mapbossconfigData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_mapbossconfigData(list[i]));
                }
        }
}

export class t_s_mapbossconfigData extends t_s_baseConfigData {
        //TemplateId(地图野怪结点ID)
        public TemplateId: number;
        //MapId(地图ID)
        public MapId: number;
        //Type(怪物类型（1普通2精英3Boss）)
        public Type: number;
        //Count(怪物数量)
        public Count: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_compose
*/
export default class t_s_compose {
        public mDataList: t_s_composeData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_composeData(list[i]));
                }
        }
}

export class t_s_composeData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Types(合成分类, 1为装备, 2为道具, 3为宝石, 5为进阶, 6为抗性水晶, 8为神格之魂, 9为英灵装备, 10为英灵装备进阶, 11为守卫装备进阶, 12为玛瑙, 102为魔法工坊合成宝箱, 103为魔法工坊合成奶茶)
        public Types: number;
        //NeedMinLevel(需要等级)
        public NeedMinLevel: number;
        //Material1(材料1)
        public Material1: number;
        //Count1(数量1)
        public Count1: number;
        //Material2(材料2)
        public Material2: number;
        //Count2(数量2)
        public Count2: number;
        //Material3(材料3)
        public Material3: number;
        //Count3(数量3)
        public Count3: number;
        //Material4(材料4)
        public Material4: number;
        //Count4(数量4)
        public Count4: number;
        //NewMaterial(成品)
        public NewMaterial: number;
        //Counts(成品数量)
        public Counts: number;
        //NeedGold(需要黄金)
        public NeedGold: number;
        //NeedBuildingTemp(需要建筑)
        public NeedBuildingTemp: number;
        //IsLog(提示)
        public IsLog: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:29:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-01 17:15:58
 * @Description: 
 */
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_consortiatask
*/
export default class t_s_consortiatask {
        public mDataList: t_s_consortiataskData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_consortiataskData(list[i]));
                }
        }
}

export class t_s_consortiataskData extends t_s_baseConfigData {
        // 任务编号
        public Id: number = 0;
        // 任务类型，1获得物品、2消耗物品、3上缴物品
        public Type: number = 0;
        // 所需物品ID
        public NeedItemId: number = 0;

        // 所需玩家等级
        public NeedGrade: number = 0;
        // 所需公会任务建筑等级
        public NeedTaskLevel: number = 0;
        // 权重
        public Weight: number = 0;
        // 1星对应数量
        public CountStar1: number = 0;
        // 2星对应数量
        public CountStar2: number = 0;
        // 3星对应数量
        public CountStar3: number = 0;
        // 4星对应数量
        public CountStar4: number = 0;
        // 5星对应数量
        public CountStar5: number = 0;
  
        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }
}

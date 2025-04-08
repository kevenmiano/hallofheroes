import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_firstpay
*/
export default class t_s_firstpay {
        public mDataList: t_s_firstpayData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_firstpayData(list[i]));
                }
        }
}

export class t_s_firstpayData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //Time(奖励天数)
        public Time: number;
        //AvatarPath(展示资源路径)
        public AvatarPath: string;
        //Avatartype(展示资源类型, 1为动画 2为图片)
        public Avatartype: number;
        //ImagePath(图片资源路径)
        public ImagePath: string;
        //Jobs(职业（1战,2射,3法）)
        public Jobs: number;
        //Gender(0为女,1为男)
        public Gender: number;
        //Item(道具1ID,道具1数量|道具2ID,道具2数量|······    例:208022,10为10个黄金魔杖)
        public Item: string;
        //Offset(模型偏移点(x,y))
        public Offset: string;
        //Scale(缩放大小)
        public Scale: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}

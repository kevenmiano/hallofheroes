// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_chatbubble
*/
export default class t_s_chatbubble {
    public mDataList: t_s_chatbubbleData[];

    public constructor(list: Object[]) {
        this.mDataList = [];
        for (let i in list) {
            this.mDataList.push(new t_s_chatbubbleData(list[i]));
        }
    }
}

export class t_s_chatbubbleData extends t_s_baseConfigData {
    public Id: number = 0;
    public GetType: number = 0;
    public ChatBubbleTitle: string = "";
    public ChatBubbleDes: string = "";
    public Para1: number = 0;
    public Para2: number = 0;
    public Para3: number = 0;
    public Resources: string = "";

    constructor(data?: Object) {
        super();
        if (data) {
            for (let i in data) {
                this[i] = data[i];
            }
        }
    }

}

import Logger from "../logger/Logger";
import { DateFormatter } from "./DateFormatter";

/**
 * 
 */
export class ServiceReplyInfo {
    public  questionId:string;
    public  type:number;
    public  userId:string;
    
    public  Site:string;
    public  title:string;
    public  content:string;
    public  replayUserName:string;
    public  replayContent:string;
    public  stopReply:string;
    public  employ:string;
    public  date:Date;

    public set commitTime(value:string)
    {
        this.date = DateFormatter.parse(value,"YYYY-MM-DD");
        Logger.log("年: "+this.date.getFullYear()+"月: "+this.date.getMonth()+"日: "+this.date.getDate());
        
    }

    public copy(info: Object) {
        for (let key in info) {
            if (Object.prototype.hasOwnProperty.call(info, key)) {
                let value = info[key];
                if (typeof this[key] == 'number') {
                    this[key] = Number(value);
                } else if (typeof this[key] == 'string') {
                    this[key] = value.toString();
                } else if (typeof this[key] == 'boolean') {
                    this[key] = value == 'true' ? true : false;
                } else {//结构体
                    this[key] = value.toString();
                }
            }
        }
    }

}
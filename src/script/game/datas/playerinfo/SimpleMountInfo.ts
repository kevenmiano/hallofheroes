/**
 * 坐骑信息
 */
import MountInfoMsg = com.road.yishi.proto.campaign.MountInfoMsg;

export class SimpleMountInfo {
    public power: number;
    public intellect: number;
    public physique: number;
    public agility: number;
    public powerGp: number;//兽魂值
    public mountTempId: number;


    constructor() {
    }

    public static createFromMountInfoMsg(msg: MountInfoMsg): SimpleMountInfo {
        var info: SimpleMountInfo = new SimpleMountInfo();
        info.power = msg.power;
        info.intellect = msg.intellect;
        info.physique = msg.physique;
        info.agility = msg.agility;
        info.powerGp = msg.powerGp;
        info.mountTempId = msg.mountTempId;
        return info;
    }

    public static createFromXml(xml): SimpleMountInfo {
        var info: SimpleMountInfo = new SimpleMountInfo();
        info.power = xml.PowerGrade;
        info.intellect = xml.IntellectGrade;
        info.physique = xml.PhysiqueGrade;
        info.agility = xml.AgilityGrade;
        info.powerGp = xml.SoulScore;
        info.mountTempId = xml.MountTempId;
        return info;
    }
}
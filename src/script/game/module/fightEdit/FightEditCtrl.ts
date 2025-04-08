import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { SkillEvent } from "../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import FrameCtrlBase from "../../mvc/FrameCtrlBase"
import { SkillEditData } from "./SkillEditData";
import { SkillEditModel } from "./SkillEditModel";
import SkillEditReqMsg = com.road.yishi.proto.skilledit.SkillEditReqMsg;
import SkillEditResMsg = com.road.yishi.proto.skilledit.SkillEditResMsg;

/**
 * 战斗技能编辑控制器
 * Ctrl类中持有对UI类、数据类的引用（view、data）, 在Ctrl中进行逻辑数据处理后, 再传递处理后的数据直接刷新界面
 */
export default class FightEditCtrl extends FrameCtrlBase {


    show() {
        super.show()

    }
    protected addEventListener() {
        ServerDataManager.listen(S2CProtocol.U_C_SKILL_EDIT_INFO, this, this.onRecvSkillEditInfo);
    }

    /**
     * 
     * @param pkg  repeated SkillMsg  skillInfo = 1; //技能编辑信息
                    bool  isOpen = 2; //是否开启自动战斗 false 未开启 true 已开启,默认false
     */
    onRecvSkillEditInfo(pkg: PackageIn){
        let msg: SkillEditResMsg = pkg.readBody(SkillEditResMsg) as SkillEditResMsg;
        if(msg){
            let model = SkillEditModel.instance;
            model.skillEditDatas.length = 0;
            model.isOpen = msg.isOpen;
            let itemData:SkillEditData;
            for (let i = 0; i < msg.skillInfo.length; i++) {
                const element = msg.skillInfo[i];
                itemData = new SkillEditData();
                itemData.defaultSkill = element.defaultSkill;
                itemData.job = element.job;
                itemData.normalSkill = element.normalSkill;
                itemData.specialSkill = element.specialSkill;
                itemData.percent = element.percent;
                itemData.petId = element.petId;
                model.updateData(itemData);
            }
            model.dispatchEvent(SkillEvent.SKILL_EDIT);
        }
    }

    /**
     * 请求战斗编辑信息
     * @param op  1 保存  2 重置(重置时只传 op job) 3 获取编辑页面 4 是否开启自动化
     * @param job 要编辑的职业种类
     * @param percent 血量比例设置
     * @param normalSkill 常规技能 type:skillType,type2:skillType2, type 1 技能 2 符文 3 天赋,skillType 为技能子类型 1技能 (107,207,....) 2符文 (1,2,3..) 3天赋 (1001 2001 3001)
     * @param specialSkill /特殊技能 type:skillType,type2:skillType2, type 1 技能 2 符文 3 天赋, 为1技能时 skillId 为技能子类型
     * @param petId 英灵Id
     * @param isOpen 是否开启自动战斗编辑
     */
    public reqSkillEditInfo(op:number,job:number,percent:number,normalSkill:string,specialSkill:string,petId:number,isOpen:boolean):void
    {
        let msg:SkillEditReqMsg = new SkillEditReqMsg();
        msg.op = op;
        msg.job = job;
        msg.percent = percent;
        msg.normalSkill = normalSkill;
        msg.specialSkill = specialSkill;
        msg.petId = petId;
        msg.isOpen = isOpen;
        SocketManager.Instance.send(C2SProtocol.C_SKILL_EDIT,msg); 
    }

    public reqSkillPageInfo(){
        let msg:SkillEditReqMsg = new SkillEditReqMsg();
        msg.op = 3;
        SocketManager.Instance.send(C2SProtocol.C_SKILL_EDIT,msg); 
    }

    public reqSkillEditOpen(isopen:boolean){
        let msg:SkillEditReqMsg = new SkillEditReqMsg();
        msg.op = 4;
        msg.isOpen = isopen;
        SocketManager.Instance.send(C2SProtocol.C_SKILL_EDIT,msg); 
    }

    hide() {
        super.hide()
    }

    dispose() {
        super.dispose()
    }



}
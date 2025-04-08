import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { SocketManager } from "../../../core/net/SocketManager";
import { t_s_runegemData } from "../../config/t_s_runegem";
import { C2SProtocol } from '../../constant/protocol/C2SProtocol';
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { SkillInfo } from "../../datas/SkillInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { TempleteManager } from "../../manager/TempleteManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";

import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import HeroSkillChangeMsg = com.road.yishi.proto.army.HeroSkillChangeMsg;
import RuneMosReqMsg = com.road.yishi.proto.army.RuneMosReqMsg;
import RuneResolveReqMsg = com.road.yishi.proto.army.RuneResolveReqMsg;
import RuneStoneUpReqMsg = com.road.yishi.proto.army.RuneStoneUpReqMsg;
import RuneUnloadReqMsg = com.road.yishi.proto.army.RuneUnloadReqMsg;
import LotteryRuneReqMsg = com.road.yishi.proto.army.LotteryRuneReqMsg;
import HeroTalentReq = com.road.yishi.proto.army.HeroTalentReq;
import RuneHoleOpMsg = com.road.yishi.proto.army.RuneHoleOpMsg;
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_runeactivationData } from "../../config/t_s_runeactivation";
import SkillWndData from "./SkillWndData";
import OpenGrades from "../../constant/OpenGrades";

/**
* @author:pzlricky
* @data: 2021-02-20 18:12
* @description 技能控制类
*/
export default class SkillWndCtrl extends FrameCtrlBase {


    // override
    protected addEventListener() {
        super.addEventListener();
        Logger.log("[SkillWndCtrl]addEventListener");
    }

    // override
    protected delEventListener() {
        Logger.log("[SkillWndCtrl]delEventListener");
        super.delEventListener();
    }

    /**
     * 发送属性洗点请求
     */
    public sendWashPoint() {
        this.data.addAbility = 0;
        this.data.addAgility = 0;
        this.data.addCaptain = 0;
        this.data.addPhysique = 0;
        this.data.addStrength = 0;
        ArmySocketOutManager.sendWashPoint();
    }

    /**
     * 学习符文 
     */
    public sendStudyRune(runeId: number, runeItemPos: number) {
        ArmySocketOutManager.sendStudyRune(runeId, runeItemPos);
    }


    /**
     * 升级符文 
     */
    public sendUpgradeRune(runeId: number, runeCount: number) {
        ArmySocketOutManager.sendUpgradeRune(runeId, runeCount);
    }


    /**
     * 携带符文 
     */
    public sendTakeRune(fastKey: string) {
        ArmySocketOutManager.sendTakeRune(fastKey);
    }

    /**
     * 符孔操作
     * @param runeId 符文模版 ID
     * @param opType 4:符孔激活 5:符孔雕刻 6:替换符孔
     */
    public reqRuneHoleOpt(runeId: number, opType: number) {
        ArmySocketOutManager.reqRuneHoleOpt(runeId, opType);
    }

    /**
     * 
     *  技能加点 
     * @param tempId
     * 
     */
    public sendAddSkillPoint(info: SkillInfo,type:number=0,subType:number=0) {
        if (info.nextTemplateInfo)
            ArmySocketOutManager.sendAddSkillpoint(info.nextTemplateInfo.TemplateId,type,true,subType);
    }
    /**
     * 技能洗点 
     * 
     */
    public sendWashSkillPoint(payType: number, useBind: boolean) {
        ArmySocketOutManager.sendWashSkillPoint(payType, 0, useBind);
    }

    /**
     * 设置技能快捷键 
     * @param heroid
     * @param fastKey
     * @param showTip
     */
    public sendSetFastKey(fastKey: string) {//设置快捷键 
        ArmySocketOutManager.sendSetFastKey(fastKey);
    }

    /**
     * 激活第二技能
     * @param b 
     * @param flag 
     * @param payPoint 
     */
    public sendActiveDoubleSkill(b: boolean, flag: boolean, payPoint: string) {
        var msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = 0;
        if (!flag) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_ACTIVE_SECONDSKILL, msg);
    }


    /**切换技能 */
    public switchSkillIndex() {
        var index: number = 0;
        if (ArmyManager.Instance.thane.skillCate.skillIndex == 1)
            index = 0
        else
            index = 1;
        let msg: HeroSkillChangeMsg = new HeroSkillChangeMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_CHANGE_SKILL, msg);
    }

    /**
     *  符文石装备或替换
     * @param runeId //符孔id
     * @param runeIndex //符孔洞索引 0,1,2...
     * @param runeStoneId //要镶嵌的符文石
     * @param beginPos //符文石在背包中的位置信息
     * @param targetRuneHoleId //替换目标符孔id
     * @param targetIndex //目标孔洞 索引 1,2,3
     */
    public reqRuneGemEquip(runeId: number, runeIndex: number, runeStoneId: number, beginPos: number, targetRuneHoleId = 0, targetIndex = 0) {

        // let targetRuneHoleId = 0;
        // let targetIndex = 0
        let msg: RuneMosReqMsg = new RuneMosReqMsg();
        msg.runeId = runeId;
        msg.runeIndex = runeIndex;
        msg.runeStoneId = runeStoneId;
        msg.beginPos = beginPos;
        msg.targetRuneHoleId = targetRuneHoleId;
        msg.targetIndex = targetIndex;
        SocketManager.Instance.send(C2SProtocol.C_EQUIP_RUNE_STOME, msg);
    }

    /**
     * 符文石分解
     * @param pos //符文石在符文石背包中的位置 pos1,pos2,pos3
     */
    public reqRuneGemResolve(pos: string) {
        let msg: RuneResolveReqMsg = new RuneResolveReqMsg();
        msg.pos = pos;
        SocketManager.Instance.send(C2SProtocol.C_RUNE_RESOLVE, msg);
    }

    /**
     * 符文石升级
     * @param pos 符文石在符文石背包中的位置 pos1,pos2,pos3
     * @param id 符文石的在背包中的id
     * @param runeNum 使用的符文石碎片数量
     * @param bagType  //背包类型 25 符文背包 26 符文装备背包
     * @param runeId  /
     */
    public reqRuneGemUpgrade(pos: number, id: number, runeNum: number, bagType: number, runeId: number) {
        let msg: RuneStoneUpReqMsg = new RuneStoneUpReqMsg();
        msg.pos = pos;
        msg.id = id;
        msg.runeNum = runeNum;
        msg.bagType = bagType;
        msg.runeId = runeId;
        SocketManager.Instance.send(C2SProtocol.C_RUNE_UP, msg);
    }

    /**
     * 符文石卸载到符文背包
     * @param runeId 符文id
     * @param index 符石索引 0,1,2,3...  
     */
    public reqRuneGemUnload(runeId: number, index: number) {
        let msg: RuneUnloadReqMsg = new RuneUnloadReqMsg();
        msg.runeId = runeId;
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_RUNE_UNLOAD, msg);
    }

    /**
     * 背包格子购买  符文背包格子购买的时候加个参数type==1
     * remark 带勾选的确认提示框的回调函数 
     * @param result   点击了确定还是取消按钮
     * @param flag  是否勾选了checkbox, 这里指是否使用绑钻
     * @param data  回调参数
     * @private
     */
    public reqBuyRuneGemBagGrid(result: boolean, flag: boolean, data: any) {
        if (result) {
            let msg: PayTypeMsg = new PayTypeMsg();
            msg.type = 1;
            msg.payType = 0;
            if (!flag) {
                msg.payType = 1;
            }
            msg.property1 = data.line;
            SocketManager.Instance.send(C2SProtocol.U_C_BAG_BUY, msg);
        }
    }

    /**
     * 符石抽奖
     * @param op 1 符石抽奖主页  2 符石抽奖 3 符石10连抽
     */
    public reqRuneGemLottery(op: number) {
        let msg: LotteryRuneReqMsg = new LotteryRuneReqMsg();
        msg.op = op;
        SocketManager.Instance.send(C2SProtocol.C_LOTTERY_RUNE, msg);
    }

    /**
     * 调整圣印顺序
     * @param 
     */
    public reqTelentSort(seal1, seal2, seal3) {
        let msg: HeroTalentReq = new HeroTalentReq();
        msg.seal1 = seal1;
        msg.seal2 = seal2;
        msg.seal3 = seal3;
        SocketManager.Instance.send(C2SProtocol.C_TELENT_SORT, msg);
    }
    //符孔信息
    public reqRuneHoldInfo() {
        if (ArmyManager.Instance.thane.grades < OpenGrades.VEHICEL) return;
        SocketManager.Instance.send(C2SProtocol.C_RUNE_HOLE_INFO);
    }

    /**
     * 选择天赋技能树
     * @param 
     */
    public reqTelentTree(sealId: number) {
        //判断天赋是否开启
        if (ArmyManager.Instance.thane.grades < OpenGrades.TALENT) return;
        let msg: HeroTalentReq = new HeroTalentReq();
        msg.seal1 = sealId;
        SocketManager.Instance.send(C2SProtocol.C_TELENT_TREE, msg);
    }
    //解锁第二个天赋
    public reqUnlockSeconeTelent(payType: number) {
        let msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.C_ACTIVE_SECONDTALENT, msg);
    }
    //切换天赋
    public reqSwitchTalent(index: number) {
        let msg: HeroSkillChangeMsg = new HeroSkillChangeMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_HERO_TALENT_CHANGE, msg);
    }

    // int32 holeId = 1; //符孔id
    // int32 op = 2; // 操作类型 1 雕刻效果(洗炼) 2 雕刻属性(升级) 3 解锁符孔位
    // int32 opPos = 3; //操作位置(对应位置12345)
    // int32 beginPos = 4; //符石在背包中的位置
    public reqRuneHoldOpton(holeId: number, op: number, opPos = 0) {
        let msg = new RuneHoleOpMsg();
        msg.holeId = holeId;
        msg.op = op;
        msg.opPos = opPos;
        SocketManager.Instance.send(C2SProtocol.C_RUNE_HOLE_OP, msg);
    }

    public addPropertyTxt(value: GoodsInfo): string {
        if (value.strengthenGrade == 0) {
            return this.addPropertyTxt1(value);
        }
        let info: t_s_runegemData = TempleteManager.Instance.getRuneGemCfgByTypeAndLevel(value.templateInfo.SonType, value.strengthenGrade, value.templateInfo.Property1)
        if (!info) return ""
        let propertys = "";
        propertys = this.formatPropertyEnter(this.parseProperty(info));
        return propertys;
    }

    protected addPropertyTxt1(info: GoodsInfo): string {
        return this.formatPropertyEnter(this.parseProperty(info.templateInfo));
    }

    public parsePropertyByGoodsInfo(value: GoodsInfo) {
        if (value.strengthenGrade == 0) {
            return this.parseProperty(value.templateInfo);
        }
        let info: t_s_runegemData = TempleteManager.Instance.getRuneGemCfgByTypeAndLevel(value.templateInfo.SonType, value.strengthenGrade, value.templateInfo.Property1);
        return this.parseProperty(info);
    }

    //属性解析
    public parseProperty(templateInfo: t_s_itemtemplateData | t_s_runegemData | t_s_runeactivationData) {
        let propertyObject: { [key: string]: number } = {}
        if (!templateInfo) return propertyObject;
        if (templateInfo instanceof t_s_itemtemplateData || templateInfo instanceof t_s_runegemData) {
            if (templateInfo.Power)
                propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01")] = templateInfo.Power;
            if (templateInfo.Agility)
                propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02")] = templateInfo.Agility;
            if (templateInfo.Intellect)
                propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03")] = templateInfo.Intellect;
            if (templateInfo.Physique)
                propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04")] = templateInfo.Physique;
            if (templateInfo.Captain)
                propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05")] = templateInfo.Captain;
        }

        if (templateInfo.Attack)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13")] = templateInfo.Attack;
        if (templateInfo.Defence)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14")] = templateInfo.Defence;
        if (templateInfo.MagicAttack)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15")] = templateInfo.MagicAttack;
        if (templateInfo.MagicDefence)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16")] = templateInfo.MagicDefence;
        if (templateInfo.ForceHit)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10")] = templateInfo.ForceHit;
        if (templateInfo.Live)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11")] = templateInfo.Live;
        if (templateInfo.Parry)
            propertyObject[LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19")] = templateInfo.Parry;
        return propertyObject;
    }
    //合并相同属性值
    public concatSameProperty(list: { [key: string]: number }[]) {
        let result: { [key: string]: number } = {}

        for (let item of list) {
            for (let p in item) {
                if (result[p]) {
                    result[p] += item[p];
                } else {
                    result[p] = item[p];
                }
            }
        }
        return result;
    }
    //换行
    private formatPropertyEnter(propertyObject: { [key: string]: number }) {
        let result = "";
        for (let perty in propertyObject) {
            if (result) {
                result += "\n"
            }
            result += perty + "+" + propertyObject[perty]
        }
        return result;
    }
    //filterType 1 符石背包过滤, 2符孔符石背包 过滤
    public filterRuneAttribute(goods: GoodsInfo, filterType = 1, isResolve = false) {
        let skillWndData = this.data as SkillWndData;
        let attributes = this.parsePropertyByGoodsInfo(goods);
        let attributesName = skillWndData.runeAttributeName;
        let fileter;
        if (isResolve) {
            fileter = skillWndData.runeAttributeFilter2;
        } else {
            fileter = filterType == 1 ? skillWndData.runeAttributeFilter : skillWndData.runeHoldAttributeFilter;
        }

        for (let i = 0; i < 7; i++) {
            if (fileter[i] && attributes[attributesName[i]]) {
                return true;
            }
        }
        return false;
    }

    //是否需要过滤。所有值相同的情况下, 不需要过滤。
    public isRuneFilter(filterType = 1, isResolve: boolean = false) {
        let skillWndData = this.data as SkillWndData;
        let fileter;
        if (isResolve) {
            fileter = skillWndData.runeAttributeFilter2;
        } else {
            fileter = filterType == 1 ? skillWndData.runeAttributeFilter : skillWndData.runeHoldAttributeFilter;
        }
        let same = fileter[0];
        for (let i = 1; i < 7; i++) {
            if (same != fileter[i]) {
                return true;
            }
        }

        return false;
    }

    //是否需要过滤。所有值相同的情况下, 不需要过滤。
    public isProfileFilter(filterType = 1, isResolve: boolean = false) {
        let skillWndData = this.data as SkillWndData;
        let fileter;
        if (isResolve) {
            fileter = skillWndData.runeProfileFilter2;
        } else {
            fileter = filterType == 1 ? skillWndData.runeProfileFilter : skillWndData.runeHoldProfileFilter;
        }

        let same = fileter[0];
        for (let i = 1; i < 5; i++) {
            if (same != fileter[i]) {
                return true;
            }
        }

        return false;
    }

    //获得所有符孔属性
    public getAllRuneHoldPropery() {
        let skillWndData = this.data as SkillWndData;
        let runeHoles = skillWndData.runeHoles;
        let allPropertys: { [key: string]: number }[] = [];
        for (let hole of runeHoles) {
            let property = hole.getHoldProperty();
            let bonus = hole.getBonusValue();
            for (let p in property) {
                property[p] = (bonus + 1) * property[p] >> 0
            }
            allPropertys.push(property);
        }
        //合并相同属性
        let theSameProperty = this.concatSameProperty(allPropertys);
        return theSameProperty;
    }

}
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import LangManager from "../../../../core/lang/LangManager";
import { GvgWarBufferInfo } from "./gvg/GvgWarBufferInfo";
import { WoundInfo } from "../../../mvc/model/worldboss/WoundInfo";
import { ConfigManager } from "../../../manager/ConfigManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { MopupManager } from "../../../manager/MopupManager";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import AltarCampaignSkillMsg = com.road.yishi.proto.campaign.AltarCampaignSkillMsg;
/**
 * 公会祭坛数据
 * @author yuanzhan.yu
 */
export class ConsortiaDemonInfo extends GameEventDispatcher {
    public static DURA_CHANGE: string = "DURA_CHANGE";
    public static WAVE_CHANGE: string = "WAVE_CHANGE";

    /**
     *祭坛开放需要公会等级
     */
    public static NEED_CONSORTIA_LEVEL: number = 5;
    /**
     *祭坛耐久度上限
     */
    public static MAX_ALTAR_DURA: number = 100;
    /**
     *普通怪
     */
    public static NORMAL: number = 0;
    /**
     *精英怪
     */
    public static SPECIAL: number = 1;

    /**
     *参与玩家数量
     */
    public playerNum: number = 0;
    /**
     *自己造成的伤害
     */
    public selfWound: number = 0;
    /**
     *怪物数量
     */
    public monsterNum: number = 0;
    /**
     *场内当前buff类型（0:无, 1:buff1, 2:buff2, 3:buff3）
     */
    public curBuffType: number = 0;
    /**
     *已领取buff类型（0:无, 1:buff1, 2:buff2, 3:buff3）
     */
    public gotBuffType: number = 0;
    /**
     *活动状态（0 可开启, 1 开启中, 2 已结束, -1 异常）
     */
    public state: number = 0;
    /**
     *魔神祭坛开启时间
     */
    public openDate: Date;
    /**
     *魔神祭坛准备阶段倒计时（秒）
     */
    public readyDownTime: number = 0;
    /**
     *参与列表
     */
    public participantList: SimpleDictionary;
    /**
     *技能列表
     */
    public skillList: SimpleDictionary;

    private _durability: number = 0;  //祭坛耐久度
    private _waveNum: number = 0;  //怪物波数
    private _woundList: SimpleDictionary;
    private _changeObj: SimpleDictionary;

    constructor() {
        super();

        this._woundList = new SimpleDictionary();
        this.participantList = new SimpleDictionary();
        this.skillList = new SimpleDictionary();
        this._changeObj = new SimpleDictionary();

        var configTemp: ConfigInfosTempInfo;
        for (var i: number = 1; i <= 2; i++) {
            var skillInfo: GvgWarBufferInfo = new GvgWarBufferInfo();
            skillInfo.templateId = i;
            if (i == 1) {
                configTemp = TempleteManager.Instance.getConfigInfoByConfigName("ConsortiaAltarSceneNeedOffe_Live");
            }
            else {
                configTemp = TempleteManager.Instance.getConfigInfoByConfigName("ConsortiaAltarSceneNeedOffe_Fix");
            }
            skillInfo.needPay = configTemp ? parseInt(configTemp.ConfigValue) : 1000;
            skillInfo.bufferNameLang = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillName0" + i);
            skillInfo.DescriptionLang = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillDesc0" + i, skillInfo.needPay);
            skillInfo.curreCount = -1;
            skillInfo.maxCdTimer = 300;//五分钟
            this.skillList.add(i, skillInfo);
        }
    }

    /**
     * 祭坛耐久度
     */
    public get durability(): number {
        return this._durability;
    }

    public set durability(value: number) {
        if (this._durability == value) {
            return;
        }
        this._durability = value;
        this._changeObj[ConsortiaDemonInfo.DURA_CHANGE] = true;
    }

    /**
     * 怪物波数
     */
    public get waveNum(): number {
        return this._waveNum;
    }

    public set waveNum(value: number) {
        if (this._waveNum == value) {
            return;
        }
        this._waveNum = value;
        this._changeObj[ConsortiaDemonInfo.WAVE_CHANGE] = true;
    }

    public set woundList(value: SimpleDictionary) {
        this._woundList = value;
    }

    /**
     * 得到玩家伤害信息
     */
    public getWoundInfo(userId: number): WoundInfo {
        return this._woundList[userId];
    }

    /**
     * 得到玩家伤害列表
     */
    public getWoundList(): any[] {
        return this._woundList.getList();
    }

    /**
     * 是否开启中
     */
    public get isOpen(): boolean {
        return this.state == 1;
    }

    /**
     * 是否能开启（0为可开启）
     */
    public get isCanOpen(): number {
        if (ConsortiaManager.Instance.model.consortiaInfo.levels < ConsortiaDemonInfo.NEED_CONSORTIA_LEVEL) {
            return 2;
        }
        if (this.state != 0) {
            return 10;
        }
        return 0;
    }

    /**
     * 是否能参与
     */
    public get isCanJoin(): number {
        if (ConsortiaManager.Instance.model.consortiaInfo.levels < ConsortiaDemonInfo.NEED_CONSORTIA_LEVEL) {
            return 2;
        }
        if (this.playerInfo.demonConsortiaId != 0 && this.playerInfo.demonConsortiaId != this.playerInfo.consortiaID) {
            return 101;
        }
        if (this.state == 2) {
            return 104;
        }
        if (!this.isOpen) {
            return 100;
        }
        if (MopupManager.Instance.model.isMopup) {
            return 102;
        }
        if (WorldBossHelper.getCampaignTips() != "") {
            return 103;
        }
        return 0;
    }

    /**
     * 魔神祭坛倒计时间（秒）
     */
    public get downTime(): number {
        if (!this.openDate) {
            return 0;
        }
        var time: number = 1260 - Math.floor(this.playerModel.sysCurTimeBySecond - this.openDate.getTime() / 1000);
        return time < 0 ? 0 : time;
    }

    /**
     * 能否领取buff
     */
    public get canGetBuff(): boolean {
        return (this.curBuffType > 0 && this.curBuffType > this.gotBuffType);
    }

    /**
     * 更新技能信息
     */
    public updateSkillInfo(msg: AltarCampaignSkillMsg, commit: boolean) {
        if (!msg) {
            return;
        }
        var skillInfo: GvgWarBufferInfo = this.skillList[msg.templateId];
        if (skillInfo) {
            //				skillInfo.maxCdTimer = msg.cDTimer;
            skillInfo.startTime = msg.CDTimer;

            if (commit) {
                this.dispatchEvent(ConsortiaEvent.DEMON_SKILL_USED, skillInfo);
            }
        }
    }

    /**
     * 清除魔神祭坛信息
     */
    public clear() {
        this.playerNum = 0;
        this.selfWound = 0;
        this.monsterNum = 0;
        this.curBuffType = 0;
        this.gotBuffType = 0;
        this.state = 0;
        this.readyDownTime = 0;
        this.openDate = null;
        this._durability = 0;
        this._waveNum = 0;
        this._woundList.clear();
        this.participantList.clear();
    }

    public beginChanges() {
        this._changeObj.clear();
    }

    public commitChanges() {
        if (this._changeObj[ConsortiaDemonInfo.DURA_CHANGE]) {
            this.dispatchEvent(ConsortiaEvent.DEMON_DURA_CHANGE);
        }
        if (this._changeObj[ConsortiaDemonInfo.WAVE_CHANGE]) {
            this.dispatchEvent(ConsortiaEvent.DEMON_WAVE_CHANGE);
        }
        this.dispatchEvent(ConsortiaEvent.DEMON_INFO_UPDATE);
    }

    /**
     * 得到限制提示
     */
    public getLimitTip(type: number): string {
        switch (type) {
            case 1:
                return LangManager.Instance.GetTranslation("buildings.casern.view.PawnLevelUpFrame.command04");
            case 2:
                return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.consortiaLevelTip", ConsortiaDemonInfo.NEED_CONSORTIA_LEVEL);
            case 10:
                return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.openedTip");
            case 100:
                return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.unopenTip");
            case 101:
                return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.joinedTip");
            case 102:
                return LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            case 103:
                return WorldBossHelper.getCampaignTips();
            case 104:
                if (this.state == 0) {
                    return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.unopenTip");
                }
                else {
                    return LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.overTip");
                }
            default:
                return "";
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }
}
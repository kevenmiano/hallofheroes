// @ts-nocheck
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import Logger from '../../../core/logger/Logger';
import { DateFormatter } from "../../../core/utils/DateFormatter";
import Dictionary from "../../../core/utils/Dictionary";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { FaceType } from "../../constant/BattleDefine";
import AddSpAnimation from "../../effect/AddSpAnimation";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";
import PointUtils from "../../utils/PointUtils";
import { DannyAction } from "../actions/DannyAction";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { AttackData } from "../data/AttackData";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { ResistModel } from "../data/ResistModel";
import { SkillData } from "../data/SkillData";
import { DepthSprite } from "./DepthSprite";
import GameConfig from '../../../../GameConfig';


import AttackOrderMsg = com.road.yishi.proto.battle.AttackOrderMsg;
import BufferMsg = com.road.yishi.proto.battle.BufferMsg;
import DamageMsg = com.road.yishi.proto.battle.DamageMsg;

export class BattleUtils {
    private static gasRow: number = 60;//行距;
    private static gasColumn: number = 120;//列距;
    private static gasTeam: number = 400;
    private static posLeft: Array<Laya.Point>;//左边9宫格站位具体坐标;
    private static posRight: Array<Laya.Point>;//右边9宫格站位具体坐标;

    public static toStringAttackOrder(value: AttackOrderMsg): string {
        let str: string = "";
        str += ("battleId : " + value.battleId + "\t");
        str += ("orderId : " + value.orderId + "\t");
        str += ("source id : " + value.livingId + "\t");
        str += ("source sp : " + value.sp + "\t");
        str += ("source spAdd : " + value.spAdded + "\t");
        str += ("attackMillis : " + DateFormatter.parse(value.attackMillis, "YYYY-MM-DD hh:mm:ss").getTime() + "\t");
        str += ("passive : " + value.isPassive + "\t");
        str += ("execFrame : " + value.execFrame + "\t");

        str += ("*****************" + "\t");
        let len: number = value.damages.length;
        str += ("skill target list size :" + len + "\t");
        let i: number = 0;
        let damageMsg;
        for (i = 0; i < len; i++) {
            damageMsg = value.damages[i];
            str += ("target id 	: " + damageMsg.livingId + "\t");
            str += ("damage 	: " + damageMsg.damageValue + "\t");
            str += ("damage type: " + damageMsg.damageType + "\t");
            str += ("left hp	: " + damageMsg.leftValue + "\t");
            str += ("extra data	: " + damageMsg.extraData + "\t");
            str += ("execFrame	: " + value.execFrame + "\t");
            str += ("damageCount: " + damageMsg.order + "\t");
        }
        str += ("*****************" + "\t");
        len = value.buffers.length;
        str += ("skill buffer list size :" + len + "\t");
        for (i = 0; i < len; i++) {
            let buffer = value.buffers[i];
            str += ("buffer	id			: " + buffer.bufferId + "\t");
            str += ("buffer	templateId	: " + buffer.templateId + "\t");
            str += ("buffer	sourceId	: " + buffer.sourceId + "\t");
            str += ("buffer	targetId	: " + buffer.targetId + "\t");
            str += ("buffer	seeType		: " + buffer.seeType + "\t");
            str += ("buffer	curTurn		: " + buffer.curTurn + "\t");
            str += ("buffer	exeWay		: " + buffer.exeWay + "\t");
            str += ("buffer	pressedNum	: " + buffer.pressedNum + "\t");
            str += ("skill buffer damage :" + "\t");
            for (let j: number = 0; j < buffer.damage.length; j++) {
                damageMsg = buffer.damage[j];
                str += ("target id 	: " + damageMsg.livingId + "\t");
                str += ("damage 	: " + damageMsg.damageValue + "\t");
                str += ("damage type: " + damageMsg.damageType + "\t");
                str += ("left hp	: " + damageMsg.leftValue + "\t");
                str += ("extra data	: " + damageMsg.extraData + "\t");
                str += ("execFrame	: " + value.execFrame + "\t");
            }
        }
        return str;
    }
    /**
     * 初始化战斗地图角色位置, 双方都是一个九宫格 
     */

    public static initRolePos() {
        BattleUtils.posLeft = [];
        BattleUtils.posRight = [];

        let screenW = Laya.stage.width
        let screenH = Laya.stage.height
        let radioX = screenW / GameConfig.width
        let radioY = screenH / GameConfig.height

        // PC设计分辨率大
        let stX = BattleUtils.gasTeam;
        if (Laya.Browser.onPC) {
            BattleUtils.posLeft = BattleUtils.get9GridPos(stX, true);
            BattleUtils.posRight = BattleUtils.get9GridPos(stX, false);
        } else {
            // 
            stX = Math.min(BattleUtils.gasTeam, BattleUtils.gasTeam * radioX)
            BattleUtils.posLeft = BattleUtils.get9GridPos(stX, true);
            BattleUtils.posRight = BattleUtils.get9GridPos(stX, false);
        }
        // Logger.battle("[BattleUtils]", Resolution.gameWidth, Resolution.gameHeight)
        Logger.battle("[BattleUtils]初始化战斗角色站位", BattleUtils.posLeft, BattleUtils.posRight)
    }

    private static get9GridPos(teamGas: number, leftFlag: boolean): any[] {
        let centerPosX = Resolution.gameWidth / 2;
        let centerPosY = Resolution.gameHeight / 2;
        let re_array: any[] = [];
        let point: Laya.Point;
        let sub_array: any[];
        let rowOffset: number = leftFlag ? 1 : -1;
        let posYArr: any[] = [15, 95, 195];
        let rowOffestArr: any[] = [0, 45, 95];
        for (let i: number = 0; i < 3; i++)//i是列
        {
            sub_array = [];
            for (let j: number = 0; j < 3; j++)//j是行
            {
                let index = 0
                if (leftFlag) {
                    switch (i) {
                        case 0:
                            index = 2
                            break;
                        case 1:
                            index = 1
                            break;
                        case 2:
                            index = 0
                            break;
                    }
                } else {
                    index = i
                }
                point = new Laya.Point();
                point.x = centerPosX - teamGas / 2 * rowOffset - index * BattleUtils.gasColumn * rowOffset - rowOffestArr[j] * rowOffset;
                point.y = posYArr[j] + centerPosY;
                sub_array.push(point);
            }
            re_array.push(sub_array);
        }
        return re_array;
    }


    /**
     *根据 pos点和朝向获得坐标点
        * @param pos		pos点
        * @param face		朝向
        * @return point
        * 
        */
    public static rolePointByPos(pos: number, face: number): Laya.Point {
        let posArr: any;
        let battleModel = BattleManager.Instance.battleModel
        if (battleModel && battleModel.selfSide == 1) {
            posArr = face == FaceType.LEFT_TEAM ? BattleUtils.posLeft : BattleUtils.posRight;
        }
        else {
            posArr = face == FaceType.RIGHT_TEAM ? BattleUtils.posRight : BattleUtils.posLeft;//如果是多人对战的防守方需要反过来;
        }
        if (face == 1) {
            switch (pos) {
                case 1:
                    return posArr[2][0];
                case 2:
                    return posArr[1][0];
                case 3:
                    return posArr[0][0];
                case 4:
                    return posArr[2][1];
                case 5:
                    return posArr[1][1];
                case 6:
                    return posArr[0][1];
                case 7:
                    return posArr[2][2];
                case 8:
                    return posArr[1][2];
                case 9:
                    return posArr[0][2];

            }
        }
        else {
            switch (pos) {
                case 1:
                    return posArr[0][0];
                case 2:
                    return posArr[1][0];
                case 3:
                    return posArr[2][0];
                case 4:
                    return posArr[0][1];
                case 5:
                    return posArr[1][1];
                case 6:
                    return posArr[2][1];
                case 7:
                    return posArr[0][2];
                case 8:
                    return posArr[1][2];
                case 9:
                    return posArr[2][2];
            }
        }
        return new Laya.Point();
    }
    /**
     * 判断一个技能是否是默认技能 
     * @param skillId
     * @return 
     * 
     */
    public static isDefaultSkill(skillId: number): boolean {
        if (skillId == -1 || skillId == 0) {
            return true;
        }
        let skillTemp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(skillId)
        if (skillTemp) {
            return (skillTemp.UseWay == 3);////useWay等于3代表默认技能;
        }
        return true;
    }

    public static getLeftTeamCenterPoint(): Laya.Point {
        return this.posLeft[1][1];
    }
    public static getRightTeamCenterPoint(): Laya.Point {
        return this.posRight[1][1];
    }
    public static getPosition(side: number, pos: number): Laya.Point {
        let col: number = (pos - 1) % 3
        let row: number = Math.ceil(pos / 3) - 1;
        if (side == FaceType.LEFT_TEAM) {
            return this.posLeft[col][row];
        } else {
            return this.posRight[col][row];
        }
    }

    public static attackPointByPos(pos: number, face: number, off: number = 1, lineup: number = 0): Laya.Point {
        let point: Laya.Point = this.rolePointByPos(pos, face);
        if (face == FaceType.LEFT_TEAM) {
            point = new Laya.Point(point.x + off + 120, point.y);
        }
        else {
            point = new Laya.Point(point.x - off - 120, point.y);
        }
        return point;
    }

    /**
     * 对指定对象的子节点进行深度管理 , 只针对depthsprite类实例进行管理
     * @param dc
     * 
     */
    public static ManagerDepth(dc: Laya.Sprite) {
        let dic: Dictionary = new Dictionary();
        let childMc: DepthSprite;
        for (let i: number = 0; i < dc.numChildren; i++) {
            dic[i] = dc.getChildAt(i);
        }
        let num: number = 0;
        for (let key in dic) {
            childMc = dic[key];
            let childMcZindex = childMc.zOrder
            dic.forEach((item: DepthSprite) => {
                num++;
                if (childMc.pointY < item.pointY && dc.getChildIndex(childMc) > dc.getChildIndex(item)) {
                    let itemZindex = item.zOrder
                    childMc.zOrder = itemZindex
                    item.zOrder = childMcZindex
                }
            });
        }
    }
    /**
     * 敌人受伤
     * @param singelAttackArr
     * @param $frame
     * @param $checkDie
     * @param distance
     * @param flyUpPower
     * @param shakeCount
     * @param flash
     * @param flashColor
     * @param playActBool
     * @param selfCause
     * @param delayBleed
     * @param skillId
     */
    public static addSingleDanny(singelAttackArr: any[], $frame: number = 12,
        $checkDie: boolean = true, distance: number = 0,
        flyUpPower: number = 0, shakeCount: number = 6,
        flash: boolean = true, flashColor: number = 0x666666,
        playActBool: boolean = true,
        selfCause: boolean = false,
        delayBleed: number = 0, skillId: number = -1) {

        if (delayBleed > 0) {
            setTimeout(executeBleed.bind(this), 40 * delayBleed)
        } else {
            executeBleed();
        }
        function executeBleed() {
            let battleModel: BattleModel = BattleManager.Instance.battleModel;
            let resistModel: ResistModel = BattleManager.Instance.resistModel;
            if (!battleModel) return;
            if (!resistModel) return;
            if (!singelAttackArr) return;
            resistModel.attackOver = false;
            for (let j: number = 0; j < singelAttackArr.length; j++) {
                let element = <AttackData>(singelAttackArr[j]);
                let role = battleModel.getRoleById(element.roleId);
                let attackRole = battleModel.getRoleById(element.fId);
                if (role) {
                    if (attackRole) {
                        Logger.battle(`[BattleUtils]${attackRole.roleName}(${element.fId})对${role.roleName}(${element.roleId})产生伤害${element.damageValue}`)
                    }

                    new DannyAction(role, element, $frame, $checkDie, distance, flyUpPower, shakeCount, flash, flashColor, playActBool, selfCause, skillId);
                    resistModel.currentResistSide = (role.side == battleModel.selfSide) ? 1 : 2;
                    resistModel.resistTotal += element.resitPercent;
                    if (battleModel.selfHero.livingId != element.fId && battleModel.selfHero.livingId != element.roleId)
                        resistModel.resistTotal = 0;
                }
            }
            resistModel.attackOver = resistModel.resistTotal != 0;
        }
    }

    /**
     * 敌人受伤, 带特效
     * @param singelAttackArr
     * @param dannyEffectData //type DannyEffectData
     * @param $frame
     * @param $checkDie
     * @param distance
     * @param flyUpPower
     * @param shakeCount
     * @param flash
     * @param flashColor
     * 
     */
    public static addSingleDannyTakeEffect(singelAttackArr: any[], dannyEffectData: Object,
        $frame: number = 12, $checkDie: boolean = true,
        distance: number = 0, flyUpPower: number = 0,
        shakeCount: number = 6, flash: boolean = true,
        flashColor: number = 0x666666, playActBool: boolean = true,
        selfCause: boolean = false,
        delayBleed: number = 0, skillId: number = -1) {
        let battleModel: BattleModel = BattleManager.Instance.battleModel;
        if (!battleModel) return;
        if (!singelAttackArr) return;
        Logger.battle("BattleUtils singelAttackArr", singelAttackArr);
        for (let j: number = 0; j < singelAttackArr.length; j++) {
            let command: AttackData = <AttackData>(singelAttackArr[j]);
            //BaseRoleInfo
            let role: any = battleModel.getRoleById(command.roleId);
            if (!role) {
                let str: String = LangManager.Instance.GetTranslation("battle.utils.BattleUtils.str");
                Logger.battle(str + ":" + command.roleId);
                return;
            }
            if (SharedManager.Instance.allowAttactedEffect) {
                role.showDannyEffect(dannyEffectData);
            }
        }
        BattleUtils.addSingleDanny(singelAttackArr, $frame, $checkDie, distance, flyUpPower, shakeCount, flash, flashColor, playActBool, selfCause, delayBleed, skillId);
    }

    /**
     * 技能更新怒气（sp） 
     * @param skillData	当前技能数据
     * @param currentRole	当前角色
     * 
     */
    public static skillUpdateSp(skillData: SkillData, currentRole: any) {
        function delayUpdateSp() {
            let targetSp: number = (currentRole).sp + skillData.spAdded;
            (currentRole).updateSp(targetSp);
            Laya.timer.once(300, this, updateOtherSp)
        }
        function updateOtherSp() {
            let targetSp: number = skillData.sp;
            (currentRole).updateSp(targetSp);
        }

        let addSpContainer
        if (skillData.skillId == 3 || skillData.skillId == 4) {				// 3和4 是胜利和失败
            return;
        }
        let battleUIView = BattleManager.Instance.battleUIView
        if (battleUIView && (currentRole instanceof HeroRoleInfo) && currentRole == BattleManager.Instance.battleModel.selfHero) {
            addSpContainer = battleUIView.getAddSpBallLayer();
            if (!addSpContainer) return;
            if (skillData.spAdded > 0) {
                if (!currentRole || !currentRole.view) {
                    return;
                }
                // let startPt: Laya.Point = new Laya.Point(currentRole.view.x, currentRole.view.y)
                // startPt = PointUtils.localToGlobal(addSpContainer.view, startPt);
                // if (BattleModel.battleDynamicLoaded) {
                //     let endPt: Laya.Point = battleUIView.getAddSpDestPoint();
                //     let lineNum: number = Math.ceil((skillData.spAdded) / 10)
                // let animation: AddSpAnimation = new AddSpAnimation(addSpContainer, lineNum);
                // animation.arrivedFun = delayUpdateSp;
                // animation.play(startPt, endPt);
                // }
                delayUpdateSp()
            } else {
                delayUpdateSp();
            }
        }

    }
}

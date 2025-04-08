// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { RuneHoleInfo } from "../../datas/RuneHoleInfo";
import FrameDataBase from "../../mvc/FrameDataBase";
import RuneHoleAllInfoMsg = com.road.yishi.proto.army.RuneHoleAllInfoMsg;
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import OpenGrades from "../../constant/OpenGrades";
/**
* @author:pzlricky
* @data: 2021-02-20 18:13
* @description *** 
*/
export default class SkillWndData extends FrameDataBase {

    //更新符孔信息
    public static UPDATE_RUNEHOLE_INFO = "UPDATE_RUNEHOLE_INFO";
    //更新页签
    public static CHANGE_TAB_VIEW = "CHANGE_TAB_VIEW";
    //符石筛选刷新
    public static CHAMGE_RUNE_FILTER = "CHAMGE_RUNE_FILTER";
    //符孔符石筛选刷新
    public static CHAMGE_HOLD_FILTER = "CHAMGE_HOLD_FILTER";


    /***符孔筛选**/
    //符石品质筛选 普通, 精良, 稀有, 史诗, 传说
    public runeHoldProfileFilter = [0, 0, 0, 0, 0];
    //符石属性筛选 物攻 魔攻 暴击 物防 魔防 生命 格挡
    public runeHoldAttributeFilter = [0, 0, 0, 0, 0, 0, 0];

    /**符石筛选**/
    //符石品质筛选 普通, 精良, 稀有, 史诗, 传说
    public runeProfileFilter = [0, 0, 0, 0, 0]
    //符石属性筛选 物攻 魔攻 暴击 物防 魔防 生命 格挡
    public runeAttributeFilter = [0, 0, 0, 0, 0, 0, 0];

    //分解过滤符石品质筛选 普通, 精良, 稀有, 史诗, 传说
    public runeProfileFilter2 = [0, 0, 0, 0, 0]
    //符石属性筛选 物攻 魔攻 暴击 物防 魔防 生命 格挡
    public runeAttributeFilter2 = [0, 0, 0, 0, 0, 0, 0];

    //符石属性名字
    private _runeAttributeName: string[];

    constructor() {
        super();
        this.addEvent();
    }

    // 物攻 魔攻 暴击 物防 魔防 生命 格挡
    public get runeAttributeName() {
        if (!this._runeAttributeName) {
            this._runeAttributeName = [
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11"),
                LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19")
            ]
        }
        return this._runeAttributeName;
    }

    public addAbility: number = 0;
    public addAgility: number = 0;
    public addCaptain: number = 0;
    public addPhysique: number = 0;
    public addStrength: number = 0;

    private _runeHoles: RuneHoleInfo[] = null;

    public get runeHoles() {

        if (this._runeHoles) {
            return this._runeHoles;
        }

        let holeInfo: RuneHoleInfo = null;
        this._runeHoles = [];
        for (let i = 1; i <= 10; i++) {
            holeInfo = new RuneHoleInfo();
            holeInfo.holeId = i;
            if (+RuneHoleInfo.RuneHoleOpenLevel[holeInfo.holeId - 1] > OpenGrades.MAX_GRADE) {
                continue;
            }
            this._runeHoles[i - 1] = holeInfo;
        }

        return this._runeHoles;
    }


    /**
     * 获得的属性(名称)
     * @param val 
     */
    public static getAttributeType(val: number, showStr1: boolean = false): string {
        let str: string = '';
        let str1: string = showStr1 ? LangManager.Instance.GetTranslation("runeGem.title") : '';
        switch (val) {
            case 0://没有效果
                str = LangManager.Instance.GetTranslation("runeGem.str27")
                break;
            case 1://力量
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01")
                break;
            case 2://护甲
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02")
                break;
            case 3://智力
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03")
                break;
            case 4://体质
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04")
                break;
            case 5://统帅
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05")
                break;
            case 6://物攻
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip06")
                break;
            case 7://物防
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip07")
                break;
            case 8://魔攻
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip08")
                break;
            case 9://魔防
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip09")
                break;
            case 10://生命
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11")
                break;
            case 11://带兵数
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip12")
                break;
            case 12://暴击
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10")
                break;
            case 13://格档
                str = str1 + LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19")
                break;
            case 99://符石全属性加成
                str = LangManager.Instance.GetTranslation("runeGem.str26")
                break;

            default:
                break;
        }
        return str;
    }


    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_RUNE_HOLE_INFO, this, this._runeHoldHandler);
    }

    private _runeHoldHandler(pkg: PackageIn) {
        let msg = pkg.readBody(RuneHoleAllInfoMsg) as RuneHoleAllInfoMsg;
        let all = msg.info;
        let holeInfo: RuneHoleInfo = null;
        let runeHoles = this.runeHoles;
        for (let hole of all) {
            holeInfo = runeHoles[hole.holeId - 1]
            if (!holeInfo) {
                //增加了开放等级，不能再弹错误提示。
                // MessageTipManager.Instance.show("错误的符孔Id: " + hole.holeId)
                continue;
            }
            holeInfo.exp = hole.exp;
            holeInfo.holeId = hole.holeId;
            holeInfo.pos = hole.pos;
            holeInfo.skill = hole.skill;
            holeInfo.grade = hole.grade;
            holeInfo.opened = true;
            holeInfo.tempSkillId = hole.tempSkillId;
            runeHoles[hole.holeId - 1] = holeInfo;
        }

        this.dispatchEvent(SkillWndData.UPDATE_RUNEHOLE_INFO);
    }

    public getRuneHoleInfoByRune(goods: GoodsInfo) {
        // let result:{hole:RuneHoleInfo,pos:number}
        let runeHoles = this.runeHoles;
        for (let hole of runeHoles) {
            for (let i = 0; i < 5; i++) {
                if (hole.getRuneByPos(i) == goods) {
                    return { hole, pos: i + 1 };
                }
            }
        }

        return null;
    }


    public get runeHoleSkills() {
        let skills: string[] = [];
        let runeHoles = this.runeHoles;
        for (let hole of runeHoles) {
            hole.isSkillOpen && skills.push(hole.skill + "")
        }
        return skills;
    }

}
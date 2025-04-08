import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { ShowAvatar } from "../../avatar/view/ShowAvatar";
import { PlayerEquipCell } from "../../component/item/PlayerEquipCell";
import { BagType } from "../../constant/BagDefine";
import { CommonConstant } from "../../constant/CommonConstant";
import { FashionEvent, RequestInfoEvent } from "../../constant/event/NotificationEvent";
import GoodsSonType from "../../constant/GoodsSonType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { BattleGuardSocketInfo } from "../../datas/playerinfo/BattleGuardSocketInfo";
import { SimpleMountInfo } from "../../datas/playerinfo/SimpleMountInfo";
import { SimplePlayerInfo } from "../../datas/playerinfo/SimplePlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import RequestInfoRientation from "../../datas/RequestInfoRientation";
import { FashionManager } from "../../manager/FashionManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerInfoManager } from "../../manager/PlayerInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { SpaceTemplateManager } from "../../manager/SpaceTemplateManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ComponentSetting from "../../utils/ComponentSetting";
import { StarHelper } from "../../utils/StarHelper";
import { FashionModel } from "../bag/model/FashionModel";
import MagicCardFightInfo from "../card/MagicCardFightInfo";
import StarInfo from "../mail/StarInfo";
import { PetData } from "../pet/data/PetData";
import SortData from "../sort/SortData";
import StarTipCom from "./StarTipCom";
import SimpleHeroMsg = com.road.yishi.proto.simple.SimpleHeroMsg;
import DetailRspMsg = com.road.yishi.proto.simple.DetailRspMsg;
import SimpleItemInfoMsg = com.road.yishi.proto.simple.SimpleItemInfoMsg;
import SimpleStarInfoMsg = com.road.yishi.proto.simple.SimpleStarInfoMsg;
import SimplePowCardFightInfoMsg = com.road.yishi.proto.simple.SimplePowCardFightInfoMsg;
import FUIHelper from "../../utils/FUIHelper";
import { GoodsHelp } from "../../utils/GoodsHelp";
import UIButton from "../../../core/ui/UIButton";
import { TattooHole } from "../sbag/tattoo/model/TattooHole";
import { TattooHoleInfoII } from "../sbag/tattoo/model/TattooHoleInfoII";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { TempleteManager } from "../../manager/TempleteManager";
import { UpgradeType } from "../../constant/UpgradeType";
import { RolePropertyCom } from "./RolePropertyCom";
import { t_s_honorequipData } from "../../config/t_s_honorequip";
import { ArmyManager } from "../../manager/ArmyManager";
import { RoleCtrl } from "../bag/control/RoleCtrl";
import { StarManager } from "../../manager/StarManager";
import { StarBagType } from "../../constant/StarDefine";
import SkillWndCtrl from "../skill/SkillWndCtrl";
import SkillWndData from "../skill/SkillWndData";


/**
 * @description查看玩家信息界面
 * @author zhihua.zhou
 */
export class PlayerInfoWnd extends BaseWindow {
    public page: fgui.Controller;
    public frame: fgui.GLabel;
    property: RolePropertyCom;
    public img_bg: fgui.GLoader;
    public txt_name: fgui.GTextField;
    public txt_consortia: fgui.GTextField;
    public vipLevel: fgui.GTextField;
    public bt_switch: fgui.GButton;
    public txt_fighting: fgui.GTextField;
    public headdress: PlayerEquipCell;
    public necklace: PlayerEquipCell;
    public clothes: PlayerEquipCell;
    public weapon: PlayerEquipCell;
    public ring1: PlayerEquipCell;
    public ring2: PlayerEquipCell;
    public trinket1: PlayerEquipCell;
    public trinket2: PlayerEquipCell;
    public txt_progress: fgui.GTextField;
    public progress: fgui.GProgressBar;
    public btn_fashionSwitch: fgui.GButton;
    public headdressFashion: PlayerEquipCell;
    public clothesFashion: PlayerEquipCell;
    public weaponFashion: PlayerEquipCell;
    public wing: PlayerEquipCell;
    public honor1: PlayerEquipCell;
    public heraldry: PlayerEquipCell;
    public halidom: PlayerEquipCell;

    // public btn_fashion: fgui.GButton;
    // public btn_vip: fgui.GButton;
    // public btn_title: fgui.GButton;
    // public soulCom: fgui.GComponent;

    public btn_info: fgui.GButton;//个人信息
    public btn_pet: fgui.GButton;//英灵
    public btn_mount: fgui.GButton;//坐骑
    public btn_star: UIButton;//星运值
    // public btn_stats: fgui.GButton;//属性
    public btn_gem: UIButton;//灵魂刻印
    public btn_tatoo: UIButton;//
    public btn_talent: UIButton;//
    public btn_honor: UIButton;//
    public btn_rune: UIButton;//
    public btn_mastery: UIButton;//

    private _figure: ShowAvatar;
    private figureBgCom: fgui.GComponent;

    private _equipList: PlayerEquipCell[];
    private _fashionList: PlayerEquipCell[];

    private _equipViewList: SimpleDictionary = new SimpleDictionary();
    private _honerViewList: SimpleDictionary = new SimpleDictionary();
    private _simpleInfo: SimplePlayerInfo;
    private _isRobot: boolean = false;
    private _isCross: boolean = false;

    private _equipDic: SimpleDictionary;
    private _thane: ThaneInfo;
    private _cardFightInfoList: Array<MagicCardFightInfo>;

    private isclickStar: boolean = false;
    private isOpenPlayerMount: boolean = false;


    private get fashionModel(): FashionModel {
        return FashionManager.Instance.fashionModel;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.page = this.contentPane.getController("page");
        this.setCenter();
        this.initData();
        this.initFigureView();
        this.addEvent();
        this.createEquip();
        this.btn_star.view.name = 'btn_star';
        // FashionManager.instance.getFashionBook();
        this.setData(this.frameData);
        //请求玩家自己符孔信息
        this.btn_tatoo.visible = ComponentSetting.TATTOO;
        this.controler.reqRuneHoldInfo();
        this.btn_mastery.view.getChild('icon').y = -6;
        this.btn_mastery.view.getChild('icon').x = 1;
    }

    public get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    /**
     * 点击图标弹出灵魂刻印属性tips
     * @param thane 
     */
    private setJewelTip(thane: ThaneInfo) {
        let langIns = LangManager.Instance;
        let level = langIns.GetTranslation("public.level2", thane.jewelGrades);
        let valStr = '+' + GoodsHelp.getJewelEffecyByGrade(thane.jewelGrades) + '%';

        let selfThane = ArmyManager.Instance.thane;
        let selflevel = langIns.GetTranslation("public.level2", selfThane.jewelGrades);
        let selfValStr = '+' + GoodsHelp.getJewelEffecyByGrade(selfThane.jewelGrades) + '%';

        let selfStr = langIns.GetTranslation("PlayerInfoWnd.Property.myProperty");

        selfStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.equip.JewelFrame.JewelNameTxt2")}[/size][/color][size=22]${selflevel}[/size]` + "<br>"
            + `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.equip.JewelFrame.JewelEffValueTxt1")}[/size][/color][size=22]${selfValStr}[/size]` + "<br>"

        let str = `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.equip.JewelFrame.JewelNameTxt2")}[/size][/color][size=22]${level}[/size]` + "<br>"
            + `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.equip.JewelFrame.JewelEffValueTxt1")}[/size][/color][size=22]${valStr}[/size]` + "<br>"
        FUIHelper.setTipData(
            this.btn_gem.view,
            EmWindow.PropertyCompareTips,
            [str, selfStr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }
    /**
     * 点击图标弹出灵魂刻印属性tips
     * @param thane 
     */
    private setHonorTip(thane: ThaneInfo) {
        let langIns = LangManager.Instance;
        let level = langIns.GetTranslation("public.level2", thane.meritorGrade);
        let grade: string = '';
        let cfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(1, thane.honorGrade);
        if (cfg) {
            grade = cfg.HonorequipnameLang;
        }
        let str = `[color=#ffc68f][size=22]${langIns.GetTranslation("honorEquip.str3") + ':' + '&nbsp;'}[/size][/color][size=22]${level}[/size]` + "<br>"
            + `[color=#ffc68f][size=22]${langIns.GetTranslation("honor.level") + '&nbsp;'}[/size][/color][size=22]${grade}[/size]` + "<br>"

        let selfLevel = ArmyManager.Instance.thane.honorEquipLevel;
        let selfgrade: string = '';
        let selfCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(1, ArmyManager.Instance.thane.honorEquipStage);
        let selfLevelStr = langIns.GetTranslation("public.level2", selfLevel);
        if (selfCfg) {
            selfgrade = selfCfg.HonorequipnameLang;
        }
        let selfstr = langIns.GetTranslation("PlayerInfoWnd.Property.myProperty");

        selfstr += `[color=#ffc68f][size=22]${langIns.GetTranslation("honorEquip.str3") + ':' + '&nbsp;'}[/size][/color][size=22]${selfLevelStr}[/size]` + "<br>"
            + `[color=#ffc68f][size=22]${langIns.GetTranslation("honor.level") + '&nbsp;'}[/size][/color][size=22]${selfgrade}[/size]` + "<br>"

        FUIHelper.setTipData(
            this.btn_honor.view,
            EmWindow.PropertyCompareTips,
            [str, selfstr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }

    private playermsg: any = null;
    /**
     *  符孔信息
     * @param thane 
     */
    private setRuneHoleTip(msg: any) {
        if (!msg) return;
        this.playermsg = msg;
        let str = this.getRuneHoleStr(msg);

        let selfstr = LangManager.Instance.GetTranslation("PlayerInfoWnd.Property.myProperty");
        selfstr += `[color=#ffc68f][size=22]${LangManager.Instance.GetTranslation("playerInfo.runeInfo")}[/size][/color]<br>`;
        if (this.controler) {
            let selfData = this.controler.getAllRuneHoldPropery();
            let count = Object.keys(selfData).length;
            if (count > 0) {
                for (const key in selfData) {
                    if (Object.prototype.hasOwnProperty.call(selfData, key)) {
                        let element = selfData[key];
                        selfstr += `[color=#ffc68f][size=22]${key + '&nbsp;:&nbsp;'}[/size][/color][size=22]${element}[/size]` + "<br>"
                    }
                }
            } else {
                selfstr += LangManager.Instance.GetTranslation('AppellPowerTip.noneProps');
            }
        }

        FUIHelper.setTipData(
            this.btn_rune.view,
            EmWindow.PropertyCompareTips,
            [str, selfstr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }

    private getRuneHoleStr(msg: any): string {
        let langIns = LangManager.Instance;
        let resultStr: string = '';
        let title = `[color=#ffc68f][size=22]${langIns.GetTranslation("playerInfo.runeInfo")}[/size][/color]`;
        if (msg.hasOwnProperty("power")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip01") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.power}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("agility")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip02") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.agility}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("intellect")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip03") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.intellect}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("physique")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip04") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.physique}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("captain")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip05") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.captain}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("attack")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip13") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.attack}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("defence")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip14") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.defence}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("magicAttack")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip15") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.magicAttack}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("magicDefence")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip16") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.magicDefence}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("forceHit")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip10") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.forceHit}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("live")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip11") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.live}[/size]` + "<br>"
        }
        if (msg.hasOwnProperty("parry")) {
            resultStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.ThaneAttributeView.Tip19") + '&nbsp;:&nbsp;'}[/size][/color][size=22]${msg.parry}[/size]` + "<br>"
        }
        let str = '';
        if (resultStr.length > 0) {
            str = title + '<br>' + resultStr;
        } else {
            str = title + '<br>' + langIns.GetTranslation('AppellPowerTip.noneProps');
        }
        return str;
    }


    /**
     * 天赋等级
     * @param thane 
     */
    private setTalentTip(thane: ThaneInfo) {
        let langIns = LangManager.Instance;
        let level = langIns.GetTranslation("public.level2", thane.talentGrade);
        let str = `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.talent.TalentView.TalentLevel") + ':'}[/size][/color][size=22]${level}[/size]` + "<br>"

        let selfstr = LangManager.Instance.GetTranslation("PlayerInfoWnd.Property.myProperty");
        let selflevel = langIns.GetTranslation("public.level2", ArmyManager.Instance.thane.talentData.talentGrade);
        selfstr += `[color=#ffc68f][size=22]${langIns.GetTranslation("armyII.viewII.talent.TalentView.TalentLevel") + ':'}[/size][/color][size=22]${selflevel}[/size]` + "<br>"
        FUIHelper.setTipData(
            this.btn_talent.view,
            EmWindow.PropertyCompareTips,
            [str, selfstr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }

    /**
     * 点击图标弹出龙纹属性tips
     * @param holesData 
     * @param holeInfoIIs 
     * @returns 
     */
    private setTatooTip(holesData: TattooHole[]) {

        let resultStr = this.getHolesDataStr(holesData);

        let selfresultStr = LangManager.Instance.GetTranslation("PlayerInfoWnd.Property.myProperty");
        let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
        if (ctrl) {
            let selfholesData: TattooHole[] = ctrl.tattooModel.holes;
            selfresultStr += this.getHolesDataStr(selfholesData);
        }

        FUIHelper.setTipData(
            this.btn_tatoo.view,
            EmWindow.PropertyCompareTips,
            [resultStr, selfresultStr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }

    private getHolesDataStr(holesData: TattooHole[]): string {
        let langIns = LangManager.Instance;
        let resultStr: string = '';
        let title = `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooView.tips")}[/size][/color]`;
        let addStrength: number = 0;
        let addAgility: number = 0;
        let addIntelligence: number = 0;
        let addCaptain: number = 0;
        let addPhysique: number = 0;
        if (!holesData) {
            holesData = [];
        }
        for (let i: number = 0; i < holesData.length; i++) {
            let hole: TattooHole = holesData[i] as TattooHole;
            switch (hole.oldAddProperty) {
                case 1:
                    addStrength += hole.oldAddingValue;
                    break;
                case 2:
                    addAgility += hole.oldAddingValue;
                    break;
                case 3:
                    addIntelligence += hole.oldAddingValue;
                    break;
                case 4:
                    addPhysique += hole.oldAddingValue;
                    break;
                case 5:
                    addCaptain += hole.oldAddingValue;
                    break;
            }
            switch (hole.oldReduceProperty) {
                case 1:
                    addStrength += hole.oldReduceValue;
                    break;
                case 2:
                    addAgility += hole.oldReduceValue;
                    break;
                case 3:
                    addIntelligence += hole.oldReduceValue;
                    break;
                case 4:
                    addPhysique += hole.oldReduceValue;
                    break;
                case 5:
                    addCaptain += hole.oldReduceValue;
                    break;
            }
        }

        let tipStr: string = "";
        if (addStrength > 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName1")}[/size][/color]` + "  +" + addStrength + "<br>";
        }
        else if (addStrength < 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName1")}[/size][/color]` + ' ' + addStrength + "<br>";
        }
        if (addAgility > 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName2")}[/size][/color]` + "  +" + addAgility + "<br>";
        }
        else if (addAgility < 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName2")}[/size][/color]` + ' ' + addAgility + "<br>";
        }
        if (addIntelligence > 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName3")}[/size][/color]` + "  +" + addIntelligence + "<br>";
        }
        else if (addIntelligence < 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName3")}[/size][/color]` + ' ' + addIntelligence + "<br>";
        }

        if (addPhysique > 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName4")}[/size][/color]` + "  +" + addPhysique + "<br>";
        }
        else if (addPhysique < 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName4")}[/size][/color]` + ' ' + addPhysique + "<br>";
        }

        if (addCaptain > 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName5")}[/size][/color]` + "  +" + addCaptain + "<br>";
        }
        else if (addCaptain < 0) {
            tipStr += `[color=#ffc68f][size=22]${langIns.GetTranslation("tattoo.TattooPopFrame.propertyName5")}[/size][/color]` + ' ' + addCaptain + "<br>";
        }

        if (tipStr != "") {
            resultStr = title + '<br>' + tipStr;
        } else {
            resultStr = title + '<br>' + langIns.GetTranslation("AppellPowerTip.noneProps");
        }
        return resultStr;
    }

    /**
     * 星运提示
     */
    private setStarTip(starInfo: StarInfo[]) {
        let resultStr = this.getStarText(starInfo);

        let selfresultStr = LangManager.Instance.GetTranslation("PlayerInfoWnd.Property.myProperty");
        let selfStarInfo = StarManager.Instance.getStarListByBagType(StarBagType.THANE);
        if (selfStarInfo) {
            selfresultStr += this.getStarText(selfStarInfo.getList());
        }

        FUIHelper.setTipData(
            this.btn_star.view,
            EmWindow.PropertyCompareTips,
            [resultStr, selfresultStr],
            new Laya.Point(-50, -130), undefined, undefined
        )
    }

    private getStarText(data: StarInfo[]): string {
        let resultStr = "";
        let desc = "";
        let starPower = StarHelper.getStarPower(data);
        resultStr = `[color=#FFC68F][size=24]${LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.title")}[/size][/color]` + `&nbsp;&nbsp;[color=#FFECC6][size=24]${starPower}[/size][/color]`;

        let count = data.length;
        if (count > 0) {
            resultStr += "<br>"
        }
        for (let index = 0; index < count; index++) {
            let starInfo: StarInfo = data[index];
            if (starInfo) {
                let profile = starInfo.template.Profile;
                var color: string = StarHelper.profileColors[profile];
                desc = `[color=${color}]${starInfo.template.TemplateNameLang}  ${LangManager.Instance.GetTranslation("public.level2", starInfo.grade)}[/color]&nbsp;&nbsp;`
                if (starInfo.template.DefaultSkill.length > 0) {
                    desc += "[size=18]" + StarHelper.getStarBufferName(starInfo) + "[/size]";
                } else {
                    desc += "[size=18]" + this.getAttribute(starInfo) + "[/size]";
                }
            }
            resultStr += desc;
            if (index < count - 1) {
                resultStr += "<br>"
            }
        }

        return resultStr;
    }

    private getAttribute(info: StarInfo): string {
        var str: string = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Power");
        if (info.template.Power > 0) {
            str += String(info.template.Power * info.grade);
            return str;
        }
        if (info.template.Agility > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Agility");
            str += String(info.template.Agility * info.grade);
            return str;
        }
        if (info.template.Intellect > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Intellect");
            str += String(info.template.Intellect * info.grade);
            return str;
        }
        if (info.template.Physique > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Physique");
            str += String(info.template.Physique * info.grade);
            return str;
        }
        if (info.template.Captain > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Captain");
            str += String(info.template.Captain * info.grade);
            return str;
        }
        if (info.template.Attack > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Attack");
            str += String(info.template.Attack * info.grade);
            return str;
        }
        if (info.template.Defence > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Defence");
            str += String(info.template.Defence * info.grade);
            return str;
        }
        if (info.template.MagicAttack > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.MagicAttack");
            str += String(info.template.MagicAttack * info.grade);
            return str;
        }
        if (info.template.MagicDefence > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.MagicDefence");
            str += String(info.template.MagicDefence * info.grade);
            return str;
        }
        if (info.template.ForceHit > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.ForceHit");
            str += String(info.template.ForceHit * info.grade);
            return str;
        }
        if (info.template.Live > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Live");
            str += String(info.template.Live * info.grade);
            return str;
        }
        if (info.template.Conat > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Conat");
            str += String(info.template.Conat * info.grade);
            return str;
        }
        if (info.template.Parry > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Parry");
            str += String(info.template.Parry * info.grade);
            return str;
        }
    }

    /**
     * 获得每个属性总的刻印加成比
     * @param properity
     * @return
     *
     */
    public getImprintTotalCountByProperity(properity: number, value: TattooHoleInfoII[]): number {
        let count: number = 0;
        if (!value) {
            return count;
        }
        for (const info of value) {
            if (info.property == properity) {
                let curUpgrdeTemp: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(info.level, UpgradeType.UPGRADE_TATTOO_NEWHOLE);
                if (!curUpgrdeTemp) {
                    continue;
                }
                if (curUpgrdeTemp.Data > 0) {
                    count += curUpgrdeTemp.Data;
                }
            }
        }
        return count;
    }


    setData(data: any) {
        if (data instanceof SortData) {
            this._thane = (data as SortData).army.baseHero;
            this._equipDic = new SimpleDictionary();
            this._equipDic.setDictionary(this._thane.equipDic);

            Logger.info("英雄装备信息: ", this._thane.equipDic);
            this._thane.hideFashion = (data as SortData).HideFashion;
            var cloth: GoodsInfo = this._equipDic[2 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var armsEquip: GoodsInfo = this._equipDic[0 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var wingEquip: GoodsInfo = this._equipDic[8 + "_" + this._thane.id + "_" + BagType.HeroEquipment]
            var hairFashion: GoodsInfo = this._equipDic[9 + "_" + this._thane.id + "_" + BagType.HeroEquipment]
            var clothFashion: GoodsInfo = this._equipDic[10 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var armsFashion: GoodsInfo = this._equipDic[11 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            this._thane.bodyEquipAvata = cloth ? cloth.templateInfo.Avata : "";
            this._thane.armsEquipAvata = armsEquip ? armsEquip.templateInfo.Avata : "";
            this._thane.wingAvata = wingEquip ? wingEquip.templateInfo.Avata : "";
            this._thane.hairFashionAvata = hairFashion ? hairFashion.templateInfo.Avata : "";
            this._thane.bodyFashionAvata = clothFashion ? clothFashion.templateInfo.Avata : "";
            this._thane.armsFashionAvata = armsFashion ? armsFashion.templateInfo.Avata : "";
            // __attributeHandler(null);
            this.tipData = StarHelper.getStarInfo(this._equipDic);
            this.setStarTip(this.tipData);
            this._cardFightInfoList = (data as SortData).cardFightInfoList;
        } else if (data instanceof ThaneInfo) {
            this._thane = data;
            this._isRobot = data.isRobot;
            if (!this._isCross) {
                PlayerManager.Instance.sendRequestSimpleAndSnsInfo(data.userId, RequestInfoRientation.SHOW_INFO);
                PlayerManager.Instance.sendRequestEquip(data.userId, RequestInfoRientation.SHOW_INFO, true, true, true);
            } else {
                // __attributeHandler(null);
                // _tabGroup.selectIndex=0;
                this.tipData = StarHelper.getStarInfo(this._equipDic);
                this.setStarTip(this.tipData);
            }
            this.setJewelTip(this._thane);
            this.property.OnInitWind(this._thane);
            this.setHonorTip(this._thane);
            this.setTalentTip(this._thane);
        } else {
            //data =  userId
            PlayerManager.Instance.sendRequestSimpleAndSnsInfo(Number(data), RequestInfoRientation.SHOW_INFO);
            PlayerManager.Instance.sendRequestEquip(Number(data), RequestInfoRientation.SHOW_INFO, true, true, true);
        }

        this.vipLevel.text = this._thane.vipGrade.toString();
        this._updateBtnGenius();
        this._updateBtnRuneHole();
    }

    /**
    * 天赋开关
    */
    private _updateBtnGenius() {
        this.btn_talent.visible = ComponentSetting.GENIUS;
    }

    /**
    * 符孔开关
    */
    private _updateBtnRuneHole() {
        this.btn_rune.visible = ComponentSetting.RUNE_HOLE;
    }

    private initData() {
        this._equipList = [];
        this._fashionList = [];
    }


    /**
     * 返回专精数据数据
     * @param info 
     */
    private onRecvMasteryInfo(info: any): void {
        info[2] = this._thane.job;``
        FrameCtrlManager.Instance.open(EmWindow.PlayerMasteryWnd, info);
        FrameCtrlManager.Instance.open(EmWindow.MyMasteryWnd);
        // this.OnBtnClose();
    }

    private onRecvMountInfo(info: SimpleMountInfo): void {
        if (this.isOpenPlayerMount) {
            if (info.mountTempId == 0) {
                return;
            } else {
                FrameCtrlManager.Instance.open(EmWindow.MyMountWnd, info);
                return;
            }
        }
        if (info.mountTempId == 0) {
            var str: string = LangManager.Instance.GetTranslation("PlayerInfo.mount");
            MessageTipManager.Instance.show(str);
            return;
        } else {
            this.isOpenPlayerMount = true;
            // if (this._thane instanceof SortData) {
            //     FrameCtrlManager.Instance.open(EmWindow.PlayerMountWnd,info);
            // } else {
            //     FrameCtrlManager.Instance.open(EmWindow.PlayerMountWnd,info);     
            // }
            FrameCtrlManager.Instance.open(EmWindow.PlayerMountWnd, info);
            //请求自己的坐骑
            var userId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;// ArmyManager.Instance.thane.userId;
            PlayerInfoManager.Instance.sendRequestMountInfo(userId);
        }
    }

    /**更新符孔信息 */
    private updateRuneHoleData() {
        this.setRuneHoleTip(this.playermsg);
    }


    private onButtonEvt(index: number): void {
        switch (index) {
            case 0://个人信息
                FrameCtrlManager.Instance.open(EmWindow.PlayerProfileWnd, this._thane);
                break;
            case 1://英灵
                PlayerInfoManager.Instance.sendRequestPetData(this._thane.userId);

                break;
            case 2://坐骑     
                this.isOpenPlayerMount = false;
                PlayerInfoManager.Instance.sendRequestMountInfo(this._thane.userId);

                break;
            case 3://星运值

                break;
            case 4://专精
                PlayerInfoManager.Instance.reqUserExtraJobInfo(this._thane.userId);
                break;
            default:
                break;
        }
    }

    private addEvent() {
        this.btn_info.onClick(this, this.onButtonEvt.bind(this, 0));
        this.btn_pet.onClick(this, this.onButtonEvt.bind(this, 1));
        this.btn_mount.onClick(this, this.onButtonEvt.bind(this, 2));
        this.btn_star.onClick(this, this.onButtonEvt.bind(this, 3));
        this.btn_mastery.onClick(this, this.onButtonEvt.bind(this, 4));
        this.page.on(fgui.Events.STATE_CHANGED, this, this.changeView);
        this.fashionModel.addEventListener(FashionEvent.SWITCH_EQUIPVIEW, this.__panelHandler, this);//切换界面
        PlayerManager.Instance.addEventListener(RequestInfoEvent.QUERY_PETDATA_RESULT, this.onRecvPetData, this);
        PlayerManager.Instance.addEventListener(RequestInfoEvent.BAG_EQUIPLOOK, this.__receiveEquipHandler, this);
        PlayerManager.Instance.addEventListener(RequestInfoEvent.QUERY_MOUNT_RESULT, this.onRecvMountInfo, this);
        PlayerManager.Instance.addEventListener(RequestInfoEvent.QUERY_MASTERY_RESULT, this.onRecvMasteryInfo, this);
        (this.controler.data as SkillWndData).addEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateRuneHoleData, this);
    }

    private onRecvPetData(petData:PetData): void {
        if (petData) {
            FrameCtrlManager.Instance.open(EmWindow.PlayerPetWnd, petData);
            //查看自己的英灵
            let selfData = PlayerManager.Instance.currentPlayerModel.playerInfo.enterWarPet;
            if (selfData) {
                FrameCtrlManager.Instance.open(EmWindow.MyPetWnd, selfData);
            }
        } else {
            var str: string = LangManager.Instance.GetTranslation("playerinfo.PlayerInfoFrameII.noWarPet");
            MessageTipManager.Instance.show(str);
        }
    }

    private __receiveEquipHandler(msg: DetailRspMsg): void {
        Logger.info("返回玩家信息: ", msg)
        let hero = msg.army.simpleHero as SimpleHeroMsg;
        if (hero) {
            this._thane.id = hero.heroId;
            this._thane.nickName = hero.nickName;
            this._thane.templateId = hero.tempateId;
            this._thane.consortiaID = msg.army.consortiaId;
            this._thane.consortiaName = msg.army.consortiaName;
            this._thane.hideFashion = msg.hideFashion;
            this._thane.charms = hero.totalCharm;
            this._thane.honer = hero.totalGeste;
            this._thane.appellId = msg.army.appellid;
            this._thane.attackProrerty.totalPhyAttack = hero.totalPhyAttack;
            this._thane.attackProrerty.totalPhyDefence = hero.totalPhyDefence;
            this._thane.attackProrerty.totalMagicAttack = hero.totalMagicAttack;
            this._thane.attackProrerty.totalMagicDefence = hero.totalMagicDefence;
            this._thane.attackProrerty.totalLive = hero.totalLive;
            this._thane.attackProrerty.totalForceHit = hero.totalForceHit;
            this._thane.attackProrerty.totalConatArmy = hero.totalConatArmy;
            this._thane.baseProperty.totalPower = hero.totalPower;
            this._thane.baseProperty.totalAgility = hero.totalAgility;
            this._thane.baseProperty.totalIntellect = hero.totalIntellect;
            this._thane.baseProperty.totalCaptain = hero.totalCaptain
            this._thane.baseProperty.totalPhysique = hero.totalPhysique;
            this._thane.attackProrerty.totalParry = hero.totalParry;
            this._thane.attackProrerty.totalIntensity = hero.totalStrength;
            this._thane.attackProrerty.totalTenacity = hero.totalTenacity;

            this._thane.attackProrerty.basePhyAttack = hero.basePhyAttack;
            this._thane.attackProrerty.basePhyDefence = hero.basePhyDefence;
            this._thane.attackProrerty.baseMagicAttack = hero.baseMagicAttack;
            this._thane.attackProrerty.baseMagicDefence = hero.baseMagicDefence;
            this._thane.attackProrerty.baseLive = hero.baseLive;
            this._thane.attackProrerty.baseForceHit = hero.baseForceHit;
            this._thane.attackProrerty.baseConatArmy = hero.baseConatArmy;
            this._thane.attackProrerty.baseParry = hero.baseParry;
            this._thane.attackProrerty.baseIntensity = hero.baseStrength;
            this._thane.attackProrerty.baseTenacity = hero.baseTenacity;

            this._thane.IsVipAndNoExpirt = msg.army.isVip;
            this._thane.vipType = msg.army.vipType;
            this._thane.jewelGrades = msg.army.storeGrade;
            this._thane.fateTotalGp = msg.army.fateTotalGp;
            this._thane.fateGrades = msg.army.fateGrades;
            this._thane.honorEquipLevel = msg.army.honorEquipLevel;
            this._thane.honorEquipStage = msg.army.honorEquipStage;
            this._thane.baseProperty.totalBattleWill = hero.reduceResi;
            this._thane.baseProperty.totalFireResi = hero.fireResi;
            this._thane.baseProperty.totalWaterResi = hero.waterResi;
            this._thane.baseProperty.totalWindResi = hero.windResi;
            this._thane.baseProperty.totalElecResi = hero.electResi;
            this._thane.baseProperty.totalLightResi = hero.lightResi;
            this._thane.baseProperty.totalDarkResi = hero.darkResi;
            this._thane.baseProperty.hasSetBattleInfoFlag = true;

            this._thane.baseProperty.fashionPower = hero.fashionAddPower;
            this._thane.baseProperty.fashionAgility = hero.fashionAddArmor;
            this._thane.baseProperty.fashionIntellect = hero.fashionAddIntellect;
            this._thane.baseProperty.fashionPhysigue = hero.fashionAddLife;
            this._thane.baseProperty.hasSetFashionProperty = true;
            this.setJewelTip(this._thane);
        }
        this.property.OnInitWind(this._thane);
        let holes: TattooHole[] = [];
        let hole: TattooHole;
        for (const holeMsg of msg.tatooHoleInfo)//TattooHoleMsg
        {
            hole = new TattooHole();
            hole.index = holeMsg.hole;//i++;
            hole.oldAddProperty = holeMsg.OldAddProperty;
            hole.oldAddingValue = holeMsg.OldAddingValue;
            hole.oldReduceProperty = holeMsg.OldReduceProperty;
            hole.oldReduceValue = holeMsg.OldReduceValue;
            hole.newAddProperty = holeMsg.NewAddProperty;
            hole.newAddingValue = holeMsg.NewAddingValue;
            hole.newReduceProperty = holeMsg.NewReduceProperty;
            hole.newReduceValue = holeMsg.NewReduceValue;
            hole.oldStep = holeMsg.OldStage;//ctrl.tattooModel.getTattooStepByLevel(holeMsg.OldGrades);
            hole.newStep = holeMsg.NewStage;//ctrl.tattooModel.getTattooStepByLevel(holeMsg.NewGrades);
            holes.push(hole);
        }
        this.setTatooTip(holes);
        this.setRuneHoleTip(msg.property);
        this.property.setFashionProperty(this._thane.devourGrade, msg.fashionProperty);

        if (this._isRobot) {
            var robot: ThaneInfo = SpaceTemplateManager.Instance.getRobotInfo(this._thane.userId);
            this._thane.nickName = robot.nickName;
            this._thane.state = robot.state;
        }
        // if (msg.army.armyPawn.length > 0)
        // {
        //     for (var j:number=0; j < msg.army.armyPawn.length; j++)
        //     {
        //         var pawn:SimpleArmyPawnMsg=msg.army.armyPawn[j] as SimpleArmyPawnMsg;
        //     }
        // }
        if (msg.item.length > 0 || msg.star.length > 0) //物品
        {
            this._equipDic = new SimpleDictionary();
        }
        for (var i: number = 0; i < msg.item.length; i++) {
            var itemMsg: SimpleItemInfoMsg = msg.item[i] as SimpleItemInfoMsg;
            var goods: GoodsInfo = new GoodsInfo();
            goods.id = itemMsg.id;
            goods.bagType = itemMsg.bagType;
            goods.objectId = itemMsg.objectId;
            goods.pos = itemMsg.pos;
            goods.templateId = itemMsg.templateId;
            goods.isBinds = itemMsg.bind;
            goods.count = itemMsg.count;
            goods.mouldGrade = itemMsg.mouldGrade;
            goods.beginDate = DateFormatter.parse(itemMsg.beginDate, "YYYY-MM-DD hh:mm:ss");
            goods.validDate = itemMsg.validDate;
            goods.strengthenGrade = itemMsg.strengthenGrade;
            goods.join1 = itemMsg.join_1;
            goods.join2 = itemMsg.join_2;
            goods.join3 = itemMsg.join_3;
            goods.join4 = itemMsg.join_4;
            goods.randomSkill1 = itemMsg.randomSkill_1;
            goods.randomSkill2 = itemMsg.randomSkill_2;
            goods.randomSkill3 = itemMsg.randomSkill_3;
            goods.randomSkill4 = itemMsg.randomSkill_4;
            goods.randomSkill5 = itemMsg.randomSkill_5;
            goods.appraisal_skill = itemMsg.appraisalSkill;
            this._equipDic[goods.pos + "_" + goods.objectId + "_" + goods.bagType] = goods;

        }


        if (hero) {
            if (!this._equipDic) {
                this._equipDic = new SimpleDictionary();
            }
            //时装信息
            let objectId: number = this._thane.id;
            let good: GoodsInfo;
            if (hero.fashionHat) {
                good = new GoodsInfo();
                good.pos = 9;
                good.bagType = BagType.HeroEquipment;
                good.templateId = Number(hero.fashionHat);
                this._equipDic[good.pos + "_" + objectId + "_" + good.bagType] = good;
            }
            if (hero.fashionCloth) {
                good = new GoodsInfo();
                good.pos = 10;
                good.bagType = BagType.HeroEquipment;
                good.templateId = Number(hero.fashionCloth);
                this._equipDic[good.pos + "_" + objectId + "_" + good.bagType] = good;
            }
            if (hero.fashionArm) {
                good = new GoodsInfo();
                good.pos = 11;
                good.bagType = BagType.HeroEquipment;
                good.templateId = Number(hero.fashionArm);
                this._equipDic[good.pos + "_" + objectId + "_" + good.bagType] = good;
            }
            if (hero.fashionWing) {
                good = new GoodsInfo();
                good.pos = 8;
                good.bagType = BagType.HeroEquipment;
                good.templateId = Number(hero.fashionWing);
                this._equipDic[good.pos + "_" + objectId + "_" + good.bagType] = good;
            }
        }

        if (this._equipDic) {
            var clothEquip: GoodsInfo = this._equipDic[2 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var armsEquip: GoodsInfo = this._equipDic[0 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var wingEquip: GoodsInfo = this._equipDic[8 + "_" + this._thane.id + "_" + BagType.HeroEquipment]
            var hairFashion: GoodsInfo = this._equipDic[9 + "_" + this._thane.id + "_" + BagType.HeroEquipment]
            var clothFashion: GoodsInfo = this._equipDic[10 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            var armsFashion: GoodsInfo = this._equipDic[11 + "_" + this._thane.id + "_" + BagType.HeroEquipment];
            this._thane.bodyEquipAvata = (clothEquip && clothEquip.templateInfo) ? clothEquip.templateInfo.Avata : "";
            this._thane.armsEquipAvata = (armsEquip && armsEquip.templateInfo) ? armsEquip.templateInfo.Avata : "";
            this._thane.wingAvata = (wingEquip && wingEquip.templateInfo) ? wingEquip.templateInfo.Avata : "";
            this._thane.hairFashionAvata = (hairFashion && hairFashion.templateInfo) ? hairFashion.templateInfo.Avata : "";
            this._thane.bodyFashionAvata = (clothFashion && clothFashion.templateInfo) ? clothFashion.templateInfo.Avata : "";
            this._thane.armsFashionAvata = (armsFashion && armsFashion.templateInfo) ? armsFashion.templateInfo.Avata : "";
        }

        for (i = 0; i < msg.star.length; i++) {
            var starobj: SimpleStarInfoMsg = msg.star[i] as SimpleStarInfoMsg;
            var starInfo: StarInfo = new StarInfo();
            starInfo.id = starobj.id;
            starInfo.bagType = starobj.bagType;
            starInfo.pos = starobj.pos;
            starInfo.tempId = starobj.templateId;
            starInfo.gp = starobj.gp;
            starInfo.grade = starobj.grade;
            this._equipDic[starInfo.pos + "_0_" + starInfo.bagType] = starInfo;
        }
        this._cardFightInfoList = new Array<MagicCardFightInfo>();
        for (i = 0; i < msg.powcardfight.length; i++) {
            var fightInfo: SimplePowCardFightInfoMsg = msg.powcardfight[i] as SimplePowCardFightInfoMsg;
            var info: MagicCardFightInfo = new MagicCardFightInfo();
            info.op = fightInfo.op;
            info.userId = fightInfo.userid;
            info.campType = fightInfo.CampType;
            info.add = fightInfo.add;
            this._cardFightInfoList.push(info);
        }
        msg.watch.forEach(info2 => {
            var item: BattleGuardSocketInfo = this._thane.battleGuardInfo.getSocketInfo(info2.gridType, info2.gridPos - 1);
            item.addItem(info2.jion1, 0);
            item.addItem(info2.jion2, 1);
            item.addItem(info2.jion3, 2);
            item.state = BattleGuardSocketInfo.OPEN;
            item.commit();
        });

        this.tipData = StarHelper.getStarInfo(this._equipDic);
        this.setStarTip(this.tipData);

        this.refreshView();
    }

    private tipData: StarInfo[] = [];

    private refreshView() {
        this.updatePersonalInfo();
        this.updateEquip();
        this.updateFight();
        this.refreshHeroFigure();
        // UIManager.Instance.ShowWind(EmWindow.RolePropertyWnd, this._thane);
    }


    private createEquip() {
        this.headdress.item.canOperate = false;
        this.necklace.item.canOperate = false;
        this.clothes.item.canOperate = false;
        this.weapon.item.canOperate = false;
        this.ring1.item.canOperate = false;
        this.ring2.item.canOperate = false;
        this.trinket1.item.canOperate = false;
        this.trinket2.item.canOperate = false;
        this.headdressFashion.item.canOperate = false;
        this.clothesFashion.item.canOperate = false;
        this.weaponFashion.item.canOperate = false;
        this.wing.item.canOperate = false;
        this.honor1.item.canOperate = false;
        //装备
        this.weapon.item.pos = Number(this.weapon.data);
        this.headdress.item.pos = Number(this.headdress.data);
        this.clothes.item.pos = Number(this.clothes.data);
        this.necklace.item.pos = Number(this.necklace.data);
        this.ring1.item.pos = Number(this.ring1.data);
        this.ring2.item.pos = Number(this.ring2.data);
        this.trinket1.item.pos = Number(this.trinket1.data);
        this.trinket2.item.pos = Number(this.trinket2.data);

        this.weapon.sonType = GoodsSonType.SONTYPE_WEAPON;
        this.headdress.sonType = GoodsSonType.SONTYPE_HEADDRESS;
        this.clothes.sonType = GoodsSonType.SONTYPE_CLOTHES;
        this.necklace.sonType = GoodsSonType.SONTYPE_NECKLACE;
        this.ring1.sonType = GoodsSonType.SONTYPE_RING;
        this.ring2.sonType = GoodsSonType.SONTYPE_RING;
        this.trinket1.sonType = GoodsSonType.SONTYPE_TRINKET;
        this.trinket2.sonType = GoodsSonType.SONTYPE_TRINKET;

        this._equipList.push(this.weapon);
        this._equipList.push(this.headdress);
        this._equipList.push(this.clothes);
        this._equipList.push(this.necklace);
        this._equipList.push(this.ring1);
        this._equipList.push(this.ring2);
        this._equipList.push(this.trinket1);
        this._equipList.push(this.trinket2);

        //时装
        this.headdressFashion.item.pos = Number(this.headdressFashion.data);
        this.clothesFashion.item.pos = Number(this.clothesFashion.data);
        this.weaponFashion.item.pos = Number(this.weaponFashion.data);
        this.wing.item.pos = Number(this.wing.data);

        this.headdressFashion.sonType = GoodsSonType.FASHION_HEADDRESS;
        this.clothesFashion.sonType = GoodsSonType.FASHION_CLOTHES;
        this.weaponFashion.sonType = GoodsSonType.FASHION_WEAPON;
        this.wing.sonType = GoodsSonType.SONTYPE_WING;

        this._fashionList.push(this.headdressFashion);
        this._fashionList.push(this.clothesFashion);
        this._fashionList.push(this.weaponFashion);
        this._fashionList.push(this.wing);

        //荣誉
        this.honor1.item.pos = Number(this.honor1.data);
        this.honor1.sonType = GoodsSonType.SONTYPE_HONER;
        this.honor1.acceptDrop = true;
        this.honor1.visible = false;

        //纹章圣物
        this.heraldry.item.canOperate = false;
        this.halidom.item.canOperate = false;
        this.heraldry.item.pos = Number(this.heraldry.data);
        this.halidom.item.pos = Number(this.halidom.data);
        this.heraldry.sonType = GoodsSonType.SONTYPE_HERALDRY;
        this.halidom.sonType = GoodsSonType.SONTYPE_RELIC;
        // this.heraldry.acceptDrop = true;
        // this.halidom.acceptDrop = true;
        if (ComponentSetting.WENZHANG_SHENGWU) {
            this._equipList.push(this.heraldry);
            this._equipList.push(this.halidom);
        }
        this.heraldry.visible = this.halidom.visible = ComponentSetting.WENZHANG_SHENGWU;
    }

    private initFigureView() {
        this._figure = new ShowAvatar(true);
        this._figure.x = 245;
        this._figure.y = 300;
        this.contentPane.displayObject.addChildAt(this._figure, 2);
    }

    // private updateSoulLevel():void
    // {
    //     let txt_lv = this.soulCom.getChild('title').asTextField;
    //     txt_lv.text = ArmyManager.Instance.thane.jewelGrades+'';
    //     txt_lv.setXY(40,43);
    //     // if(!this.btn_title.visible){
    //     //     this.soulCom.y = this.btn_title.y;
    //     // }
    // }

    private updatePersonalInfo() {
        let idx: number = this._thane.templateInfo.Job - 1;
        this.figureBgCom.getControllerAt(0).setSelectedIndex(idx);

        let nickName: string = "";
        let consortiaName: string = "";
        nickName = this._thane.nickName;

        consortiaName = LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ConsortiaName");
        consortiaName = this._thane.consortiaName ? LangManager.Instance.GetTranslation("mounts.PropertyItem.tips02", consortiaName, this._thane.consortiaName) : "";
        this.txt_name.text = LangManager.Instance.GetTranslation("public.level2", this._thane.grades) + "  " + nickName;
        this.txt_consortia.text = consortiaName;
    }

    private updateFight() {
        if (this._simpleInfo == null) {
            this.txt_fighting.text = this._thane.fightingCapacity.toString();
        }
        else {
            this.txt_fighting.text = this._simpleInfo.fightingCapacity.toString();
        }
    }

    /**
     * 装备界面更新数据
     */
    private updateEquip() {
        this._equipViewList.clear();

        for (let i = 0; i < this._equipList.length; i++) {
            const equipGrid = this._equipList[i];
            equipGrid.info = null;
            equipGrid.item.bagType = BagType.HeroEquipment;
            equipGrid.item.objectId = this._thane.id;
            this._equipViewList.add(equipGrid.item.pos + "_" + this._thane.id + "_" + equipGrid.item.bagType, equipGrid);
        }

        for (let i = 0; i < this._fashionList.length; i++) {
            const equipGrid = this._fashionList[i];
            equipGrid.info = null;
            equipGrid.item.bagType = BagType.HeroEquipment;
            equipGrid.item.objectId = this._thane.id;
            this._equipViewList.add(equipGrid.item.pos + "_" + this._thane.id + "_" + equipGrid.item.bagType, equipGrid);
        }

        //荣誉
        this._honerViewList.clear();
        this.honor1.info = null;
        this.honor1.item.info = null;
        this.honor1.item.bagType = BagType.Honer;
        this.honor1.item.objectId = this._thane.id;
        this._honerViewList.add(this.honor1.item.pos + "_" + this._thane.id + "_" + this.honor1.item.bagType, this.honor1);

        let dic = GoodsManager.Instance.getHeroHonerEquip(this._thane.id);
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: GoodsInfo = dic[key];
                let grid: PlayerEquipCell = this.getItemViewByPos(info.pos, BagType.Honer) as PlayerEquipCell;
                if (!grid) {
                    continue;
                }
                // Logger.yyz("设置装备格子！！！", info);
                grid.info = info;
            }
        }

        for (const key in this._equipDic) {
            if (this._equipDic.hasOwnProperty(key)) {
                let info: GoodsInfo = this._equipDic[key];
                let grid: PlayerEquipCell = this.getItemViewByPos(info.pos, info.bagType) as PlayerEquipCell;
                if (!grid) {
                    continue;
                }
                // Logger.yyz("设置装备格子！！！", info);
                if (info && info.templateInfo) {
                    grid.info = info;
                }

            }
        }
    }

    public getItemViewByPos(pos: number, bagType: number = BagType.HeroEquipment): PlayerEquipCell {
        if (!this._thane) {
            return null;
        }
        let item: PlayerEquipCell;
        if (bagType == BagType.HeroEquipment) {
            item = this._equipViewList[pos + "_" + this._thane.id + "_" + bagType] as PlayerEquipCell;
        } else {
            item = this._honerViewList[pos + "_" + this._thane.id + "_" + bagType];
        }
        return item;
    }

    private refreshHeroFigure() {
        this._figure.data = this._thane;
    }

    private changeView(cc: fgui.Controller) {
        if (cc.selectedIndex == 0) {
            this.fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
            this.property.changeProperty(0);
        } else if (cc.selectedIndex == 1) {
            if (FashionManager.Instance.fashionIdentityProgress <= 1) {
                SharedManager.Instance.fashionIdentityProgress = 2;
            }
            this.fashionModel.selectedPanel = FashionModel.FASHION_PANEL;
            this.property.changeProperty(1);
        }
    }

    protected __panelHandler(event: FashionEvent) {
        if (this.fashionModel.selectedPanel == FashionModel.EQUIP_PANEL) {
            this.page.selectedIndex = 0;
        } else if (this.fashionModel.selectedPanel == FashionModel.FASHION_PANEL) {
            this.page.selectedIndex = 1;
        }
    }

    private removeEvent() {
        this.btn_info.offClick(this, this.onButtonEvt.bind(this, 0));
        this.btn_pet.offClick(this, this.onButtonEvt.bind(this, 1));
        this.btn_mount.offClick(this, this.onButtonEvt.bind(this, 2));
        this.btn_star.offClick(this, this.onButtonEvt.bind(this, 3));
        this.btn_mastery.offClick(this, this.onButtonEvt.bind(this, 4));
        this.page.off(fgui.Events.STATE_CHANGED, this, this.changeView);
        this.fashionModel.removeEventListener(FashionEvent.SWITCH_EQUIPVIEW, this.__panelHandler, this);//切换界面
        PlayerManager.Instance.removeEventListener(RequestInfoEvent.QUERY_PETDATA_RESULT, this.onRecvPetData, this);
        PlayerManager.Instance.removeEventListener(RequestInfoEvent.BAG_EQUIPLOOK, this.__receiveEquipHandler, this);
        PlayerManager.Instance.removeEventListener(RequestInfoEvent.QUERY_MOUNT_RESULT, this.onRecvMountInfo, this);
        (this.controler.data as SkillWndData).removeEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateRuneHoleData, this);
    }

    dispose(dispose?: boolean) {
        this.removeEvent();
        ObjectUtils.disposeObject(this._figure);
        super.dispose(dispose);
    }
}
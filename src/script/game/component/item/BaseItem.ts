// @ts-nocheck
import FUI_BaseItem from "../../../../fui/Base/FUI_BaseItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { BagType } from "../../constant/BagDefine";
import { IconFactory } from "../../../core/utils/IconFactory";
import GoodsSonType from "../../constant/GoodsSonType";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { CommonConstant } from "../../constant/CommonConstant";
import { TempleteManager } from "../../manager/TempleteManager";
import { GoodsType } from "../../constant/GoodsType";
import { PetData } from "../../module/pet/data/PetData";
import { GoodsManager } from "../../manager/GoodsManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { GoodsCheck } from "../../utils/GoodsCheck";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { FashionManager } from "../../manager/FashionManager";
import { MountsManager } from "../../manager/MountsManager";
import FUIHelper from "../../utils/FUIHelper";
import { isOversea } from "../../module/login/manager/SiteZoneCtrl";
import LangManager from "../../../core/lang/LangManager";
import ArtifactTips from "../../tips/ArtifactTips";
import { t_s_petartifactpropertyData } from "../../config/t_s_petartifactproperty";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/21 19:37
 * @ver 1.0
 *
 */
export class BaseItem extends FUI_BaseItem implements ITipedDisplay {
    extData: any;
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);

    // 频繁刷新设置icon可能会导致图标清除有问题, 设置可见性解决
    public imgIcon: fgui.GLoader;
    protected _info: GoodsInfo;
    // 有数据时候隐藏bg
    public hideBgHasInfo: boolean = false;
    public bagType: number = BagType.Hide;
    public objectId: number = 0;
    public pos: number = -1;
    public showProfile: boolean = true;
    public needShowBetterImg: boolean = true;
    public showName: boolean = false;
    constructor() {
        super();
    }

    protected onConstruct(): void {
        super.onConstruct();
        this.imgIcon = this.getChild("icon").asLoader;
    }

    public set newInfo(info:GoodsInfo){
        this._info = info;
        this.clean();

        if (this.hideBgHasInfo) {
            this.back.visible = !Boolean(info);
        }
        if (!info) {
            return;
        }

        this.imgIcon.visible = true;
        //doubt 不能在构造函数和onConstruct中注册
        ToolTipsManager.Instance.register(this);
        let temp: t_s_itemtemplateData = info.templateInfo;
        if (!temp) {
            return;
        }
        this.text = this.getCountStr(info);
        this.icon = IconFactory.getGoodsIconByTID(temp.TemplateId);
        this.tipData = [info,false];
        this.setTipStyle(temp);
        if (this.showProfile) {
            this.profileNum = info.templateInfo.Profile - 1;
        }
        if (this.showName) {
            this.nameTxt.visible = true;
            this.nameTxt.text = temp.TemplateNameLang;
            this.nameTxt.color = temp.profileColor;
        } else {
            this.nameTxt.visible = false;
        }

        if (info.templateInfo.StrengthenMax != 0 && info.strengthenGrade == info.templateInfo.StrengthenMax) {
            this.strengthenIcon.visible = true;
        }
        else {
            this.strengthenIcon.visible = false;
        }
        this.img_better.visible = false;
        this.type.selectedIndex = 0;
        this.suit_icon.visible = false;
        if (info.templateInfo.Job[0]) {
            this.suit_icon.visible = true;
            this.suit_icon.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + info.templateInfo.Job[0]);
        }
    }

    public set info(info: GoodsInfo) {
        this._info = info;
        this.clean();

        if (this.hideBgHasInfo) {
            this.back.visible = !Boolean(info);
        }
        if (!info) {
            return;
        }

        this.imgIcon.visible = true;
        //doubt 不能在构造函数和onConstruct中注册
        ToolTipsManager.Instance.register(this);

        if (info.petData) {
            this.setPetData(info.petData);
            return;
        }
        let temp: t_s_itemtemplateData = info.templateInfo;
        if (!temp) {
            return;
        }

        this.text = this.getCountStr(info);
        this.icon = IconFactory.getGoodsIconByTID(temp.TemplateId);
        if(temp.SonType == GoodsSonType.ARTIFACT && temp.MasterType == GoodsType.EQUIP){
            let tempData: t_s_petartifactpropertyData = TempleteManager.Instance.getArtifactTemplate(temp.TemplateId);
            if(tempData){
                this.levelTxt.text = LangManager.Instance.GetTranslation("public.level3",tempData.Level);
            }
            this.isArtifact.selectedIndex = 1;
            this.isIdentify.selectedIndex = GoodsCheck.hasIdentify(this._info) ? 1 : 0;
            this.tipData = [info,ArtifactTips.OTHER_TYPE];
            this.needShowBetterImg = false;
        }else{
            this.tipData = info;
            this.needShowBetterImg = true;
            this.isArtifact.selectedIndex = 0;
            this.isIdentify.selectedIndex = 1;
        }
        this.setTipStyle(temp);
        if (this.showProfile) {
            // this.profile.visible = !(this._gInfo.templateInfo.Profile == 1);
            this.profileNum = info.templateInfo.Profile - 1;
        }
        if (this.showName) {
            this.nameTxt.text = temp.TemplateNameLang;
            this.nameTxt.color = temp.profileColor;
        }
        
        if (info.templateInfo.StrengthenMax != 0 && info.strengthenGrade == info.templateInfo.StrengthenMax) {
            this.strengthenIcon.visible = true;
        }
        else {
            this.strengthenIcon.visible = false;
        }

        if (info.bagType == BagType.Player) {
            if (info.checkIsFilterGoods()) {
                // setDarkFilter();
            }
            else {
                // setBrightFilter();
            }
        }

        // 218（坐骑卡）、109-112（时装部件）需要根据情况显示已激活标识
        let sontypes = [218, 109, 110, 111, 112]
        if (sontypes.indexOf(info.templateInfo.SonType) >= 0) {
            let booklist = FashionManager.Instance.fashionModel.bookList;
            if (info.templateInfo.TemplateId in booklist) {
                this.isActive.selectedIndex = 1;
            }
            else {
                this.isActive.selectedIndex = 0;
            }
            if (info.templateInfo.SonType == 218)//坐骑卡
            {
                this.isActive.selectedIndex = MountsManager.Instance.avatarList.isLightTemplate(info.templateInfo.Property1) ? 1 : 0;
            }
        }
        this.img_better.visible = false;
        if (GoodsManager.Instance.isFashion(temp)) {
            this.profileNum = 6;
            if (info.id != 0) {
                // if (temp.Property4 == 1) {
                //     _fashionImage.setFrame(1);
                // } else {
                //     _fashionImage.setFrame(2);
                // }
                this.type.selectedIndex = 1;
                this.fashionText.text = this.getFashionLevel(info) + "";
                this.fashion.visible = false;

                if (this.getFashionLevel(info) == 9) {
                    //yyztodo 显示顶级时装角标,一个皇冠
                }
            }
        } else if (GoodsManager.Instance.isEquip(temp) || info.bagType == BagType.Player) {
            //装备
            this.type.selectedIndex = 2;
            this.initInlay(info);
            let bagGoods: any[] = [];
            let NeedGrades = 1;
            if (info && info.templateInfo) {
                bagGoods = GoodsManager.Instance.checkCanEquip(info.templateInfo.SonType);
                NeedGrades = info.templateInfo.NeedGrades;
            }
            let bestGoodsInBag: GoodsInfo = GoodsCheck.getBestGoodsInList(bagGoods);
            if (bestGoodsInBag) {
                //背包中最好的&&比我装备的好
                this.img_better.visible = this.needShowBetterImg && GoodsManager.Instance.isGneralBagGoods(info) && GoodsCheck.checkGoodsBetterThanHero(info) && info.id == bestGoodsInBag.id;
            }
            if (GoodsManager.Instance.isEquip(temp)) {//装备显示等级
                this.text = this.getStrengthenGrade(info);//LangManager.Instance.GetTranslation("public.level3", NeedGrades);
            }
        } else {
            this.type.selectedIndex = 0;
        }
        this.suit_icon.visible = false;
        if (info.templateInfo.Job[0]) {
            this.suit_icon.visible = true;
            // this.suit_icon.icon = IconFactory.getCommonIconPath1(url);
            this.suit_icon.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + info.templateInfo.Job[0]);
        }
    }

    private getStrengthenGrade(gInfo: GoodsInfo): string {
        return gInfo.strengthenGrade > 0 ? ("+" + gInfo.strengthenGrade) : "";
    }

    public get info(): GoodsInfo {
        return this._info;
    }

    public setIsActiveVisible(flag: boolean = false) {
        this.isActive.selectedIndex = flag ? 1 : 0;
    }

    private initInlay(info: GoodsInfo) {
        let index: number = 1;
        let key: string;
        let isFashion: boolean = GoodsManager.Instance.isFashion(info.templateInfo);
        this.clearInlayItem();
        if (info.id == 0) {
            let len: number = info.templateInfo.Property1;
            if (isFashion) {
                len = 0;
            }

            for (index = 1; index <= len; index++) {
                key = "inlayItem" + index;
                if (this.hasOwnProperty(key) && this[key] != null) {
                    (this[key] as fgui.GLoader).url = fgui.UIPackage.getItemURL("Base", CommonConstant.GEM_ITEMS_RES[10]);
                    (this[key] as fgui.GLoader).visible = true;
                }
            }
        }
        else {
            for (index = 1; index <= 4; index++) {
                key = "inlayItem" + index;
                if (this.hasOwnProperty(key) && this[key] != null) {
                    let value = info["join" + index];
                    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, value);
                    (this[key] as fgui.GLoader).url = fgui.UIPackage.getItemURL("Base", CommonConstant.GEM_ITEMS_RES[value == -1 ? 9 : value == 0 ? 10 : temp.Property1]);
                    if (info["join" + index] != -1) {
                        (this[key] as fgui.GLoader).visible = true;
                    }
                }
            }
        }
    }

    protected setPetData(petData: PetData) {
        if (!petData) {
            return;
        }
        this.tipType = EmWindow.PetTip;
        this.tipData = petData;
        // this.tipData = "[color=#ed781d][size=24]我是一只宠物[/size][/color]<br>" +
        //     "[color=#ffc68f]但是tips还没实现[/color]<br>" +
        //     "[color=#ffc68f]惊不惊喜意不意外[/color]";
        // this.tipType = EmWindow.CommonTips;
        this.icon = IconFactory.getPetHeadSmallIcon(petData.templateId);
        this.text = "";
        if (this.showProfile) {
            // _profile.visible = (petData.quality != 1);
            this.profileNum = petData.quality - 1;
        }
    }

    private getFashionLevel(info: GoodsInfo): number {
        let skillId: number = info.randomSkill1;
        if (!TempleteManager.Instance.getSkillTemplateInfoById(info.randomSkill1)) {
            skillId = Number(info.templateInfo.DefaultSkill.split(",")[0]);
        }
        let cfg: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
        if (cfg) {
            return cfg.Grades;
        }
        return 0;
    }

    public getCountStr(value: GoodsInfo): string {
        if (!value.templateInfo || value.templateInfo.MaxCount <= 1 || value.count <= 0) {
            return "";
        }
        if (isOversea()) {
            //北美钻石跟绑钻显示具体数量
            if (value.templateId == -400 || value.templateId == -500) {
                return value.count + "";
            }
        }
        let countStr = value.count + "";
        //统一是K 大于 100K
        if (value.count > 100000) {
            countStr = (value.count / 1000 >> 0) + "K";
        }

        return countStr
    }

    public setTipStyle(temp: t_s_itemtemplateData) {
        if (temp.MasterType == GoodsType.EQUIP || temp.MasterType == GoodsType.HONER) {
            if(temp.SonType == GoodsSonType.ARTIFACT){
                this.tipType = EmWindow.ArtifactTips;
            }else{
                this.tipType = EmWindow.EquipContrastTips;
            }
        }else if (temp.MasterType == GoodsType.PROP || temp.MasterType == GoodsType.PET_CARD || temp.MasterType == GoodsType.PET_EQUIP) {
            switch (temp.SonType) {
                case GoodsSonType.SONTYPE_COMPOSE:
                    this.tipType = EmWindow.ComposeTip;
                    break;
                case GoodsSonType.SONTYPE_SEED:
                    this.tipType = EmWindow.FarmBagTipWnd;
                    break;
                case GoodsSonType.SONTYPE_MOUNT_CARD:
                    this.tipType = EmWindow.MountCardTip;
                    break;
                case GoodsSonType.SONTYPE_PASSIVE_SKILL:
                    //符文石
                    this.tipType = EmWindow.RuneTip;
                    break;
                case GoodsSonType.SONTYPE_APPELL:
                case GoodsSonType.SONTYPE_PET_CARD:
                    this.tipType = EmWindow.PropTips;
                    if (this.info && this.info.property1) {
                        this.tipType = null;
                    }
                    break;
                // case GoodsSonType.SONTYPE_MAGIC_CARD:
                //     // this.tipType = EmWindow.MagicCardTip;
                //     this.tipData = "[color=#ed781d][size=24]我是一个卡牌[/size][/color]<br>" +
                //         "[color=#ffc68f]但是tips还没实现[/color]<br>" +
                //         "[color=#ffc68f]惊不惊喜意不意外[/color]";
                //     this.tipType = EmWindow.CommonTips;
                    break;
                case GoodsSonType.RESIST_GEM:
                    this.tipType = EmWindow.CryStalTips;
                    break;
                default:
                    this.tipType = EmWindow.PropTips;
                    break;
            }
        }
    }

    public set profileNum(num: number) {
        let res = CommonConstant.QUALITY_RES[num];
        this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
    }

    public set countText(str: string) {
        this.text = str
    }

    private clearInlayItem() {
        let key: string;
        for (let index = 1; index <= 4; index++) {
            key = "inlayItem" + index;
            (this[key] as fgui.GLoader).url = "";
            (this[key] as fgui.GLoader).visible = false;
        }
    }

    protected clean() {
        this.profile.icon = "";
        this.text = "";
        this.nameTxt.text = "";
        this.icon = "";
        this.imgIcon.visible = false;
        this.strengthenIcon.visible = false;
        this.type.selectedIndex = 0;
        this.isActive.selectedIndex = 0;
        this.tipData = null;
        this.tipType = null;
        this.levelTxt.text = "";
        this.isIdentify.selectedIndex  = 1;
        this.clearInlayItem();
    }

    dispose() {
        this.clean();
        ToolTipsManager.Instance.unRegister(this);
        this._info = null;
        this.startPoint = null;

        super.dispose();
    }
}
import FUI_SAppellCom from "../../../../../fui/SBag/FUI_SAppellCom";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Utils from "../../../../core/utils/Utils";
import { AppellView } from "../../../avatar/view/AppellView";
import { t_s_appellData } from "../../../config/t_s_appell";
import { AppellEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import AppellManager from "../../../manager/AppellManager";
import AppellSocketOutManager from "../../../manager/AppellSocketOutManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import AppellModel, { AppellPowerInfo } from "../../appell/AppellModel";
import SAppellCellItem from "./SAppellCellItem";

/**
 * 新版背包
 * @description 称号
 * @author zhihua.zhou
 * @date 2022/12/8
 * @ver 1.3
 */
export class SAppellCom extends FUI_SAppellCom {
    private _firstIn: boolean = true;
    private _lookAppellId: number = 0;
    private _appellList: Array<t_s_appellData> = [];
    private _honerView: AppellView;
    private _myhonerView: AppellView;
    private _cellData: t_s_appellData = null;
    private isInited: boolean = false;

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    onConstruct() {
        super.onConstruct();
        this.__updateAppellPowerInfoHandler();
    }

    onShow(appellId: any) {
        this.updateView(appellId);
    }

    onHide() {
        if (this.isInited) {
            this.isInited = false;
            this.removeEvent();
        }
    }


    private init() {
        this.txt_content.text = LangManager.Instance.GetTranslation("yishi.view.tips.AppellInfoTips.AppellTalkDescribeTxt");
        this.addEvent();
        AppellSocketOutManager.lookAppellInfos();
        // Laya.timer.once(2000,this,function(){
        //     this.appellList.selectedIndex = 0;
        // })
        // this.onListItemClick(null,null)
    }

    private addEvent() {
        this.appellList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list_tab.on(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);
        this.appellList.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.appellmodel.addEventListener(AppellEvent.APPELL_DATA_UPDATA, this.__updateAppellDataHandler, this);
        this.thane.addEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__updateThaneInfoHandler, this);
        this.thane.addEventListener(PlayerEvent.APPELL_CHANGE, this.onAppellChange, this);
    }

    private removeEvent() {
        // this.appellList.itemRenderer && this.appellList.itemRenderer.recover();
        Utils.clearGListHandle(this.appellList);
        this.list_tab.off(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);
        this.appellList.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.appellmodel.removeEventListener(AppellEvent.APPELL_DATA_UPDATA, this.__updateAppellDataHandler, this);
        this.thane.removeEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__updateThaneInfoHandler, this);
        this.thane.removeEventListener(PlayerEvent.APPELL_CHANGE, this.onAppellChange, this);
    }


    /**称号更新 */
    private onAppellChange() {
        this._lookAppellId = this.thane.appellId;
        if (this._lookAppellId > 0) {
            this.refreshView(true);
        } else {
            this.refreshView();
        }
    }

    private __onTabChange() {
        switch (this.list_tab.selectedIndex) {
            case 0:
                this.appellmodel.currentPage = AppellModel.TYPE_GET;
                break;
            case 1:
                this.appellmodel.currentPage = AppellModel.TYPE_SELF;
                break;
            case 2:
                this.appellmodel.currentPage = AppellModel.TYPE_PVP;
                break;
            case 3:
                this.appellmodel.currentPage = AppellModel.TYPE_PVE;
                break;
            case 4:
                this.appellmodel.currentPage = AppellModel.TYPE_OTHER;
                break;
            default:
                break;
        }
        this.refreshView();
        this.appellList.selectedIndex = 0;
        if (this._appellList.length)
            this._cellData = this._appellList[0] as t_s_appellData
        this.onShowDetail(true)
    }

    private onListItemClick(item: SAppellCellItem, evt) {
        // Logger.log(this.appellList.selectedIndex);
        // let evtTarget = evt.target;
        // let target = fgui.GObject.cast(evtTarget)
        // if(evtTarget && !(target instanceof SAppellCellItem)) {
        //     return;
        // }
        this._cellData = item.cellData;
        this.onShowDetail(true);
        if (this.appellList.selectedIndex == this._appellList.length - 1) {
            this.appellList.scrollPane.scrollBottom();
        }
        item.updateState();
        //title0
    }

    /**
     * 显示详情
     */
    public onShowDetail(selected: boolean) {
        // this.isShowDetail = selected;
        // if (this._cellData && this._cellData.isGet) {
        if (selected) {
            if (!this._cellData) {
                this.list_tab.selectedIndex = 0;
                if (this._honerView) {
                    ObjectUtils.disposeObject(this._honerView)
                    this._honerView = null;
                }
                this.g1.visible = false;
                this.txt_name.text = '';
                return;
            }
            // if (!this._cellData.isGet) {
            //    this.c1.selectedIndex = 0;
            // }else{
            //     this.c1.selectedIndex = this._cellData.isEquiped ? 2 : 1;
            // }
            this.c2.selectedIndex = (this._cellData.PerfixLang != "") ? 1 : 0;
            if (this._cellData.PerfixLang != '') {
                this.txt_name.fontSize = this._cellData.TextFontSize ? this._cellData.TextFontSize : 20;
                this.txt_name.color = AppellModel.getTextColorAB(this._cellData.TextColorIdx);
                this.txt_name.text = this._cellData.TitleLang;
            }
            // let isShow = this.showDetail.selectedIndex == 1 ? 0 : 1;
            // this.showDetail.selectedIndex = 1;
            // this.appellDetailLeft.c1.selectedIndex = 1;
            // this.appellDetailLeft.title.text = LangManager.Instance.GetTranslation("yishi.view.tips.AppellInfoTips.AppellTopDescribeTxt");
            if (this._honerView) {
                ObjectUtils.disposeObject(this._honerView)
                this._honerView = null;
            }
            this._honerView = new AppellView(this._cellData.ImgWidth, this._cellData.ImgHeight, this._cellData.TemplateId);
            this._honerView.x = this.appellMovie.x
            this._honerView.y = this.appellMovie.y
            this.displayObject.addChild(this._honerView);
            // this.appellDetailRight.title.text = LangManager.Instance.GetTranslation("yishi.view.tips.AppellInfoTips.AppellTopDescribeTxt");

            let hasProps: boolean = false;
            let list = this.list_prop;
            list.removeChildren();
            let appellInfo = AppellManager.Instance.model.getAppellPowerInfo([this._cellData]) as AppellPowerInfo;
            if (appellInfo) {
                let item: fgui.GComponent
                if (appellInfo.Power > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Power
                    item.getChild("txtName").asLabel.text = appellInfo.PowerName;
                    hasProps = true;
                }
                if (appellInfo.Agility > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Agility
                    item.getChild("txtName").asLabel.text = appellInfo.AgilityName
                    hasProps = true;
                }
                if (appellInfo.Intellect > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Intellect
                    item.getChild("txtName").asLabel.text = appellInfo.IntellectName
                }
                if (appellInfo.Physique > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Physique
                    item.getChild("txtName").asLabel.text = appellInfo.PhysiqueName
                    hasProps = true;
                }
                if (appellInfo.Captain > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Captain
                    item.getChild("txtName").asLabel.text = appellInfo.CaptainName
                    hasProps = true;
                }
                if (appellInfo.Attack > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Attack
                    item.getChild("txtName").asLabel.text = appellInfo.AttackName
                    hasProps = true;
                }
                if (appellInfo.Defence > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Defence
                    item.getChild("txtName").asLabel.text = appellInfo.DefenceName
                    hasProps = true;
                }
                if (appellInfo.MagicAttack > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.MagicAttack
                    item.getChild("txtName").asLabel.text = appellInfo.MagicAttackName
                    hasProps = true;
                }
                if (appellInfo.MagicDefence > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.MagicDefence
                    item.getChild("txtName").asLabel.text = appellInfo.MagicDefenceName
                    hasProps = true;
                }
                if (appellInfo.ForceHit > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.ForceHit
                    item.getChild("txtName").asLabel.text = appellInfo.ForceHitName
                    hasProps = true;
                }
                if (appellInfo.Penetrate > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Penetrate
                    item.getChild("txtName").asLabel.text = appellInfo.PenetrateName
                    hasProps = true;
                }
                if (appellInfo.Parry > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Parry
                    item.getChild("txtName").asLabel.text = appellInfo.ParryName
                    hasProps = true;
                }
                if (appellInfo.Live > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Live
                    item.getChild("txtName").asLabel.text = appellInfo.LiveName
                    hasProps = true;
                }
                if (appellInfo.Conat > 0) {
                    item = list.addItem() as fgui.GComponent;
                    item.getChild("txtValue").asLabel.text = "+" + appellInfo.Conat
                    item.getChild("txtName").asLabel.text = appellInfo.ConatName
                    hasProps = true;
                }
            }
            this.g1.visible = hasProps;
            if (this._cellData.PerfixLang != '' && !hasProps) {
                this.c3.selectedIndex = 1;
            } else {
                this.c3.selectedIndex = 0;
            }
            if (this.grayed) {
                // this.grayed = true;
                list.filters = [UIFilter.grayFilter]
                this._honerView.filters = [UIFilter.grayFilter]
            } else {
                list.filters = []
                this._honerView.filters = []
            }
        }
    }

    private __updateAppellDataHandler(e: AppellEvent) {
        if (this._lookAppellId == 0) {
            if (AppellManager.Instance.model.getAcquiredList().length > 0) {
                this.appellmodel.currentPage = AppellModel.TYPE_GET;
                this.list_tab.selectedIndex = AppellModel.TYPE_GET;
            } else {
                this.appellmodel.currentPage = AppellModel.TYPE_SELF;
                this.list_tab.selectedIndex = AppellModel.TYPE_SELF;
            }
        } else {
            var appellInfo: t_s_appellData = TempleteManager.Instance.getAppellInfoTemplateByID(this._lookAppellId);
            if (appellInfo) {
                this.appellmodel.currentPage = appellInfo.Type;
                this.list_tab.selectedIndex = appellInfo.Type;
            } else {
                this.appellmodel.currentPage = AppellModel.TYPE_GET;
                this.list_tab.selectedIndex = AppellModel.TYPE_GET;
            }
        }
        this.refreshView();
    }

    /**渲染称号Item */
    renderListItem(index: number, item: SAppellCellItem) {
        var data: t_s_appellData = this._appellList[index] as t_s_appellData;
        if (data.TemplateId == ArmyManager.Instance.thane.appellId) {
            data.isEquiped = true;
        } else {
            data.isEquiped = false;
        }
        item.itemData = data;
    }

    private __updateThaneInfoHandler(evt) {
        this._lookAppellId = this.thane.appellId;
        if (this._lookAppellId > 0) {
            this.refreshView(true);
        } else {
            this.refreshView();
        }
    }

    private refreshView(look: boolean = false) {
        this._appellList = this.appellmodel.getCurrentList();
        var appellLength: number = this._appellList.length;
        this.appellList.numItems = appellLength;
        this.appellList.ensureBoundsCorrect();
        let appellIndex: number = 0;
        for (let index = 0; index < this._appellList.length; index++) {
            let dataitem = this._appellList[index];
            if (dataitem.TemplateId == this._lookAppellId) {
                appellIndex = index;
            }
        }

        if (this._lookAppellId > 0) {
            if (appellLength > 0) {
                this.appellList.selectedIndex = appellIndex;
                this.appellList.scrollToView(appellIndex, true);
                this.onListItemClick(this.appellList.getChildAt(appellIndex) as SAppellCellItem, null);
            }
        } else {
            if (appellLength > 0) {
                this.appellList.selectedIndex = 0;
                this.appellList.scrollToView(0);
                (this.appellList.getChildAt(0) as SAppellCellItem).updateState();
            }
        }
        let text = "";
        if (this.thane.appellId != 0) {
            text = ArmyManager.Instance.thane.appellInfo.TitleLang
            this.txt_noappel.visible = false;
            this.addbox.visible = true;//自己没有获得任何称号的时候不显示
            if (this._myhonerView) {
                ObjectUtils.disposeObject(this._myhonerView)
                this._myhonerView = null;
            }
            this._myhonerView = new AppellView(ArmyManager.Instance.thane.appellInfo.ImgWidth, ArmyManager.Instance.thane.appellInfo.ImgHeight, ArmyManager.Instance.thane.appellInfo.TemplateId);
            this._myhonerView.x = this.my_appellMovie.x
            this._myhonerView.y = this.my_appellMovie.y
            this.displayObject.addChild(this._myhonerView);
        } else {
            text = LangManager.Instance.GetTranslation("armyII.viewII.attribute.PlayerAttributeView.Not");
            this.txt_noappel.visible = true;
            if (this._myhonerView) {
                ObjectUtils.disposeObject(this._myhonerView)
                this._myhonerView = null;
            }

        }
        this.title.setVar('name', text).flushVars();

        if (this.list_tab.selectedIndex == AppellModel.TYPE_GET && this.appellList.numItems == 0) {
            this.addbox.visible = false;
        } else {
            this.addbox.visible = true;
        }
    }

    private __updateAppellPowerInfoHandler() {
        // FUIHelper.setTipData(
        //     this.comAppellPower,
        //     EmWindow.AppellPowerTip,
        //     this.appellmodel.getAppellPowerInfo(),
        //     new Laya.Point(-35, 80)
        // )
        let hasProps: boolean = false;
        let list = this.list_addprop;
        list.removeChildren();
        let appellInfo = this.appellmodel.getAppellPowerInfo();
        if (appellInfo) {
            let item: fgui.GComponent
            if (appellInfo.Attack >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.Attack
                item.getChild("txtName").asLabel.text = appellInfo.AttackName
                hasProps = true;
            }
            if (appellInfo.ForceHit >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.ForceHit
                item.getChild("txtName").asLabel.text = appellInfo.ForceHitName
                hasProps = true;
            }
            if (appellInfo.Defence >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.Defence
                item.getChild("txtName").asLabel.text = appellInfo.DefenceName
                hasProps = true;
            }
            if (appellInfo.Parry >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.Parry
                item.getChild("txtName").asLabel.text = appellInfo.ParryName
                hasProps = true;
            }
            if (appellInfo.MagicAttack >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.MagicAttack
                item.getChild("txtName").asLabel.text = appellInfo.MagicAttackName
                hasProps = true;
            }
            if (appellInfo.Live >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.Live
                item.getChild("txtName").asLabel.text = appellInfo.LiveName
                hasProps = true;
            }
            if (appellInfo.MagicDefence >= 0) {
                item = list.addItem() as fgui.GComponent;
                item.getChild("txtValue").asLabel.text = "+" + appellInfo.MagicDefence
                item.getChild("txtName").asLabel.text = appellInfo.MagicDefenceName
                hasProps = true;
            }

        }
    }

    private get appellmodel(): AppellModel {
        return AppellManager.Instance.model;
    }

    private updateView(appellId: any) {
        this._lookAppellId = appellId;
        if (!this.isInited) {
            this.init();
            this.refreshView();
            if (this._appellList.length)
                this._cellData = this._appellList[0] as t_s_appellData
            this.onShowDetail(true)
        } else {
            if (appellId > 0) {
                AppellSocketOutManager.lookAppellInfos();
            }
        }
        this.isInited = true;
        this.__updateAppellPowerInfoHandler();
    }

    // private onHelp(){
    //     let title = '';
    //     let content = '';
    //     title = LangManager.Instance.GetTranslation("public.help");
    //     content = LangManager.Instance.GetTranslation("role.roleProperty.helpContent");
    //     UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    // }
}
import FUI_AppellCellItem from "../../../../fui/Appell/FUI_AppellCellItem";
import FUI_AppellPreviewBtn from "../../../../fui/Appell/FUI_AppellPreviewBtn";
import { AppellView } from "../../avatar/view/AppellView";
import { t_s_appellData } from '../../config/t_s_appell';
import { EmWindow } from "../../constant/UIDefine";
import AppellManager from "../../manager/AppellManager";
import AppellSocketOutManager from "../../manager/AppellSocketOutManager";
import { ToolTipsManager } from '../../manager/ToolTipsManager';
import { ITipedDisplay, TipsShowType } from '../../tips/ITipedDisplay';
import ObjectUtils from '../../../core/utils/ObjectUtils';
import { AppellPowerInfo } from "./AppellModel";
import { UIFilter } from '../../../core/ui/UIFilter';

/**
 * 称号渲染单元格
 */
export default class AppellCellItem extends FUI_AppellCellItem {

    private _cellData: t_s_appellData = null;
    //@ts-ignore
    public Btn_Preview: AppellPreviewBtn;
    private _index: number;
    private _honerView: AppellView;
    public isShowDetail: boolean = false;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        this.Btn_Equipon.onClick(this, this.onEquipTitle);
        this.Btn_Equipoff.onClick(this, this.offEquipTitle);
        // this.parent.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);

    }

    private offEvent() {
        this.Btn_Equipon.offClick(this, this.onEquipTitle);
        this.Btn_Equipoff.offClick(this, this.offEquipTitle);
        // this.parent.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
    }

    private onListItemClick() {
        let list = this.parent as fgui.GList;
        if (list.selectedIndex != this._index) {
            this.showDetail.selectedIndex = 0;
        }
    }

    /**
     * 装备称号
     */
    private onEquipTitle(evt) {
        if (!this._cellData) return;
        AppellSocketOutManager.exchangeAppell(this._cellData.TemplateId);
        evt.stopPropagation();
    }

    /**
     * 显示详情
     */
    public onShowDetail(selected: boolean) {
        this.isShowDetail = selected;
        // if (this._cellData && this._cellData.isGet) {
        if (selected) {
            // let isShow = this.showDetail.selectedIndex == 1 ? 0 : 1;
            this.showDetail.selectedIndex = 1;
            // this.appellDetailLeft.c1.selectedIndex = 1;
            // this.appellDetailLeft.title.text = LangManager.Instance.GetTranslation("yishi.view.tips.AppellInfoTips.AppellTopDescribeTxt");
            if (this._honerView) {
                ObjectUtils.disposeObject(this._honerView)
                this._honerView = null;
            }
            this._honerView = new AppellView(this._cellData.ImgWidth, this._cellData.ImgHeight, this._cellData.TemplateId);
            this._honerView.x = this.appellDetailLeft.appellMovie.x
            this._honerView.y = this.appellDetailLeft.appellMovie.y
            this.appellDetailLeft.displayObject.addChild(this._honerView);
            // this.appellDetailRight.title.text = LangManager.Instance.GetTranslation("yishi.view.tips.AppellInfoTips.AppellTopDescribeTxt");

            let hasProps: boolean = false;
            let list = this.appellDetailRight.list_prop;
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
            this.appellDetailRight.visible = hasProps;
            if (this.grayed) {
                // this.grayed = true;
                list.filters = [UIFilter.grayFilter]
                this._honerView.filters = [UIFilter.grayFilter]
            } else {
                list.filters = []
                this._honerView.filters = []
            }
        } else {
            this.showDetail.selectedIndex = 0;
        }
        this.detailGroup.ensureBoundsCorrect();
        this.subGroup.ensureBoundsCorrect();
        this.mainGroup.ensureBoundsCorrect();
        // }
    }

    /**
     * 卸下称号
     * @param evt 
     * @returns 
     */
    private offEquipTitle(evt) {
        if (!this._cellData) return;
        AppellSocketOutManager.exchangeAppell(0);
        evt.stopPropagation();
    }

    public set index(index: number) {
        this._index = index;
    }

    public set itemData(value: t_s_appellData) {
        this._cellData = value;
        this.appellTitle.text = value.TitleLang;
        this.appellDes.text = value.DescriptLang;
        if (!value.isGet) {
            this.grayed = true;
            // this.enabled = !this.grayed;
            if (AppellManager.Instance.model.needShowProgress(value.CondtionType)) {
                this.progress.text = value.getProgress();// "(" + _data.progress + " / " + _data.Para + ")";
            } else {
                this.progress.text = ""
            }
            this.isEquiped.selectedIndex = 0;
        } else {
            this.grayed = false;
            // this.enabled = !this.grayed;
            this.progress.text = "";
            this.isEquiped.selectedIndex = value.isEquiped ? 2 : 1;
        }
        ToolTipsManager.Instance.register(this.Btn_Preview);
        this.Btn_Preview.startPoint = new Laya.Point(0, 0);
        this.Btn_Preview.tipData = value;
        this.Btn_Preview.visible = value.PerfixLang != "";
    }

    dispose() {
        this.offEvent();
        ToolTipsManager.Instance.unRegister(this.Btn_Preview, true);
        super.dispose();
    }

}


/**
 * 预览按钮
 */
export class AppellPreviewBtn extends FUI_AppellPreviewBtn implements ITipedDisplay {

    tipType: EmWindow = EmWindow.Appelltips;
    tipData: any;
    showType?: TipsShowType = TipsShowType.onClick;
    canOperate?: boolean;
    extData?: any;
    startPoint?: Laya.Point;
    iSDown?: boolean;
    isMove?: boolean;
    mouseDownPoint?: Laya.Point;
    moveDistance?: number;
    tipDirctions?: string;
    tipGapV?: number;
    tipGapH?: number;
    //@ts-ignore
    data: Object;

    onConstructor() {
        super.onConstruct();
    }

    dispose() {
        super.dispose();
    }


}
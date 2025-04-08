import FUI_PlayerEquipCell from "../../../../fui/Base/FUI_PlayerEquipCell";
import Utils from "../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BagType } from "../../constant/BagDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import { GoodsType } from "../../constant/GoodsType";
import GTabIndex from "../../constant/GTabIndex";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import MediatorMananger from "../../manager/MediatorMananger";
import { TempleteManager } from '../../manager/TempleteManager';
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { BaseItem } from "./BaseItem";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/24 15:24
 * @ver 1.0
 *
 */
export class PlayerEquipCell extends FUI_PlayerEquipCell {
    //@ts-ignore
    public item: BaseItem;

    private _info: GoodsInfo;
    public preTemp: number = 0;
    public sonType: number = 0;

    public static NAME: string = "cell.view.playerequip.PlayerEquipCell";
    private _registed: boolean = false;
    private _mediatorKey: string = "";
    protected _acceptDrop: boolean = false;

    constructor() {
        super();
        this.displayObject["dyna"] = true;
    }

    protected onConstruct() {
        super.onConstruct();

        this.item.bagType = BagType.HeroEquipment;
        this.item.canOperate = false;
        this.initEvent();
        this.setNormal();
        Utils.setDrawCallOptimize(this);
    }

    private initEvent() {
        this.btn_upgrade.onClick(this, this.onBtnUpgradeClick);
    }

    get info(): GoodsInfo {
        return this._info;
    }

    set info(value: GoodsInfo) {
        this._info = value;

        this.item.info = value;
        this.item.isActive.selectedIndex = 0;//不显示时装和坐骑的已激活标识
        if (value) {
            this.preTemp = value.id;
            this.setTipStyle(value.templateInfo);
            this._titleObject.visible = false;
        }
        else {
            this.preTemp = 0;
            this._titleObject.visible = true;
            this.btn_upgrade.visible = false;
        }

        if (!this._registed && this._acceptDrop) {
            this.registerMediator();
        }

        // if (value && value.templateInfo && value.templateInfo.isCanbeUpgrade && (value.userId == ArmyManager.Instance.thane.userId)) {
        //     let upGradeComposeTemId = TempleteManager.Instance.getUpGradeComposeTemId(value.templateInfo.TemplateId);
        //     if (upGradeComposeTemId && GoodsManager.Instance.checkEquipUpgrade(upGradeComposeTemId)) {
        //         this.btn_upgrade.visible = true;
        //         this.btn_upgrade.selected = true;
        //     }
        //     else {
        //         this.btn_upgrade.visible = true;
        //         this.btn_upgrade.selected = false;
        //     }
        // } else {
        //     this.btn_upgrade.visible = false;
        // }
        //【背包装备栏可进阶装备的快捷跳转取消】  https://www.tapd.cn/36229514/prong/stories/view/1136229514001048627
        this.btn_upgrade.visible = false;
    }

    protected setTipStyle(temp: t_s_itemtemplateData) {
        if(!temp){
            return;
        }
        if (temp.MasterType == GoodsType.EQUIP || temp.MasterType == GoodsType.HONER) {
            if (this._acceptDrop) {
                this.item.tipType = EmWindow.EquipTip;
            }
            else {
                this.item.tipType = EmWindow.EquipContrastTips;
            }
        }
        else if (temp.MasterType == GoodsType.PROP || temp.MasterType == GoodsType.PET_CARD) {
            if (temp.SonType == GoodsSonType.SONTYPE_RUNNES) {
                //符文
                // this.item.tipType = EmWindow.RuneTip;
            }
            else {
                this.item.tipType = EmWindow.PropTips;
            }
        }
    }

    public set acceptDrop(value: boolean) {
        this._acceptDrop = value;
    }

    private onBtnUpgradeClick() {
        FrameCtrlManager.Instance.open(EmWindow.Forge, { tabIndex: GTabIndex.Forge_HC_ZBJJ, materialId: this.info.templateId });
    }

    public setNormal() {
        if (this.activeBack) {
            this.activeBack.visible = false;
            this.activeBack.playing = false;
        }
    }

    public setFocus() {
        if (this.activeBack) {
            this.activeBack.visible = true;
            this.activeBack.playing = true;
        }
    }

    private registerMediator() {
        this._registed = true;
        var arr: any[] = [
            // PlayerEquipBagCellDropMediator,
            // PlayerEquipBagCellClickMediator,
            // PlayerBagCellLightMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, PlayerEquipCell.NAME);
    }

    private unRegisterMediator() {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    }

    dispose() {
        this.item.dispose();
        this._info = null;
        this.unRegisterMediator();
        super.dispose();
    }
}
import FUI_RuneBagCell from "../../../../fui/Base/FUI_RuneBagCell";
import LangManager from "../../../core/lang/LangManager";
import { StoreBagCellClickMediator } from "../../cell/mediator/storebag/StoreBagCellClickMediator";
import { ItemSelectState } from "../../constant/Const";
import { RuneEvent } from "../../constant/event/NotificationEvent";
import { GoodsType } from "../../constant/GoodsType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import MediatorMananger from "../../manager/MediatorMananger";
import { NotificationManager } from "../../manager/NotificationManager";
import { Enum_BagGridState } from "../../module/bag/model/Enum_BagState";
import { TipsShowType } from "../../tips/ITipedDisplay";
import { GoodsCheck } from "../../utils/GoodsCheck";
import { BaseItem } from "./BaseItem";

/**
 * 符文石背包列表子项
 */
export class RuneBagCell extends FUI_RuneBagCell {
    public item: BaseItem;
    protected _registed: boolean = false;
    // protected _mediatorKey: string;
    private _info: GoodsInfo;
    /**背包状态, -1: 未解锁；  0: 空格子；  1: 有道具*/
    private _state:number = Enum_BagGridState.Lock;
    public static NAME: string = "cell.view.runeGemBag.RuneBagCell";

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();

        this.heroEquipIcon.visible = false;
        this.item.needShowBetterImg = false;
        this.item.getChild('back').visible = false;
    }

    get info(): GoodsInfo {
        return this._info;
    }

    set info(value: GoodsInfo) {
        this._info = value;

        this.item.showType = TipsShowType.onClick;
        this.item.info = value;
        // if (!this._registed) {
        //     this.registerMediator();
        // }
        if (value) {
            let template = value.templateInfo
            if (template.MasterType == GoodsType.EQUIP || template.MasterType == GoodsType.HONER) {
                this.item.tipType = EmWindow.ForgeEquipTip;
            }
            else if (template.MasterType == GoodsType.PROP) {
                this.item.tipType = EmWindow.RuneTip;
            }
        }

        this.heroEquipIcon.visible = false;
        if (value) {
            if (value.objectId == this.thane.id) {
                this.heroEquipIcon.visible = true;
            }

            let icon: fgui.GLoader = <fgui.GLoader>this.item.getChild("icon");
            if (GoodsCheck.isEquip(value.templateInfo) && !this.checkGoodsByHero(false)) {
                icon.color = "#FF0000";
            }
            else {
                icon.color = "#FFFFFF";
            }
            this.item.getChild('title').text = LangManager.Instance.GetTranslation("public.level3",value.strengthenGrade);
            this.item.profile.visible = false;
        }
        this.item.getChild('title').y = 79;
    }

    private _selectState: ItemSelectState = ItemSelectState.Default;
    public get selectState(): ItemSelectState {
        return this._selectState
    }

    public set selectState(value: ItemSelectState) {
        this._selectState = value;
        if (!this._info) return;
        switch (value) {
            case ItemSelectState.Default:
                this.item.touchable = true;
                this.cSelectState.selectedIndex = 0;
                break;
            case ItemSelectState.Selectable:
                this.item.touchable = false;
                this.cSelectState.selectedIndex = 1;
                this.offClick(this,this.onClickSelect);
                this.onClick(this,this.onClickSelect);
                break;
            case ItemSelectState.Selected:
                this.item.touchable = false;
                this.cSelectState.selectedIndex = 2;
                break;
            default:
                break;
        }
    }

    onClickSelect(){
        if(this.cSelectState.selectedIndex == ItemSelectState.Selectable){
            this.info.selectState = ItemSelectState.Selected;
            this.selectState = ItemSelectState.Selected;
            NotificationManager.Instance.dispatchEvent(RuneEvent.RESOLVE_RUNE_GEM,this._info.pos,this._info.templateInfo.Profile);
        }else if(this.cSelectState.selectedIndex == ItemSelectState.Selected){
            this.selectState = ItemSelectState.Selectable;
            this.info.selectState = ItemSelectState.Selectable;
            NotificationManager.Instance.dispatchEvent(RuneEvent.RESOLVE_RUNE_GEM,this._info.pos,this._info.templateInfo.Profile);
        }
    }

    set state(value:number)
    {
        this._state = value;
        switch(this._state)
        {
            case Enum_BagGridState.Lock:
                this.c2.selectedIndex = 0;
                break;
            case Enum_BagGridState.Empty:
                this.c2.selectedIndex = 1;
                break;
            case Enum_BagGridState.Item:
                this.c2.selectedIndex = 2;
                break;
        }

        // 有物品显示时候, 把最底下的背景隐藏, 少一个九宫格图片的渲染消耗
        // this.bg.visible = this._state != Enum_BagGridState.Item;
    }

    public checkGoodsByHero(popMsg: boolean = true): boolean {
        if (GoodsCheck.isGradeFix(this.thane, this._info.templateInfo, popMsg)) {
            return GoodsCheck.checkGoodsByHero(this._info, this.thane, popMsg);
        }
        return false;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    // 以前双击的方式操作 现在改成在tip上按钮操作
    // protected registerMediator() {
    //     this._registed = true;
    //     var arr: any[] = [
    //         StoreBagCellClickMediator
    //         // StoreBagCellDropMediator
    //     ];
    //     this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, RuneBagCell.NAME);
    // }

    dispose() {
        this.offClick(this,this.onClickSelect);
        this._info = null;
        this.item.dispose();
        // MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        super.dispose();
    }

}
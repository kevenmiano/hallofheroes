// @ts-nocheck
import FUI_PetEquipCell from "../../../../../../fui/Base/FUI_PetEquipCell";
import { BaseItem } from "../../../../component/item/BaseItem";
import { ItemSelectState } from "../../../../constant/Const";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { Enum_BagGridState } from "../../../bag/model/Enum_BagState";
import PetCtrl from "../../control/PetCtrl";

/**
 * 英灵装备ITEM
 */
export class PetEquipCell extends FUI_PetEquipCell {

    // private _petData: PetData;

    private _info: GoodsInfo;
    /**背包状态, -1: 未解锁；  0: 空格子；  1: 有道具*/
    private _state: number = Enum_BagGridState.Lock;
    private _canOperate:boolean = true;
    protected onConstruct() {
        super.onConstruct();
    }

    private get petCtrl(): PetCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    }

    get info(): GoodsInfo {
        return this._info;
    }

    set canOperate(value:boolean){
        this._canOperate = value;
    }

    set info(value: GoodsInfo) {
        this._info = value;
        // this.suit_icon.visible = false;
        if (value) {
            this.state = Enum_BagGridState.Item;
        } else {
            // this.imgStarBg.visible = false;
            // this.list.numItems = 0;
            this.state = Enum_BagGridState.Empty;
            return;
        }

        (this.baseItem as BaseItem).showType = TipsShowType.onClick;
        //对应的部位上已经有装备 显示对比TIPS
        // if(this.petCtrl.curPartInfo && this._info.objectId <= 0){
        if (this.petCtrl.curPartInfo && this._info.objectId <= 0) {
            (this.baseItem as BaseItem).info = value;
            (this.baseItem as BaseItem).tipType = EmWindow.PetEquipContrastTips;
        } else {
            if(this._canOperate){
                (this.baseItem as BaseItem).info = value;
            }else{
                (this.baseItem as BaseItem).newInfo = value;
            }
            (this.baseItem as BaseItem).tipType = EmWindow.PetEquipTip;
        }

        // let cfg = TempleteManager.Instance.getPetEquipSuitData(value.suitId);
        // if (cfg) {
        //     let url = cfg.SuitIcon.split('.')[0] + '_s.png';
        //     this.suit_icon.icon = IconFactory.getCommonIconPath1(url);
        //     this.suit_icon.visible = true;
        // }


        // if (value.templateInfo.Job[0]) {
        //     this.suit_icon.visible = true;
        //     // this.suit_icon.icon = IconFactory.getCommonIconPath1(url);
        //     this.suit_icon.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + value.templateInfo.Job[0]);
        // }

        this.heroEquipIcon.visible = false;
        if (value.strengthenGrade > 0) {
            this.txtLevel.text = '+' + value.strengthenGrade;
            this.txtLevel.visible = true;
        } else {
            this.txtLevel.visible = false;
        }
        // this.imgStarBg.visible = true;
        // this.list.numItems = this._info.star;
    }

    public get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo
    }

    public set maskGray(v: boolean) {
        this.img_gray.visible = v;
    }

    public get maskGray() {
        return this.img_gray.visible;
    }

    set state(value: number) {
        this._state = value;
        switch (this._state) {
            case Enum_BagGridState.Lock:
                this.stateCtrl.selectedIndex = 0;
                break;
            case Enum_BagGridState.Empty:
                this.stateCtrl.selectedIndex = 1;
                this.txtLevel.visible = false;
                // this.suit_icon.visible = false;
                break;
            case Enum_BagGridState.Item:
                this.stateCtrl.selectedIndex = 2;
                break;
        }

        // 有物品显示时候, 把最底下的背景隐藏, 少一个九宫格图片的渲染消耗
        // this.bg.visible = this._state != Enum_BagGridState.Item;
    }

    private _selectState: ItemSelectState = ItemSelectState.Default;
    public get selectState(): ItemSelectState {
        return this._selectState
    }

    public set selectState(value: ItemSelectState) {
        this._selectState = value;
        switch (value) {
            case ItemSelectState.Default:
                this.cSelected.selectedIndex = 0;
                this._info && ((this.baseItem as BaseItem).touchable = true);
                break;
            case ItemSelectState.Selectable:
                this.cSelected.selectedIndex = 1;
                this._info && ((this.baseItem as BaseItem).touchable = false);
                break;
            case ItemSelectState.Selected:
                this.cSelected.selectedIndex = 2;
                break;
            default:
                break;
        }
    }


    dispose() {
        (this.baseItem as BaseItem).dispose();
        this._info = null;
        // this.unRegisterMediator();
        super.dispose();
    }

}
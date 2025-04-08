// @ts-nocheck
import IMediator from "../../../interfaces/IMediator";
import {FashionModel} from "../../../module/bag/model/FashionModel";
import {FrameCtrlManager} from "../../../mvc/FrameCtrlManager";
import {EmWindow} from "../../../constant/UIDefine";
import {NotificationManager} from "../../../manager/NotificationManager";
import {BagNotic, BagType} from "../../../constant/BagDefine";
import {MessageTipManager} from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import {PlayerManager} from "../../../manager/PlayerManager";
import {GoodsManager} from "../../../manager/GoodsManager";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import {TempleteManager} from "../../../manager/TempleteManager";
import {FashionBagCell} from "../../../component/item/FashionBagCell";

/**
 * 时装背包内的物品点击处理
 * */

export class FashionBagCellClickMediator implements IMediator
{
    private _cell:FashionBagCell;

    constructor()
    {
    }

    private get fashionModel():FashionModel
    {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.FashionWnd).data as FashionModel;
    }

    public register(target:Object)
    {
        this._cell = target as FashionBagCell;
        if(this._cell)
        {
            // this._cell.on(Laya.Event.CLICK, this, this.__mouseClickByClicker);
            // this._cell.on(Laya.Event.DOUBLE_CLICK, this, this.__mouseDoubleClick);
        }
    }

    protected __mouseClickByClicker(event:Laya.Event)
    {
        if(!this._cell || !this._cell.info)
        {
            return;
        }
        if(this.fashionModel.scene == FashionModel.SHOP_SCENE)//商城时装界面
        {
            if(this._cell.moveType == FashionModel.TRY_ON && this.fashionModel.isFashion(this._cell.info))
            {
                this.fashionModel.wearFahion(this._cell.info);
            }
            if(this._cell.moveType == FashionModel.GET_OFF)
            {
                this.fashionModel.getOffFashion(this._cell.info);
            }
        }
        else if(this.fashionModel.scene == FashionModel.FASHION_STORE_SCENE)//合成转换界面
        {
            NotificationManager.Instance.sendNotification(BagNotic.DRAG_ITEM, [this._cell, this._cell.info.count]);
        }
    }

    protected __mouseDoubleClick(event:Laya.Event)
    {
        if(!this._cell || !this._cell.info)
        {
            return;
        }
        if(this.fashionModel.scene == FashionModel.SHOP_SCENE)//商城时装界面
        {
            if(this._cell.moveType == FashionModel.TRY_ON && this.fashionModel.isFashion(this._cell.info))
            {
                this.fashionModel.wearFahion(this._cell.info);
            }
            if(this._cell.moveType == FashionModel.GET_OFF)
            {
                this.fashionModel.getOffFashion(this._cell.info);
            }
        }
        else if(this.fashionModel.scene == FashionModel.FASHION_STORE_SCENE)//合成转换界面
        {
            if(this.fashionModel.opState == 1)
            {
                return;
            }
            else if(this.fashionModel.opState == 2)
            {
                this.fashionModel.resetMovieclip();
            }
            if(this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL)//合成
            {
                if(this._cell.info.bagType == BagType.Player)//放进合成区
                {
                    if(this.canMoveToHideBag(this._cell.info, true))
                    {
                        if(this.fashionModel.isFashion(this._cell.info) && this.getFashionLevelByInfo(this._cell.info) == 9)
                        {
                            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.mediator.fashionbag.FashionBagCellClickMediator.limitLevel"));
                        }
                        PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Hide, 0, this.fashionModel.to_pos, 1);
                    }
                }
                else if(this._cell.info.bagType == BagType.Hide)//从合成区取出
                {
                    PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Player, 0, 0, 1);
                }
            }
            if(this.fashionModel.selectedPanel == FashionModel.FASHION_SWITCH_PANEL)//转换
            {
                if(this._cell.info.bagType == BagType.Player || this._cell.info.bagType == BagType.HeroEquipment)//放进转换区
                {
                    if(this.canMoveToHideBag(this._cell.info, false))
                    {
                        PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Hide, 0, this.fashionModel.to_pos, 1);
                    }
                }
                else if(this._cell.info.bagType == BagType.Hide)//从转换区取出
                {
                    PlayerManager.Instance.moveBagToBag(this._cell.info.bagType, this._cell.info.objectId, this._cell.info.pos, BagType.Player, 0, 0, 1);
                }
            }
        }
    }

    /**
     * 是否能放进去合成或者转换
     * @param info:被判断的物品
     * @param soul:是否可以放时装之魄
     * */
    private canMoveToHideBag(info:GoodsInfo, soul:boolean):boolean
    {
        let arr:any[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
        if(arr == null || arr.length <= 0)
        {
            return true;
        }
        let hideInfo:GoodsInfo;
        for(let i:number = 0; i < arr.length; i++)
        {
            if((arr[i] as GoodsInfo).pos != this.fashionModel.to_pos)
            {
                hideInfo = arr[i] as GoodsInfo;
            }
        }
        if(hideInfo == null)
        {
            return true;
        }
        if(info.templateId == FashionModel.FASHION_SOUL && soul)//时装之魄
        {
            if((<GoodsInfo>hideInfo).templateId == FashionModel.FASHION_SOUL)
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.view.compose.oneEquipLess"));
                return false;
            }
            else
            {
                return true;
            }
        }
        else if((<GoodsInfo>hideInfo).templateInfo.SonType != info.templateInfo.SonType &&
            (<GoodsInfo>hideInfo).templateId != FashionModel.FASHION_SOUL)
        {
            if(this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL)
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.FashionComposeView.sontypeCannotCompose"));
                return false;
            }
            else if(this.fashionModel.selectedPanel == FashionModel.FASHION_SWITCH_PANEL)
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.FashionSwitchView.sontypeCannotSwitch"));
                return false;
            }
        }
        return true;
    }

    /**
     * 根据GoodsInfo获得时装的等级
     * */
    private getFashionLevelByInfo(info:GoodsInfo):number
    {
        if(!info)
        {
            return 0;
        }
        if(info.templateId == FashionModel.FASHION_SOUL)
        {
            return 1;
        }
        let skillId:number = info.randomSkill1;
        if(!TempleteManager.Instance.getSkillTemplateInfoById(info.randomSkill1))
        {
            skillId = Number(info.templateInfo.DefaultSkill.split(",")[0]);
        }
        let cfg = TempleteManager.Instance.getSkillTemplateInfoById(skillId)
        if(cfg){
           return cfg.Grades;
        }
        return 0;
    }

    public unregister(target:Object)
    {
        if(this._cell)
        {
            this._cell.off(Laya.Event.DOUBLE_CLICK, this, this.__mouseDoubleClick);
            this._cell.off(Laya.Event.CLICK, this, this.__mouseDoubleClick);
            this._cell = null;
        }
    }
}
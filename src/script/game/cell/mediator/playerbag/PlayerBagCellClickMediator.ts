// @ts-nocheck
import IMediator from "../../../interfaces/IMediator";
import {PlayerBagCell} from "../../../component/item/PlayerBagCell";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import Logger from "../../../../core/logger/Logger";
import {ThaneInfo} from "../../../datas/playerinfo/ThaneInfo";
import {BagHelper} from "../../../module/bag/utils/BagHelper";
import {GoodsType} from "../../../constant/GoodsType";
import {PlayerBufferManager} from "../../../manager/PlayerBufferManager";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import {GoodsCheck} from "../../../utils/GoodsCheck";
import UIManager from "../../../../core/ui/UIManager";
import {RoleModel} from "../../../module/bag/model/RoleModel";
import {Enum_BagState} from "../../../module/bag/model/Enum_BagState";
import {PlayerBufferInfo} from "../../../datas/playerinfo/PlayerBufferInfo";
import {ArrayConstant, ArrayUtils} from "../../../../core/utils/ArrayUtils";
import {ConfigType} from "../../../constant/ConfigDefine";
import {BagModel} from "../../../module/bag/model/BagModel";
import {MopupManager} from "../../../manager/MopupManager";
import {NotificationManager} from "../../../manager/NotificationManager";
import {PlayerManager} from "../../../manager/PlayerManager";
import {ArmyManager} from "../../../manager/ArmyManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import {NotificationEvent} from "../../../constant/event/NotificationEvent";
import {EmWindow} from "../../../constant/UIDefine";
import {BagType} from "../../../constant/BagDefine";
import {PlayerModel} from "../../../datas/playerinfo/PlayerModel";
import {t_s_itemtemplateData} from "../../../config/t_s_itemtemplate";
import {PlayerInfo} from "../../../datas/playerinfo/PlayerInfo";
import GoodsSonType from "../../../constant/GoodsSonType";
import {MessageTipManager} from "../../../manager/MessageTipManager";
import {SocketSendManager} from "../../../manager/SocketSendManager";
import {GoodsManager} from "../../../manager/GoodsManager";
import {ResourceManager} from "../../../manager/ResourceManager";
import { SRoleWnd } from "../../../module/sbag/SRoleWnd";


/**
 * 领主背包的物品单双击处理
 * */
export class PlayerBagCellClickMediator implements IMediator
{
    private _cell:PlayerBagCell;

    constructor()
    {
    }

    public register(target:Object)
    {
        this._cell = target as PlayerBagCell;
        if(this._cell)
        {
            // this._cell.displayObject.on(Laya.Event.CLICK, this, this.onClick);
            this._cell.displayObject.on(Laya.Event.DOUBLE_CLICK, this, this.onDoubleClick);
        }
    }

    public unregister(target:Object)
    {
        this._cell = target as PlayerBagCell;
        if(this._cell)
        {
            // this._cell.displayObject.off(Laya.Event.CLICK, this, this.onClick);
            // this._cell.displayObject.off(Laya.Event.DOUBLE_CLICK, this, this.onDoubleClick);
        }
        this._cell = null;
    }

    /**
     * 单击事件的处理
     * */
    protected onClick(e:Laya.Event)
    {
        // var isDownAlt	:boolean// 	= KeyboardManager.isDown(Keyboard.ALTERNATE);
        // var isDownShift	:boolean 	= KeyboardManager.isDown(Keyboard.SHIFT);//是否按Shift键
        // var isSelling	:boolean 	= BagHelper.instance.isSelling;//是否出售
        // if(isSelling)return;
        // var data:GoodsInfo = _cell.data;
        // if(!data) return;
        // if(GoodsManager.instance.isSellPos(data.pos)) return;
        // if(isDownShift && data.templateId != ShopGoodsInfo.SMALL_BUGLE_TEMP_ID && data.templateId != ShopGoodsInfo.BIG_BUGLE_TEMP_ID)
        // {
        // 	NotificationManager.instance.sendNotification(ChatEvent.SEND_GOODS,data);
        // 	return;
        // }
        // var isCanSplite	:boolean 	= BagHelper.instance.canSplite(data);
        // if(isDownAlt && isCanSplite)
        // {
        // 	e.stopImmediatePropagation();
        // 	var frame:SpliteItemFrame = ComponentFactory.Instance.creatComponentByStylename("core.SpliteItemFrame");
        // 	frame.data = _cell;
        // 	frame.show();
        // 	return;
        // }
        // if(data.templateInfo.SonType== GoodsSonType.SONTYPE_NOVICE_BOX)
        // {
        // 	FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.NOVICE_GRADE_BOX,null,data);
        // }
        // else if(data.templateInfo.MasterType == GoodsType.PROP || data.templateInfo.MasterType == GoodsType.PET_CARD)
        // {
        // 	var point:Point = _cell.parent.localToGlobal(new Point(_cell.x,_cell.y));
        // 	if(BagHelper.checkCanUseGoods(data.templateInfo.SonType))
        // 	{
        // 		var b:boolean = data.templateInfo.IsCanBatch;
        // 		if(data.templateInfo.SonType == GoodsSonType.SONTYPE_BOX)
        // 		{
        // 			var num:number;
        // 			switch(data.templateInfo.Property2)
        // 			{
        // 				case -800:
        // 					num = number(thane.gloryPoint/data.templateInfo.Property3);
        // 					break;
        // 				case -700:
        // 					num = number(playerInfo.strategy/data.templateInfo.Property3);
        // 					break;
        // 				case -600:
        // 					num = number(ResourceManager.instance.waterCrystal.count/data.templateInfo.Property3);
        // 					break;
        // 				case -500:
        // 					num = number(playerInfo.giftToken/data.templateInfo.Property3);
        // 					break;
        // 				case -400:
        // 					num = number(playerInfo.point/data.templateInfo.Property3);
        // 					break;
        // 				case -300:
        // 					num = number(playerInfo.strategy/data.templateInfo.Property3);
        // 					break;
        // 				case -200:
        // 					num = number(playerInfo.mineral/data.templateInfo.Property3);
        // 					break;
        // 				case -100:
        // 					num = number(ResourceManager.instance.gold.count/data.templateInfo.Property3)
        // 					break;
        // 				default:
        // 					num = number(GoodsManager.instance.getGoodsNumByTempId(data.templateInfo.Property2)/data.templateInfo.Property3);
        // 					break;
        //
        // 			}
        // 			var num2:number = Math.min(num,data.count);
        // 			if(num2>1)
        // 			{
        // 				b = true;
        // 			}
        // 		}
        // 		showUseMenu(point.x + _cell.icon.iconWidth - 10,point.y + _cell.icon.iconHeight - 10,_cell,b);
        // 		return;
        // 	}
        // 	else if(BagHelper.checkisOnlyMove(data.templateInfo.SonType))
        // 	{
        // 		NotificationManager.instance.sendNotification(BagNotic.DRAG_ITEM,[_cell,data.count]);
        // 	}
        // }
        // else
        // {
        // 	NotificationManager.instance.sendNotification(BagNotic.DRAG_ITEM,[_cell,data.count]);
        // }
    }

    /**
     * 双击事件的处理
     * */
    protected onDoubleClick(e:Laya.Event)
    {
        let info:GoodsInfo = this._cell.info;
        if(!info)
        {
            return;
        }

        //如果打开了工会仓库, 就走ConsortiaBagDoubleClickMediator的流程, 不使用物品
        // if(FrameCtrlManager.Instance.isOpen(EmWindow.ConsortiaStorageWnd))
        // {
        //     return;
        // }
        //没打开战斗守护, 则双击无效
        let isShow:boolean = false;
        // let wnd:SRoleWnd = UIManager.Instance.FindWind(EmWindow.SRoleWnd);
        // if(wnd && wnd.isShowing && wnd.isOpenBattleGuard()){
        //     isShow = true;
        // }
        if(!isShow)
        {
            return;
        }

        Logger.yyz("双击！");
        if(!info)
        {
            return;
        }

        if(BagModel.bag_state != Enum_BagState.Default)
        {
            return;
        }

        NotificationManager.Instance.sendNotification(NotificationEvent.DOUBLE_CLICK, info);

        if(BagHelper.checkCanUseGoods(info.templateInfo.SonType))
        {
            let str:string = "";

            if(info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX &&
                !GoodsCheck.isGradeFix(ArmyManager.Instance.thane, info.templateInfo, false))
            {
                str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command01");
                MessageTipManager.Instance.show(str);//您的等级不够
                return;
            }

            if(info.templateInfo.SonType == GoodsSonType.SONTYPE_CONSORTIATIME_CARD && ((this.model.sysCurTimeBySecond - this.playerInfo.lastOutConsortia) >= 24 * 3600 || !this.playerInfo.isAuto))//盟约之证
            {
                str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command05");
                MessageTipManager.Instance.show(str);
                return
            }

            if(info.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX)//等级宝箱
            {
                SocketSendManager.Instance.sendUseItem(info.pos);
                // FrameCtrlManager.Instance.openControllerByInfo(UIModuleTypes.NOVICE_GRADE_BOX,null,info);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_BLOOD)
            {
                SocketSendManager.Instance.sendUseItem(info.pos);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP)
            {
                // TreasureMapManager.Instance.useTreasureMap(data);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX)  //消耗道具使用宝箱
            {
                switch(info.templateInfo.Property2)
                {
                    case -800: //荣耀水晶
                        if(this.thane.gloryPoint < info.templateInfo.Property3)
                        {
                            //荣耀水晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -700: //经验
                        if(ResourceManager.Instance.gold.count < info.templateInfo.Property3)
                        {
                            //经验不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -600: //光晶
                        if(ResourceManager.Instance.waterCrystal.count < info.templateInfo.Property3)
                        {
                            //光晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -500: //绑定钻石
                        if(this.playerInfo.giftToken < info.templateInfo.Property3)
                        {
                            //绑定钻石不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -400: //钻石
                        if(this.playerInfo.point < info.templateInfo.Property3)
                        {
                            //钻石不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -300: //战魂
                        if(ResourceManager.Instance.gold.count < info.templateInfo.Property3)
                        {
                            //战魂不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -200: //紫晶
                        if(this.playerInfo.mineral < info.templateInfo.Property2)
                        {
                            //紫晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    case -100: //黄金
                        if(ResourceManager.Instance.gold.count < info.templateInfo.Property3)
                        {
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                    default:
                        if(GoodsManager.Instance.getGoodsNumByTempId(info.templateInfo.Property2) < info.templateInfo.Property3)
                        {
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08"); //开启宝箱需要消耗的物品不足, 不能开启
                            MessageTipManager.Instance.show(str);
                        }
                        else
                        {
                            this.useBoxAlert(info);
                        }
                        break;
                }
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_VIP_BOX)
            {
                if(MopupManager.Instance.model.isMopup)
                {
                    str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                // MaskUtils.instance.maskShow(0);
                SocketSendManager.Instance.sendUseVipMoney();
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_ROSE)
            {
                // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.FRIENDS,openRosePresentCall,[info]);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_RENAME_CARD)
            {
                UIManager.Instance.ShowWind(EmWindow.RenameWnd, RoleModel.TYPE_RENAME_CARD);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD)
            {
                // MountsManager.instance.sendUseGoods(info);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_SEX_CHANGE_CARD)//使用变性卡
            {
                SocketSendManager.Instance.sendUseSexChangeCard(info.pos);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL)
            {
                // FrameControllerManager.instance.armyController.startFrameByType(ArmyPanelEnum.SKILL_PANEL, 1);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_EXP_BOOK)
            {
                // checkForUsePetExpBook(info);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_LAND_TRANSFER)
            {
                // checkForUsePetLandTransfer(info);
            }
            else if(info.templateInfo.SonType == GoodsSonType.SONTYPE_SINGLE_PASS_BUGLE)
            {
                // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.SINGLEPASS, SinglePassModel.BUGLE_FRAME);
            }
            else if(this.check())
            {
                let itemBuffer:PlayerBufferInfo = PlayerBufferManager.Instance.getItemBufferInfo(info.templateInfo.Property1);
                if(itemBuffer)
                {
                    if(info.templateInfo.Property3 < itemBuffer.grade)
                    {
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command02");
                        MessageTipManager.Instance.show(str);
                        return;
                    }
                    SocketSendManager.Instance.sendUseItem(info.pos);
                }
                else
                {
                    if(info.templateInfo.Property1 == 5 && info.templateInfo.Property2 > 0)
                    {
                        let wearyGet:number = info.templateInfo.Property2;
                        let pos:number = info.pos;
                        let itemCount:number = 1;
                        if(!this.checkWearyCanGet(wearyGet, pos, itemCount))
                        {
                            return;
                        }
                        else
                        {
                            if(!this.checkWearyTodayCanGet(wearyGet, pos, itemCount))
                            {
                                return;
                            }
                        }
                    }
                    SocketSendManager.Instance.sendUseItem(info.pos);
                }
            }
            return;
        }

        if(!this.checkGoodsByHero())
        {
            return;
        }

        if(!GoodsCheck.checkGoodsCanEquip(info, ArmyManager.Instance.thane, false))
        {
            return;
        }
        if(!GoodsCheck.isGradeFix(ArmyManager.Instance.thane, info.templateInfo, true))
        {
            return;
        }

        let to_pos:number = -1;
        if(info.templateInfo.SonType == GoodsSonType.SONTYPE_RUNNES)
        {
            // FrameControllerManager.instance.armyController.frame['defaultContent'] = ArmyPanelEnum.EQUIP_PANEL;
            let existRunes:GoodsInfo = GoodsManager.Instance.getBattleRunesByTempId(info.templateId);
            to_pos = GoodsManager.Instance.getEmputyBattleRunesPos();
            if(existRunes && existRunes.count != existRunes.templateInfo.MaxCount)
            {
                let count:number = existRunes.templateInfo.MaxCount - existRunes.count;
                count = info.count > count ? count : info.count;
                // SoundManager.Instance.play(SoundIds.BAG_EQUIP_SOUND, 0);
                // if(!info.isBinds)
                // {
                //     let arr1:any[];
                //     arr1 = [];
                //     arr1.push(this._cell.item.bagType);
                //     arr1.push(this._cell.item.objectId);
                //     arr1.push(this._cell.item.pos);
                //     arr1.push(BagType.Battle);
                //     arr1.push(ArmyManager.Instance.thane.id);
                //     arr1.push(existRunes.pos);
                //     arr1.push(count);

                //     let confirm1:string = LangManager.Instance.GetTranslation("public.confirm");
                //     let cancel1:string = LangManager.Instance.GetTranslation("public.cancel");
                //     let prompt1:string = LangManager.Instance.GetTranslation("public.prompt");
                //     let content1:string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
                //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, arr1, prompt1, content1, confirm1, cancel1, this.startMoveBagToBag.bind(this));
                // }
                // else
                // {
                    // fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
                    // fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
                    PlayerManager.Instance.moveBagToBag(this._cell.item.bagType, this._cell.item.objectId, this._cell.item.pos, BagType.Battle, this.thane.id, existRunes.pos, count);
                // }
            }
            else if(to_pos != -1)
            {
                // SoundManager.Instance.play(SoundIds.BAG_EQUIP_SOUND, 0);
                // if(!info.isBinds)
                // {
                //     let arr2:any[];
                //     arr2 = [];
                //     arr2.push(this._cell.item.bagType);
                //     arr2.push(this._cell.item.objectId);
                //     arr2.push(this._cell.item.pos);
                //     arr2.push(BagType.Battle);
                //     arr2.push(ArmyManager.Instance.thane.id);
                //     arr2.push(to_pos);
                //     arr2.push(info.count);

                //     let confirm2:string = LangManager.Instance.GetTranslation("public.confirm");
                //     let cancel2:string = LangManager.Instance.GetTranslation("public.cancel");
                //     let prompt2:string = LangManager.Instance.GetTranslation("public.prompt");
                //     let content2:string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
                //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, arr2, prompt2, content2, confirm2, cancel2, this.startMoveBagToBag.bind(this));
                // }
                // else
                // {
                    // if(fashionModel.isFashion(info))
                    // {
                    //     fashionModel.selectedPanel = FashionModel.FASHION_PANEL;
                    //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
                    // }
                    // else
                    // {
                    //     fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
                    //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
                    // }
                    PlayerManager.Instance.moveBagToBag(this._cell.item.bagType, this._cell.item.objectId, this._cell.item.pos, BagType.Battle, this.thane.id, to_pos, info.count);
                // }
            }
        }
        else if(info.templateInfo.MasterType == GoodsType.HONER)
        {
            // FrameControllerManager.instance.armyController.frame['defaultContent'] = ArmyPanelEnum.EQUIP_PANEL;
            to_pos = GoodsManager.Instance.getEmputyHonerPos();
            if(to_pos == -1)
            {
                to_pos = 0;
            }
            // SoundManager.Instance.play(SoundIds.BAG_EQUIP_SOUND, 0);
            // fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
            // fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
            PlayerManager.Instance.moveBagToBag(this._cell.item.bagType, this._cell.item.objectId, this._cell.item.pos, BagType.Honer, this.thane.id, to_pos, info.count);
        }
        else
        {
            // FrameControllerManager.instance.armyController.frame['defaultContent'] = ArmyPanelEnum.EQUIP_PANEL;
            let heroBag:any[] = GoodsManager.Instance.getHeroGoodsListByTypeAndId(info.templateInfo.MasterType, this.thane.id).getList();
            let pos_arr:any[] = GoodsSonType.getSonTypePos(info.templateInfo.SonType);
            heroBag = ArrayUtils.sortOn(heroBag, "pos", ArrayConstant.NUMERIC);
            let t_index:number = 0;
            if(pos_arr.length > 1)
            {
                for(const key in heroBag)
                {
                    if(heroBag.hasOwnProperty(key))
                    {
                        let i:GoodsInfo = heroBag[key];
                        if((i.templateInfo.SonType == info.templateInfo.SonType) && (i.pos == pos_arr[0] + t_index))
                        {
                            t_index++;
                        }
                    }
                }
                if(t_index >= pos_arr.length)
                {
                    to_pos = pos_arr[0];
                }
                else
                {
                    to_pos = pos_arr[t_index];
                }
            }
            else
            {
                to_pos = pos_arr[0];
            }
            if(to_pos != -1)
            {
                // SoundManager.Instance.play(SoundIds.BAG_EQUIP_SOUND, 0);
                // if(!info.isBinds)
                // {
                //     let arr:any[];
                //     arr = [];
                //     arr.push(this._cell.item.bagType);
                //     arr.push(this._cell.item.objectId);
                //     arr.push(this._cell.item.pos);
                //     arr.push(BagType.HeroEquipment);
                //     arr.push(this.thane.id);
                //     arr.push(to_pos);
                //     arr.push(1);

                //     let confirm3:string = LangManager.Instance.GetTranslation("public.confirm");
                //     let cancel3:string = LangManager.Instance.GetTranslation("public.cancel");
                //     let prompt3:string = LangManager.Instance.GetTranslation("public.prompt");
                //     let content3:string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
                //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, arr, prompt3, content3, confirm3, cancel3, this.startMoveBagToBag.bind(this));

                // }
                // else
                // {
                    // if(fashionModel.isFashion(info))
                    // {
                    //     fashionModel.selectedPanel = FashionModel.FASHION_PANEL;
                    //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
                    // }
                    // else
                    // {
                    //     fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
                    //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
                    // }
                    PlayerManager.Instance.moveBagToBag(this._cell.item.bagType, this._cell.item.objectId, this._cell.item.pos, BagType.HeroEquipment, this.thane.id, to_pos, 1);
                // }
            }
        }

    }

    private get model():PlayerModel
    {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private get playerInfo():PlayerInfo
    {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane():ThaneInfo
    {
        return ArmyManager.Instance.thane;
    }

    /**
     * 检测物品对于领主来说, 职业、性别是否相符
     * **/
    public checkGoodsByHero(popMsg:boolean = true):boolean
    {
        return GoodsCheck.checkGoodsByHero(this._cell.info, ArmyManager.Instance.thane, popMsg);
    }

    // private get fashionModel():FashionModel
    // {
    //     return FrameControllerManager.instance.fashionCodeController.model;
    // }

    /**
     * 开始物品移动, 是时装就切换到时装页, 是装备就切换到装备页
     * */
    private startMoveBagToBag(b:boolean, flag:boolean, arr:any[])
    {
        if(b)
        {
            // if(fashionModel.isFashion(info))
            // {
            //     fashionModel.selectedPanel = FashionModel.FASHION_PANEL;
            //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
            // }
            // else
            // {
            //     fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
            //     fashionModel.dispatchEvent(FashionEvent.SWITCH_EQUIPVIEW, null);
            // }
            PlayerManager.Instance.moveBagToBag(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
        }
    }

    /**
     *检测物品是否可以使用并给出提示
     */
    private check():boolean
    {
        let str:string = "";
        if(this._cell.info.templateInfo.Property1 == 8 && this.playerInfo.consortiaID == 0)
        {
            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command03");
            MessageTipManager.Instance.show(str);
            return false;
        }
        if(this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_COMPOSE && this.playerInfo.composeList.indexOf(this._cell.info.templateInfo.Property1) >= 0)
        {
            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command04");
            MessageTipManager.Instance.show(str);
            return false;
        }
        if(this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_REWARD_CARD)
        {
            if(MopupManager.Instance.model.isMopup)
            {
                str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                MessageTipManager.Instance.show(str);
                return false;
            }
            // if(rewardModel.baseRewardDic.getList().length >= 1)
            // {
            //     str = LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferTaskItem.command01");
            //     MessageTipManager.Instance.show(str);
            //     return false;
            // }
            // if(rewardModel.remainRewardCount <= 0)
            // {
            //     str = LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferTaskItem.command02");
            //     MessageTipManager.Instance.show(str);
            //     return false;
            // }
        }
        if(this._cell.info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_CARD)
        {
            let petNum:number = this.playerInfo.petList.length;
            if(petNum >= this.playerInfo.petMaxCount)
            {
                str = LangManager.Instance.GetTranslation("usePetCard.MaxNumber");
                MessageTipManager.Instance.show(str);
                return false;
            }
        }
        return true;
    }

    private useBoxAlert(data:any)
    {
        let confirm_box:string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel_box:string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt_box:string = LangManager.Instance.GetTranslation("public.prompt");
        let itemconfig:t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, data.templateInfo.Property2);
        let costName:string = itemconfig.TemplateNameLang;
        let content_box:string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command09", 1, data.templateInfo.TemplateName, 1 * data.templateInfo.Property3, costName);
        SimpleAlertHelper.Instance.Show(undefined, data, prompt_box, content_box, confirm_box, cancel_box, this.checkForUseBox.bind(this));
    }

    private checkForUseBox(b:boolean, flag:boolean, data:any)
    {
        if(b)
        {
            SocketSendManager.Instance.sendUseItem(data.pos);
        }
    }

    private checkWearyCanGet(wearyGet:number, pos:number, count:number = 1):boolean
    {
        // let wearyCanGet:number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
        // if(wearyGet > wearyCanGet)
        // {
        //     // let confirm:string = LangManager.Instance.GetTranslation("public.confirm");
        //     // let cancel:string = LangManager.Instance.GetTranslation("public.cancel");
        //     // let prompt:string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
        //     // let content:string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
        //     // SimpleAlertHelper.Instance.Show(undefined, [wearyGet, pos, count], prompt, content, confirm, cancel, this.wearyCanGetCallBack.bind(this));
        //     return false;
        // }
        return true;
    }

    private checkWearyTodayCanGet(wearyGet:number, pos:number, count:number = 1):boolean
    {
        // let wearyTodayCanGet:number = PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
        // if(wearyGet > wearyTodayCanGet)
        // {
        //     let confirm:string = LangManager.Instance.GetTranslation("public.confirm");
        //     let cancel:string = LangManager.Instance.GetTranslation("public.cancel");
        //     let prompt:string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
        //     let content:string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command06", PlayerInfo.WEARY_GET_MAX, wearyTodayCanGet);
        //     SimpleAlertHelper.Instance.Show(undefined, [wearyGet, pos, count, true], prompt, content, confirm, cancel, this.wearyTodayCanGetCallBack.bind(this));
        //     return false;
        // }
        return true;
    }

    private wearyCanGetCallBack(b:boolean, flag:boolean, data:any)
    {
        if(b)
        {
            let wearyGet:number = data[0];
            let pos:number = data[1];
            let count:number = data[2];
            if(this.checkWearyTodayCanGet(wearyGet, pos, count))
            {
                SocketSendManager.Instance.sendUseItem(pos, count);
            }
        }
    }

    private wearyTodayCanGetCallBack(b:boolean, flag:boolean, data:any)
    {
        if(b)
        {
            let wearyGet:number = data[0];
            let pos:number = data[1];
            let count:number = data[2];
            let today:number = data[3];
            SocketSendManager.Instance.sendUseItem(pos, count);
        }
    }

    // private get rewardModel():OfferRewardModel
    // {
    //     return OfferRewardManager.instance.model;
    // }
}
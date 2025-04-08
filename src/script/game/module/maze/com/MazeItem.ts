// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-02-21 17:59:30
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-28 17:37:35
 * @Description: 
 */
import FUI_MazeItem from '../../../../../fui/Maze/FUI_MazeItem';
import LangManager from '../../../../core/lang/LangManager';
import Logger from '../../../../core/logger/Logger';
import SimpleAlertHelper from '../../../component/SimpleAlertHelper';
import GoodsSonType from '../../../constant/GoodsSonType';
import { EmWindow } from '../../../constant/UIDefine';
import { TowerInfo } from '../../../datas/playerinfo/TowerInfo';
import { GoodsManager } from '../../../manager/GoodsManager';
import { MessageTipManager } from '../../../manager/MessageTipManager';
import { MopupManager } from '../../../manager/MopupManager';
import { PlayerManager } from '../../../manager/PlayerManager';
import { RoomSocketOuterManager } from '../../../manager/RoomSocketOuterManager';
import { TempleteManager } from '../../../manager/TempleteManager';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import ComponentSetting from '../../../utils/ComponentSetting';
import { eMopupType, eMopupState } from '../../mopup/MopupData';
import { ShopGoodsInfo } from '../../shop/model/ShopGoodsInfo';
import MazeModel, { EmMazeType } from '../MazeModel';

export default class MazeItem extends FUI_MazeItem {
    private _vdata: TowerInfo;
    private _type: EmMazeType;
    public set type(type: EmMazeType) {
        this._type = type;
        this.initView();
    }

    protected onConstruct(): void {
        super.onConstruct()
        this.MyRecordTxt.text = LangManager.Instance.GetTranslation("MazeFrameWnd.MyRecordTxt");
        this.CurrentFloorTxt.text = LangManager.Instance.GetTranslation("MazeFrameWnd.CurrentFloorTxt");
        this.TotalExpTxt.text = LangManager.Instance.GetTranslation("MazeFrameWnd.TotalExpTxt");
        this.DoubleProfitTxt.text = LangManager.Instance.GetTranslation("MazeFrameWnd.GetDoubleProfitTxt");
        this.Btn_Reset.onClick(this, this.__resetHandler.bind(this));
        this.Btn_Start.onClick(this, this.__startHandler.bind(this));
        this.Btn_MopupStart.onClick(this, this.__startMopupHandler.bind(this));
        this.Btn_Continue.onClick(this, this.__continueHandler.bind(this));
        this.Btn_MopupContinue.onClick(this, this.__continueMopupHandler.bind(this));
        this.DoubleProfit.on(fgui.Events.STATE_CHANGED, this, this.__doubleProfitHandler);
    }

    protected __doubleProfitHandler(e: Laya.Event) {
        if(this._vdata.maxIndex == 0 && this._vdata.towerIndex == 0){//首次
            this.DoubleProfit.selected = true;
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MazeItem.DoubleProfitHandler.tips"))
        }
    }

    private initView() {
        this.TitleTxt.color = this._type == EmMazeType.GroundMaze ? "#A4CBE2" : "#F3D783";
        this.TitleTxt.text = LangManager.Instance.GetTranslation("MazeFrame.BtnGroupName" + this._type);
        this.TodayFreeCountTxt.text = LangManager.Instance.GetTranslation(this._type == EmMazeType.AbyssMaze ? "MazeFrameWnd.TodayFreeCountTxt1" : "MazeFrameWnd.TodayFreeCountTxt");
        if (this._type == EmMazeType.AbyssMaze) {
            this.groundDoubleProfitG.visible = false;
            let str = "";
            if (!ComponentSetting.ABYSS_MAZE) {
                str = LangManager.Instance.GetTranslation("public.unopen2");
            } else {
                let hasMaze2Info = PlayerManager.Instance.currentPlayerModel.towerInfo2.campaignId != 0;
                if (!hasMaze2Info) {
                    str = LangManager.Instance.GetTranslation("maze.MazeFrame.Maze2openContent");
                }
            }
            if (str) {
                this.AbyssOpenTipTxt.text = str;
            }
            this.cOpen.setSelectedIndex(str ? 0 : 1)
        } else {
            this.cOpen.setSelectedIndex(1)
        }
    }

    public set vdata(value: TowerInfo) {
        if (!value) return;
        this._vdata = value;
        Logger.info("MazeItem", value)
        // 我的记录
        let str = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
        this.MyRecordValue.text = this._vdata.maxIndex == 0 ? str : this._vdata.maxIndex.toString();
        // 剩余次数
        let freeCount = (this._vdata.maxEnterCount - this._vdata.enterCount);
        this.TodayFreeCountValue.text = (freeCount > 0 ? freeCount : 0) + "/" + this._vdata.maxEnterCount;

        // 累计经验
        this.TotalExpValue.text = this._vdata.totalGp.toString();
        // 当前层数
        this.CurrentFloorValue.text = this._vdata.towerIndex.toString();

        if(this._vdata.maxIndex == 0 && this._vdata.towerIndex == 0){//首次
            this.DoubleProfitTxt.text = LangManager.Instance.GetTranslation("MazeItem.firstOpenTipTxt");
            this.DoubleProfit.selected = true;
        }else{
            this.DoubleProfitTxt.text = LangManager.Instance.GetTranslation("MazeFrameWnd.GetDoubleProfitTxt");
        }
        // 扫荡未开启(需要手动打)
        if (this._vdata.maxIndex < MazeModel.OPEN_SWEEP_LEVEL) {
            if (this._vdata.towerIndex > 0) {
                this.cMazeOpt.setSelectedIndex(2) // 继续
            } else {
                this.cMazeOpt.setSelectedIndex(0) // 开始
            }
        } else {// 扫荡开启
            if (this._vdata.towerIndex > 0) {
                if (this._vdata.towerIndex == this._vdata.maxIndex && this._vdata.pass !=2) {
                    this.cMazeOpt.setSelectedIndex(2) // 继续
                } else if (this._vdata.towerIndex < this._vdata.maxIndex) {
                    this.cMazeOpt.setSelectedIndex(3) //继续扫荡
                }
            } else {
                this.cMazeOpt.setSelectedIndex(1) // 扫荡
            }
        }

        if (this.cMazeOpt.selectedIndex == 0 || this.cMazeOpt.selectedIndex == 1) {
            if (this._type == EmMazeType.AbyssMaze) {
                this.bg.visible = this.AbyssOpenTipTxt.text!="";
            } else {
                this.bg.visible = true
            }
        }
    }

    private __resetHandler() {
        var content: string = LangManager.Instance.GetTranslation("maze.MazeFrame.content");
        SimpleAlertHelper.Instance.Show(null, { type: this._type }, null, content, null, null, this.__resetHandlerBack.bind(this));
    }

    private __resetHandlerBack(b: boolean, flag: boolean, data: any) {
        if (b) {
            RoomSocketOuterManager.resetTowerInfo(data.type);
        }
    }

    private __startHandler() {
        if (this.checkCanNotEnter()) return;
        if(this._vdata.maxIndex == 0 && this._vdata.towerIndex == 0){
            this.setDoubleProfit()
            FrameCtrlManager.Instance.exit(EmWindow.MazeFrameWnd);
            RoomSocketOuterManager.enterTowerInfo(this._vdata.campaignId, 1, MopupManager.Instance.model.isDoubleProfit);
        }else{
            if (this.checkNeedBuyMazeStone()) {
                let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(MazeModel.MAZE_STONE);
                if (!info) {
                    this.showMazeStoneNotEnoughTip();
                } else {
                    FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: this.needBuyCnt });
                }
            } else {
                this.setDoubleProfit()
                FrameCtrlManager.Instance.exit(EmWindow.MazeFrameWnd);
                RoomSocketOuterManager.enterTowerInfo(this._vdata.campaignId, 1, MopupManager.Instance.model.isDoubleProfit);
            }
        }
    }

    private __startMopupHandler() {
        if (this.checkCanNotEnter()) return;

        if (this.checkNeedBuyMazeStone()) {
            let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(MazeModel.MAZE_STONE);
            if (!info) {
                this.showMazeStoneNotEnoughTip();
            } else {
                FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: this.needBuyCnt });
            }
        } else {
            this.setDoubleProfit()
            this.openMopup()
        }
    }

    private checkCanNotEnter(): boolean {
        if (this._vdata.enterCount >= this._vdata.maxEnterCount) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("maze.MazeFrame.command01"));
            return true;
        }
        return false;
    }

    private checkNeedBuyMazeStone(): boolean {
        let needBuy = this.needBuyCnt > 0
        if (this._type == EmMazeType.GroundMaze) {
            needBuy = this.DoubleProfit.selected && needBuy;
        }
        return needBuy
    }

    private setDoubleProfit() {
        if (this._type == EmMazeType.GroundMaze) {
            MopupManager.Instance.model.isDoubleProfit = this.DoubleProfit.selected ? 2 : 1;
        }
    }

    private get needBuyCnt() {
        let ownCount = GoodsManager.Instance.getGoodsNumBySonType(GoodsSonType.SONTYPE_MAZE);
        let needCount = this._type == EmMazeType.GroundMaze ? MazeModel.MAZE_STONE_USE : MazeModel.MAZE2_STONE_USE;
        return needCount - ownCount;
    }

    private __continueHandler() {
        RoomSocketOuterManager.enterTowerInfo(this._vdata.campaignId, 0);
        FrameCtrlManager.Instance.exit(EmWindow.MazeFrameWnd);
    }

    private __continueMopupHandler() {
        this.setDoubleProfit()
        this.openMopup()
    }

    private openMopup() {
        let MopupCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Mopup)
        MopupCtrl.data.campaignId = this._vdata.campaignId;
        FrameCtrlManager.Instance.open(EmWindow.Mopup, { type: eMopupType.MazeMopup, state: eMopupState.MazeMopupPre }, null, EmWindow.MazeFrameWnd)
    }

    private showMazeStoneNotEnoughTip() {
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mazeframe.coin.countNum"));
    }
}
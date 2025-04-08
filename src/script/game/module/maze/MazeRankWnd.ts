// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import MazeModel, { EmMazeType } from './MazeModel';
import MazeOrderInfo from './MazeOrderInfo';
import MazeRankItem from './com/MazeRankItem';
import UIButton from '../../../core/ui/UIButton';
import Utils from '../../../core/utils/Utils';
import { PathManager } from '../../manager/PathManager';
import ResMgr from '../../../core/res/ResMgr';
import XmlMgr from '../../../core/xlsx/XmlMgr';
import FUIHelper from '../../utils/FUIHelper';
import Logger from '../../../core/logger/Logger';
/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2021-04-27 16:55
*/
export default class MazeRankWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public RankTablist: fgui.GList;
    public RankList: fgui.GList = null;
    public RankTxt: fgui.GTextField;
    public UserNameTxt: fgui.GTextField;
    public PassLayerNumTxt: fgui.GTextField;
    private _type: number;
    private rankTabData: Array<any> = [];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("mainBar.SmallMapBar.rankingBtnTipData");
        this.RankTxt.text = LangManager.Instance.GetTranslation("colosseum.view.HeroRankFrame.rank");
        this.UserNameTxt.text = LangManager.Instance.GetTranslation("colosseum.view.HeroRankFrame.nickName");
        this.PassLayerNumTxt.text = LangManager.Instance.GetTranslation("MazeRankWnd.PassLayerNumTxt");
        this.RankList.setVirtual();
        this.addEvent();
        this.initTabList();
    }

    private addEvent() {
        this.RankList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.RankTablist.on(Laya.Event.CLICK, this, this.__onRankTabClick.bind(this));
        this.RankTablist.itemRenderer = Laya.Handler.create(this, this._onRankTabRender, null, false);
    }

    private initTabList() {
        this.rankTabData = [];
        this.createTabData(EmMazeType.GroundMaze, LangManager.Instance.GetTranslation("MazeFrameWnd.BtnGroupName0"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(EmMazeType.AbyssMaze, LangManager.Instance.GetTranslation("MazeFrameWnd.BtnGroupName1"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.RankTablist.numItems = this.rankTabData.length;
        this.RankTablist.selectedIndex = 0;
        this.reqData(EmMazeType.GroundMaze);
    }

    private createTabData(type: EmMazeType, text: string, iconstr: string, selectedIconstr: string, targetArray: Array<any> = null): any {
        let icon = FUIHelper.getItemURL('Base', iconstr);
        let selectedIcon = FUIHelper.getItemURL('Base', selectedIconstr);
        let obj = {
            type: type,
            title: "[color=#d1b186]" + text + "[/color]",
            selectedTitle: "[color=#fffad6]" + text + "[/color]",
            icon: icon,
            selectedIcon: selectedIcon
        };
        targetArray && targetArray.push(obj);
        return obj;
    }

    /**渲染左侧Tab列表 */
    private _onRankTabRender(idx: number, btnItem: fgui.GButton) {
        let info = this.rankTabData[idx];
        if (info) {
            btnItem.data = info;
            btnItem.title = info.title;
            btnItem.selectedTitle = info.selectedTitle;
            btnItem.icon = info.icon;
            btnItem.selectedIcon = info.selectedIcon;
        }
    }

    private __onRankTabClick(item: fgui.GComponent) {
        let selectItem = this.RankTablist.getChildAt(this.RankTablist.selectedIndex).asButton;
        let data: any = selectItem.data;
        if (!data) return;
        this.reqData(data.type)
    }

    /**打开排行榜 */
    private reqData(type: EmMazeType) {
        this._type = type

        // Logger.info("请求打开迷宫排行榜", type)
        var path: string = PathManager.getMazeOrderPath(this._type);
        ResMgr.Instance.loadRes(path, (res) => {
            if (res) {
                this.mazeModel.mazeOrderList.length = 0;
                let rankData: any = XmlMgr.Instance.decode(res);
                let rankArray: any[] = [];
                if (rankData && rankData.list.item) {
                    rankArray = rankData.list.item;
                }
                for (let i: number = 0; i < rankArray.length; i++) {
                    let itemData: any = rankArray[i];
                    var orderInfo: MazeOrderInfo = new MazeOrderInfo();
                    orderInfo.userId = parseInt(itemData.userId.toString());
                    orderInfo.job = parseInt(itemData.job);
                    orderInfo.nickName = itemData.nickName;
                    orderInfo.consortiaName = itemData.consortiaName;
                    orderInfo.mazeOrder = parseInt(itemData.towerOrder);
                    orderInfo.maxFloor = parseInt(itemData.towerIndex);
                    orderInfo.grades = parseInt(itemData.grades);
                    orderInfo.fightingCapacity = parseInt(itemData.fightingCapacity);
                    orderInfo.isVip = itemData.IsVip == "true";
                    orderInfo.vipType = parseInt(itemData.VipType);
                    this.mazeModel.mazeOrderList.push(orderInfo);

                }
                this.setDataList();
            }
        })
    }

    private get mazeModel(): MazeModel {
        return MazeModel.instance;
    }

    private offEvent() {
        // this.RankList && this.RankList.itemRenderer.recover();
        Utils.clearGListHandle(this.RankList);
    }

    private datalist: Array<MazeOrderInfo> = [];
    setDataList() {
        this.datalist = MazeModel.instance.mazeOrderList;
        if (this.datalist && this.datalist.length)
            this.RankList.numItems = this.datalist.length;
        this.RankList.ensureBoundsCorrect();
    }

    renderListItem(idx: number, item: MazeRankItem) {
        item.type = this._type;
        item.vdata = this.datalist[idx];
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }

    OnShowWind() {
        super.OnShowWind();
    }
}
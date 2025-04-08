import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import WarlordsManager from "../../../manager/WarlordsManager";
import { ShopGoodsInfo } from '../../shop/model/ShopGoodsInfo';
import WarlordsModel from "../WarlordsModel";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { WarlordsEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import WarlordsPlayerItem from "./component/WarlordsPlayerItem";
import WarlordsPlayerInfo from "../WarlordsPlayerInfo";
import ComponentSetting from "../../../utils/ComponentSetting";

/**
 * 众神之战入口主界面
 */
export default class WarlordsMainWnd extends BaseWindow {
    public time: fgui.Controller;
    public c1: fgui.Controller;
    public frame: fgui.GLabel;
    public ShopBtn: fgui.GButton;
    public BetBtn: fgui.GButton;
    public RankBtn: fgui.GButton;
    public RewardBtn: fgui.GButton;
    public ReportBtn: fgui.GButton;
    public joinBtn: fgui.GButton;
    public openStr2: fgui.GTextField;
    public openStr3: fgui.GTextField;
    public openStr4: fgui.GTextField;
    public openStr5: fgui.GTextField;
    public openStr8: fgui.GTextField;
    public openStr9: fgui.GTextField;
    public openTimeTxt: fgui.GTextField;
    public PrelimScoreTxt: fgui.GRichTextField;
    public FinalRankTxt: fgui.GRichTextField;
    public GloryTxt: fgui.GRichTextField;
    public playerList: fgui.GList;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.RankBtn.visible = ComponentSetting.WARLORD;
        this.RewardBtn.x = ComponentSetting.WARLORD ? 171 : 114;
        this.initData();
        this.refresh();
        this.initEvent();
        WarlordsManager.Instance.reqWarlordsMainInfo();
    }

    private initData() {
        this.time = this.getController("time");
        this.c1 = this.getController("c1");
    }

    private initEvent() {
        this.ShopBtn.onClick(this, this.ShopBtnHandler);
        this.BetBtn.onClick(this, this.BetBtnHandler);
        this.RankBtn.onClick(this, this.RankBtnHandler);
        this.RewardBtn.onClick(this, this.RewardBtnHandler);
        this.ReportBtn.onClick(this, this.ReportBtnHandler);
        this.joinBtn.onClick(this, this.joinBtnHandler);
        this.frame.getChild('closeBtn').onClick(this, this.closeBtnHandler);
        this.frame.getChild('helpBtn').onClick(this, this.helpBtnHandler);
        this.thane.addEventListener(PlayerEvent.GLORY_CHANGE, this.gloryUpdateHandler, this);
        this.warlordsModel.addEventListener(WarlordsEvent.INFO_UPDATE, this.warlordsInfoUpdateHandler, this);
        this.playerList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        this.ShopBtn.offClick(this, this.ShopBtnHandler);
        this.BetBtn.offClick(this, this.BetBtnHandler);
        this.RankBtn.offClick(this, this.RankBtnHandler);
        this.RewardBtn.offClick(this, this.RewardBtnHandler);
        this.ReportBtn.offClick(this, this.ReportBtnHandler);
        this.joinBtn.offClick(this, this.joinBtnHandler);
        this.frame.getChild('closeBtn').offClick(this, this.closeBtnHandler);
        this.frame.getChild('helpBtn').offClick(this, this.helpBtnHandler);
        this.thane.removeEventListener(PlayerEvent.GLORY_CHANGE, this.gloryUpdateHandler, this);
        this.warlordsModel.removeEventListener(WarlordsEvent.INFO_UPDATE, this.warlordsInfoUpdateHandler, this);
    }

    renderListItem(index: number, item: WarlordsPlayerItem) {
        if (!item) return;
        item.index = index + 1;
        let itemData = this.warlordsModel.getListData(WarlordsModel.TOP, this.getDataIndex(index + 1)) as WarlordsPlayerInfo;
        item.info = itemData ? itemData.thaneInfo : null;
    }

    private gloryUpdateHandler() {
        this.GloryTxt.setVar("count", this.thane.gloryPoint.toString()).flushVars();
    }

    private warlordsInfoUpdateHandler() {
        this.refresh();
    }

    private refresh() {
        if (this.warlordsModel.process == WarlordsModel.PROCESS_READY) {
            this.time.selectedIndex = 0;
            this.openStr2.setVar("num", this.warlordsModel.period.toString()).flushVars();
            this.openTimeTxt.text = this.warlordsModel.getMatchDateString(1);
        }
        else if (this.warlordsModel.process == WarlordsModel.PROCESS_PRELIM) {
            this.time.selectedIndex = 1;
            this.openStr3.setVar("num", this.warlordsModel.curRound + "/" + this.warlordsModel.totalRound).flushVars();
        }
        else if (this.warlordsModel.process == WarlordsModel.PROCESS_BET) {
            this.time.selectedIndex = 2;
            this.openStr4.setVar("time", this.warlordsModel.getMatchDateString(3)).flushVars();
        }
        else if (this.warlordsModel.process == WarlordsModel.PROCESS_FINAL) {
            this.time.selectedIndex = 3;
            let str: string = LangManager.Instance.GetTranslation(this.warlordsModel.isEnterFinal ? "warlords.WarlordsFrame.str06": "warlords.WarlordsFrame.str07");
            this.openStr5.text =str;
        }
        else if (this.warlordsModel.process == WarlordsModel.PROCESS_OVER) {
            this.time.selectedIndex = 4;
            this.openStr8.setVar("count", this.warlordsModel.period.toString()).flushVars();
        }
        else {
            this.time.selectedIndex = 5;
            this.openStr9.text = LangManager.Instance.GetTranslation("warlords.WarlordsFrame.str09");
        }
        this.PrelimScoreTxt.setVar("count", this.warlordsModel.selfInfo.prelimScore.toString()).flushVars();
        this.FinalRankTxt.setVar("count", this.warlordsModel.selfInfo.sort.toString()).flushVars();
        this.GloryTxt.setVar("count", this.thane.gloryPoint.toString()).flushVars();
        this.playerList.numItems = 3;
        //刷新顶部三个部位的数据
        switch (this.warlordsModel.process) {
            case WarlordsModel.PROCESS_BET:
            case WarlordsModel.PROCESS_FINAL:
            case WarlordsModel.PROCESS_OVER:
                this.c1.selectedIndex = 0;
                break;
            default:
                this.c1.selectedIndex = 1;
        }
    }

    /**
      * 打开商店界面
      */
    private ShopBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.WARLORDS_SHOP });
    }

    /**
     * 竞猜
     */
    private BetBtnHandler() {
        if (this.thane.grades < WarlordsModel.BET_OPEN_GRADE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.BuildingManager.command08", WarlordsModel.BET_OPEN_GRADE));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.WarlordsBetWnd);
    }

    /**
     * 排行榜
     */
    private RankBtnHandler() {
        UIManager.Instance.ShowWind(EmWindow.WarlordsRank);
    }

    /**
     * 奖励列表
     */
    private RewardBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.WarlordsCheckRewardWnd);
    }

    /**
     * 预赛成绩
     */
    private ReportBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.WarlordsPrelimReportWnd);
    }

    /**
     * 开始
     */
    private joinBtnHandler() {
        WarlordsManager.Instance.enterWarlordsRoom();
    }

    private closeBtnHandler() {
        this.OnBtnClose();
    }

    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("warlords.WarlordsFrame.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private getDataIndex(itemIndex: number): number {
        switch (itemIndex) {
            case 1:
                return 3;
                break;
            case 2:
                return 1;
                break;
            case 3:
                return 2;
                break;
            default:
                return itemIndex;
        }
    }

    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
        FrameCtrlManager.Instance.exit(EmWindow.WarlordsBetWnd);
        FrameCtrlManager.Instance.exit(EmWindow.WarlordsPrelimReportWnd);
        UIManager.Instance.HideWind(EmWindow.WarlordsRank);
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}
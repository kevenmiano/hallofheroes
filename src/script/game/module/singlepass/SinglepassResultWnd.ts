// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../core/utils/IconFactory";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import FUIHelper from "../../utils/FUIHelper";
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;
import BaseItemMsg = com.road.yishi.proto.battle.BaseItemMsg;
import Dictionary from "../../../core/utils/Dictionary";
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { EmWindow } from "../../constant/UIDefine";
import { BaseItem } from "../../component/item/BaseItem";
import Utils from "../../../core/utils/Utils";
/**天穹之径通关展示 */
export default class SinglepassResultWnd extends BaseWindow {

    public imgGrade: fgui.GLoader;
    public imgPetHead: fgui.GLoader;
    public ImgDiamage1: fgui.GLoader;
    public ImgDiamage2: fgui.GLoader;
    public txtPetExp: fgui.GTextField;
    public txtGradeDesc: fgui.GTextField;
    public txtExpDesc: fgui.GTextField;
    public txtTotalExp: fgui.GTextField;
    public diamageTxt1: fgui.GRichTextField;
    public diamageTxt2: fgui.GRichTextField;
    public diamageTxt3: fgui.GRichTextField;
    public diamageTxt4: fgui.GRichTextField;
    public list: fgui.GList;
    public petGroup: fgui.GGroup;
    public closeBtn:fgui.GButton;
    private _battleReportMsg: BattleReportMsg;
    private _goodsList: Array<GoodsInfo>;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
        this.addEvent();
    }

    public OnShowWind() {
        super.OnShowWind();
        this._battleReportMsg = this.params.frameData;
        this.refreshView();
    }

    private addEvent(){
        this.closeBtn.onClick(this,this.closeBtnHandler);
    }

    private removeEvent(){

        this.closeBtn.offClick(this,this.closeBtnHandler);
    }

    private closeBtnHandler(){
        this.OnBtnClose();
    }

    private initView() {
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private renderListItem(index: number, item: BaseItem) {
        item.info = this._goodsList[index];
    }

    private refreshView() {
        this.diamageTxt1.text = this._battleReportMsg.strategyBonus.toString();
        this.diamageTxt2.text = this._battleReportMsg.posX.toString();
        this.diamageTxt3.text = this._battleReportMsg.param1.toString();
        this.diamageTxt4.text = this._battleReportMsg.param2.toString();
        this.ImgDiamage1.url = this.getImgDiamageUrl(this._battleReportMsg.goldBonus);
        this.ImgDiamage2.url = this.getImgDiamageUrl(this._battleReportMsg.posY);
        this.txtTotalExp.text = "+" + this._battleReportMsg.gpBonus.toString();
        if (this._battleReportMsg.petGpBonus < 0) this._battleReportMsg.petGpBonus = 0;
        this.txtPetExp.text = "+" + this._battleReportMsg.petGpBonus.toString();
        this.imgGrade.url = this.getImgDiamageUrl(this._battleReportMsg.battleScene);
        this._goodsList = [];
        var tempDic: Dictionary = new Dictionary();
        let goodsCount: number = this._battleReportMsg.baseItem.length;
        let baseItem: BaseItemMsg;
        for (var i: number = 0; i < goodsCount; i++) {
            baseItem = this._battleReportMsg.baseItem[i] as BaseItemMsg;
            if (baseItem.templateId == -700) continue;
            var goodsInfo: GoodsInfo = tempDic[baseItem.templateId] as GoodsInfo;
            if (!goodsInfo) goodsInfo = new GoodsInfo();
            goodsInfo.templateId = baseItem.templateId;
            goodsInfo.count += baseItem.count;
            if (!(baseItem.templateId in tempDic)) {
                this._goodsList.push(goodsInfo);
                tempDic[baseItem.templateId] = goodsInfo;
            }
        }
        this._goodsList.sort(this.compareFunction);
        this.list.setVirtual();
        this.list.numItems = this._goodsList.length;
        var playerInfo: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if (playerInfo.enterWarPet) {
            this.imgPetHead.url = IconFactory.getPetHeadSmallIcon(playerInfo.enterWarPet.templateId);
            this.petGroup.visible = true;
        } else {
            this.petGroup.visible = false;
        }
    }

    private compareFunction(a: GoodsInfo, b: GoodsInfo): number {
        if (a.templateInfo.Profile > b.templateInfo.Profile) {
            return -1;
        } else if (a.templateInfo.Profile < b.templateInfo.Profile) {
            return 1;
        } else {
            if (a.count < b.count) {
                return -1;
            } else if (a.count > b.count) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    /**得到评价图片路径 */
    private getImgDiamageUrl(judge: number): string {
        let urlStr: string;
        switch (judge) {
            case 1:
                urlStr = FUIHelper.getItemURL("Base", "Lab_D_L");
                break;
            case 2:
                urlStr = FUIHelper.getItemURL("Base", "Lab_C_L");
                break;
            case 3:
                urlStr = FUIHelper.getItemURL("Base", "Lab_B_L");
                break;
            case 4:
                urlStr = FUIHelper.getItemURL("Base", "Lab_A_L");
                break;
            case 5:
                urlStr = FUIHelper.getItemURL("Base", "Lab_S_L");
                break;
        }
        return urlStr;
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
        this.removeEvent();
        FrameCtrlManager.Instance.open(EmWindow.SinglePassWnd);
    }

}
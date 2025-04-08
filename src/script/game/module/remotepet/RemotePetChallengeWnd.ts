import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../core/utils/IconFactory";
import { BaseItem } from "../../component/item/BaseItem";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { RemotePetTurnItemInfo } from "../../mvc/model/remotepet/RemotePetTurnItemInfo";
import FUIHelper from "../../utils/FUIHelper";
import { RemotePetHeadSelectItemView } from "./view/RemotePetHeadSelectItemView";

export class RemotePetChallengeWnd extends BaseWindow {

    public petIcon: RemotePetHeadSelectItemView;
    public petName: fgui.GTextField;
    public lvNum: fgui.GTextField;
    public randomText: fgui.GTextField;
    public firstText: fgui.GTextField;
    public wearyTxt: fgui.GTextField;
    public tips: fgui.GTextField;
    public challengeBtn: fgui.GButton;
    public rgoodsList: fgui.GList;
    public fgoodsList: fgui.GList;
    public imgPetType: fgui.GLoader;

    private turnInfo: RemotePetTurnItemInfo;

    private firstDrops: GoodsInfo[];
    private drops: GoodsInfo[]

    public OnInitWind(): void {
        super.OnInitWind();
        this.setCenter()
        this.turnInfo = this.frameData;
        this.initView();
    }

    public OnShowWind(): void {
        super.OnShowWind();
        if (!this.turnInfo) {
            Logger.error("没有关卡数据");
            return;
        }
        this.updateView();
    }

    private initView() {

        this.wearyTxt.setVar("v", ConfigInfoManager.Instance.getPetRemoteWeary());
        this.wearyTxt.flushVars();

        this.petIcon.lv_bg.visible = false;
        this.petIcon._lvNum.visible = false;

        this.fgoodsList.setVirtual();
        this.fgoodsList.itemRenderer = Laya.Handler.create(this, this.onGoodsItemRender1, null, false);

        this.rgoodsList.setVirtual();
        this.rgoodsList.itemRenderer = Laya.Handler.create(this, this.onGoodsItemRender2, null, false);

        this.challengeBtn.onClick(this, this.onChallenge);

    }

    private updateView() {
        let tempInfo = this.turnInfo.tempInfo;
        this.petName.text = tempInfo.NameLang;
        this.drops = this.getItems(tempInfo.DropItems);
        this.firstDrops = this.getItems(tempInfo.FirstDropItems);
        this.lvNum.text = LangManager.Instance.GetTranslation("RemotePetTurnTip.index", tempInfo.Index);
        this.petIcon._icon.icon = IconFactory.getRemotePetIconPath(tempInfo.Icon2);
        this.tips.text = LangManager.Instance.GetTranslation("RemotePetTurnTip.mopupValue", tempInfo.Sweep);
        let challenge = (tempInfo.Index == this.model.turnInfo.currTurn) || tempInfo.Index <= this.model.turnInfo.maxTurn;
        this.challengeBtn.enabled = challenge;
        this.fgoodsList.numItems = this.firstDrops.length;
        this.rgoodsList.numItems = this.drops.length;
        this.tips.visible = !!tempInfo.Sweep
        this.imgPetType.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType10" + tempInfo.Property);
    }

    private onChallenge() {
        if (!this.turnInfo) {
            return;
        }
        // let flag = this.turnInfo.tempInfo.Type == 2;
        RemotePetManager.Instance.sendFight(this.turnInfo.tempInfo.Index, false);
        this.hide();
    }

    private onGoodsItemRender1(index: number, box: BaseItem) {
        box.info = this.firstDrops[index];
    }

    private onGoodsItemRender2(index: number, box: BaseItem) {
        box.info = this.drops[index];
    }

    private getItems(dropItems: string) {
        let goodsList: GoodsInfo[] = [];
        let itemsInfo = dropItems.split(",");
        for (let item of itemsInfo) {
            let info = item.split("|");
            let itemId = +info[0];
            let count = +info[1];
            let goodsInfo = new GoodsInfo();
            goodsInfo.templateId = itemId;
            goodsInfo.count = count;
            goodsList.push(goodsInfo);
        }
        return goodsList;
    }


    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }
}
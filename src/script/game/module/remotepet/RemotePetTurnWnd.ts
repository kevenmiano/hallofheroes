// @ts-nocheck
import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsManager } from "../../manager/GoodsManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { RemotePetController } from "./RemotePetController";
import { RemotePetTurnDownView } from "./view/RemotePetTurnDownView";
import { RemotePetTurnMap } from "./view/RemotePetTurnMap";
import { RemotePetTurnUpView } from "./view/RemotePetTurnUpView";

export class RemotePetTurnWnd extends BaseWindow {

    public bg: fgui.GImage;
    public bg01: fgui.GImage;
    public bg02: fgui.GImage;
    public cbg: fgui.GGroup;
    public closeBtn: fgui.GButton;
    // public _sylph2: fgui.GTextField;
    // public _sylph1: fgui.GTextField;
    public sylph2: fgui.GImage;
    public sylph1: fgui.GImage;
    public helpBtn: fgui.GButton;
    public title: fgui.GTextField;

    public _mapView: RemotePetTurnMap;
    public _upView: RemotePetTurnUpView;
    public _downView: RemotePetTurnDownView;


    public resizeContent = true;
    public OnInitWind() {
        this.addEvent();
        RemotePetController.Instance.initTurnsData();
        // this.updateView();
    }


    private updateView() {
        // let count = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.REMOTEPET_TEMPID);
        // let count2 = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.REMOTEPET_TEMPID2);
        // this._sylph1.text = count + "";
        // this._sylph2.text = count2 + "";
        this._upView.freshItemView();
       this. _downView.commitHandler();
    }

    private updateMap() {
        this._mapView.setFrame(this.model.turnInfo.currPage);
    }

    private addEvent() {
        this.model.addEventListener(RemotePetEvent.COMMIT, this.updateView, this);
        this.model.addEventListener(RemotePetEvent.PAGE_UPDATE, this.updateMap, this);
        this.helpBtn.onClick(this, this.onHelpTap);
    }

    private removeEvent() {
        this.model.removeEventListener(RemotePetEvent.COMMIT, this.updateView, this);
        this.model.removeEventListener(RemotePetEvent.PAGE_UPDATE, this.updateMap, this);
        this.helpBtn.onClick(this, this.onHelpTap);
    }

    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }

    private onHelpTap() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation("remotepet.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    public OnHideWind(): void {
        this.removeEvent();
    }

    public dispose(dispose?: boolean): void {
        super.dispose(dispose);
        this.removeEvent();
        this._upView.dispose();
        this._downView.dispose();
        // this._mapView.dispose();
    }
}
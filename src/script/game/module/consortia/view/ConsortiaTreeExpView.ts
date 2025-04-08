// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import FUIHelper from "../../../utils/FUIHelper";
import { ConsortiaSecretInfo } from "../data/ConsortiaSecretInfo";
import { ConsortiaModel } from "../model/ConsortiaModel";

export class ConsortiaTreeExpView extends Laya.Sprite {

    private _consortiaSecretInfo: ConsortiaSecretInfo;
    private _view: fgui.GComponent;
    private btnTipOpt: UIButton;
    private progShow: fgui.GProgressBar;
    private progTranstion: fgui.GProgressBar;
    private txtProgTranstion: fgui.GLabel;
    constructor() {
        super();
        this._consortiaSecretInfo = ConsortiaManager.Instance.model.secretInfo;
        this.initView();
        this.initEvent();
        this.refreshTreeViewByState();
        this.refreshView();
    }

    private initView() {
        this._view = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "consortiaTreeBtn");
        this.addChild(this._view.displayObject)
        BaseFguiCom.autoGenerate(this._view, this);
    }

    private initEvent() {
        if (this._consortiaSecretInfo) this._consortiaSecretInfo.addEventListener(ConsortiaEvent.SECRET_UPDATE, this.secretUpdateHandler, this);
        this.consortiaModel.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.secretUpdateHandler, this);
        this.consortiaModel.secretInfo.addEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.consortiaTreeStateUpdateHandler, this);
    }

    private removeEvent() {
        if (this._consortiaSecretInfo) this._consortiaSecretInfo.removeEventListener(ConsortiaEvent.SECRET_UPDATE, this.secretUpdateHandler, this);
        this.consortiaModel.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.secretUpdateHandler, this);
        this.consortiaModel.secretInfo.removeEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.consortiaTreeStateUpdateHandler, this);
    }

    private get consortiaModel(): ConsortiaModel {
        return ConsortiaManager.Instance.model;
    }

    private secretUpdateHandler() {
        this.refreshView();
    }

    private refreshView() {
        if (!this._consortiaSecretInfo) {
            this.progShow.value = 0;
            this.progShow.getChild("title").text = "0 / 0";
            return;
        }
        this.progShow.max = this.consortiaModel.consortiaInfo.levels * 20 + 10;
        this.progShow.value = this._consortiaSecretInfo.givePowerCount
        this.progShow.getChild("title").text = this._consortiaSecretInfo.givePowerCount + " / " + (this.consortiaModel.consortiaInfo.levels * 20 + 10);
    }

    private consortiaTreeStateUpdateHandler(e: ConsortiaEvent): void {
        switch (ConsortiaManager.Instance.model.secretInfo.oper) {
            case ConsortiaSecretInfo.GIVE_POWER_STATE:
                this.progTranstion.visible = true;
                this.txtProgTranstion.visible = true;
                this.txtProgTranstion.text = LangManager.Instance.GetTranslation("ConsortiaTreeExpView.energy");
                TweenLite.to(this.progTranstion, 1, {
                    value: 100,
                    ease: Linear.easeNone,
                    onUpdate: () => {
                    },
                    onComplete: this.energyProgressBack.bind(this)
                });
                break;
            default:
                this.txtProgTranstion.visible = false;
                this.txtProgTranstion.text = "";
                this.progTranstion.visible = false;
                this.progTranstion.value = 0;
                break;
        }
        this.refreshTreeViewByState();
    }

    private energyProgressBack() {
        this.txtProgTranstion.visible = false;
        this.txtProgTranstion.text = "";
        this.progTranstion.value = 0;
        this.progTranstion.visible = false;
    }


    private refreshTreeViewByState() {
        if (ConsortiaManager.Instance.model.secretInfo.treeState == ConsortiaSecretInfo.GIVE_POWER_STATE) {
            this.playBtnTipOptAni();
            this.btnTipOpt.visible = true;
        }
        else {
            this.stopBtnTipOptAni();
            this.btnTipOpt.visible = false;
        }
    }

    private stopBtnTipOptAni(gray: boolean = true) {
        this.btnTipOpt.view.getTransition("t0").stop(true)
        if (gray) {
            UIFilter.gray(this.btnTipOpt.view)
        }
    }


    private playBtnTipOptAni(normal: boolean = true, times: number = -1) {
        this.btnTipOpt.view.getTransition("t0").play(null, times)
        if (normal) {
            UIFilter.normal(this.btnTipOpt.view)
        }
    }

    public dispose() {
        this.removeEvent();
    }
}
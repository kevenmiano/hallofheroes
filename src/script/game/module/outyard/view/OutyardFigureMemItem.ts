import FUI_OutyardFigureMemItem from "../../../../../fui/OutYard/FUI_OutyardFigureMemItem";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import OutyardManager from "../../../manager/OutyardManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import OutyardGuildInfo from "../data/OutyardGuildInfo";
import StackHeadSelfMsg = com.road.yishi.proto.stackhead.StackHeadSelfMsg;
export default class OutyardFigureMemItem extends FUI_OutyardFigureMemItem {
    private _info: OutyardGuildInfo;
    private _index: number = 0;
    private _intervalTime: number = 0;
    private _attackCostPoint: number = 0;
    constructor() {
        super();
        this.rankCtr = this.getController("rankCtr");
        this.self = this.getController("self");
        this._attackCostPoint = ConfigInfoManager.Instance.getStackHeadAttackActionPoint();
    }

    protected onConstruct() {
        super.onConstruct();
        this.pawnLeftTxt.text = LangManager.Instance.GetTranslation("outyard.OutyardActorView.leftArmyTxt.text");
        this.scoreTxt.text = LangManager.Instance.GetTranslation("outyard.OutyardActorView.scoreTxt.text");
        this.addEvent();
    }

    private addEvent() {
        this.attackBtn.onClick(this, this.attackBtnHandler);
    }

    private removeEvent() {
        this.attackBtn.offClick(this, this.attackBtnHandler);
    }

    public set index(value: number) {
        this._index = value;
    }

    private attackBtnHandler() {
        if (!this._info) return;
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE
            || SceneManager.Instance.currentType == SceneType.CASTLE_SCENE) {
            if (OutyardManager.Instance.stateMsg.state != 3)//不是开战中
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardActorView.AttackClick.text"));
                return;
            }
            if (Laya.Browser.now() - this._intervalTime < 3000) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
                return;
            }
            this._intervalTime = Laya.Browser.now();
            let content: string = LangManager.Instance.GetTranslation("outyardFigureMemItem.attack.tips", this._attackCostPoint);
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(null, null, prompt, content, null, null, (b: boolean) => {
                if (b) {
                    let selfMsg: StackHeadSelfMsg = OutyardManager.Instance.selfMsg;
                    if (selfMsg.actionPoint < this._attackCostPoint) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyardFigureMemItem.attack.pointTips"));
                        return;
                    }
                    OutyardManager.Instance.OperateOutyard(OutyardManager.ATTACK, this._info.pos);
                }
            });
        }
        else {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TopToolBar.outyardTips"));
            return;
        }
    }

    public get info(): OutyardGuildInfo {
        return this._info;
    }

    public set info(value: OutyardGuildInfo) {
        this._info = value;
        if (this._info) {
            this.rankCtr.selectedIndex = this._info.order - 1;
            this.consortiaNameTxt.text = this._info.guildName;
            this.pawnLeftValueTxt.text = this._info.defenceArmyAlive.toString();
            this.scoreValueTxt.text = this._info.currentScore.toString();
            if (OutyardManager.Instance.myGuildPos == this._info.pos) {
                this.self.selectedIndex = 0;
            } else {
                this.self.selectedIndex = 1;
            }
            if (this._index == 0) {
                this.attackBtn.x = 470;
                this.rotationGroup.x = 120;
            } else if (this._index == 1) {
                this.attackBtn.x = 40;
                this.rotationGroup.x = 105;
            } else if (this._index == 2) {
                this.attackBtn.x = 410;
                this.rotationGroup.x = 75;
            } else if (this._index == 3) {
                this.attackBtn.x = 85;
                this.rotationGroup.x = 150;
            }
        } else {
            this.consortiaNameTxt.text = "";
            this.pawnLeftValueTxt.text = "";
            this.scoreValueTxt.text = "";
            this.self.selectedIndex = 0;
            this.attackBtn.visible = false;
        }
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}
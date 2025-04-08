import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import StringHelper from "../../../core/utils/StringHelper";
import Utils from "../../../core/utils/Utils";
import SimpleAlertHelper, { AlertBtnType } from "../../component/SimpleAlertHelper";
import { BaseItem } from "../../component/item/BaseItem";
import { LoginWay } from "../../constant/LoginWay";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * 升级绑定账户
 */
export default class UpgradeAccountWnd extends BaseWindow {

    private txt_title: fgui.GTextField;

    private txt_content: fgui.GTextField;

    private awardList: fgui.GList;

    private btnClaim: UIButton;

    private btnUpgrade: UIButton;

    private closeBtn: UIButton;

    private dataList: GoodsInfo[] = [];

    private state: fgui.Controller;

    OnInitWind(): void {
        super.OnInitWind();
        this.addEvent();
        this.initData();
        this.setCenter();
    }

    private initData() {

        this.state = this.getController("c1");

        this.txt_title.text = LangManager.Instance.GetTranslation("UpgradeAccountWnd.txt_title");
        this.txt_content.text = LangManager.Instance.GetTranslation("UpgradeAccountWnd.txt_content");
        this.btnClaim.title = LangManager.Instance.GetTranslation("UpgradeAccountWnd.btnClaim");
        this.btnUpgrade.title = LangManager.Instance.GetTranslation("UpgradeAccountWnd.btnUpgrade");

        //
        this.dataList = [];
        let dataArray = [];
        let cfgReward = TempleteManager.Instance.getConfigInfoByConfigName("upgradeaccount_rewards");
        if (cfgReward) {
            if (!StringHelper.isNullOrEmpty(cfgReward.ConfigValue)) {
                let arr: Array<string> = cfgReward.ConfigValue.split("|");
                let len: number = arr.length;
                let item: GoodsInfo;
                let itemStr: string;
                for (let i: number = 0; i < len; i++) {
                    itemStr = arr[i];
                    item = new GoodsInfo();
                    item.templateId = parseInt(itemStr.split(',')[0]);
                    item.count = parseInt(itemStr.split(',')[1]);
                    dataArray.push(item);
                }
            }
        }
        this.dataList = dataArray;
        this.awardList.numItems = this.dataList.length;

        //
        this.updateBindState();
    }

    private updateBindState() {
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let isReward = playerInfo.isBindReward;
        this.state.selectedIndex = 0;
        let loginWay = SharedManager.Instance.getWindowItem("loginWay");
        if (Number(loginWay) == LoginWay.Type_GUEST) {
            SDKManager.Instance.getChannel().checkBindState().then((ret: Array<any>) => {
                Logger.yyz("checkBindState:", ret);
                if (ret && ret.length > 0) {
                    this.state.selectedIndex = 2;
                } else {
                    this.state.selectedIndex = 1;
                }
            })
        } else {
            this.state.selectedIndex = isReward ? 0 : 2;
        }
    }

    private addEvent() {
        this.btnClaim.onClick(this, this.onClaimRewards);
        this.btnUpgrade.onClick(this, this.onUpgradeAccount);
        this.closeBtn.onClick(this, this.OnBtnClose);
        this.awardList.itemRenderer = Laya.Handler.create(this, this.renderList1Item, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.USER_BIND_REWARD, this.onRespBindReward, this);
    }

    private renderList1Item(index: number, item: BaseItem) {
        if (item && !item.isDisposed) {
            item.info = this.dataList[index];
        }
    }

    private offEvent() {
        this.btnClaim.offClick(this, this.onClaimRewards);
        this.btnUpgrade.offClick(this, this.onUpgradeAccount);
        this.closeBtn.offClick(this, this.OnBtnClose);
        Utils.clearGListHandle(this.awardList);
        NotificationManager.Instance.removeEventListener(NotificationEvent.USER_BIND_REWARD, this.onRespBindReward, this);
    }

    /**领取奖励结果 */
    onRespBindReward() {
        let state = PlayerManager.Instance.currentPlayerModel.playerInfo.userBindState;
        switch (state) {
            case 1://
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("UpgradeAccountWnd.RespResult01"));
                break;
            case -1:
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("UpgradeAccountWnd.RespResult02"));
                break;
            case -2:
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("UpgradeAccountWnd.RespResult03"));
                break;
            default:
                break;
        }
        this.updateBindState();
        this.hide();
    }

    /**绑定账户 */
    private onUpgradeAccount() {
        SDKManager.Instance.getChannel().bindAccount(LoginWay.Type_7ROAD).then((result) => {
            Logger.error("onUpgradeAccount---result:", result);
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
            let msg = "";
            if (result > 0) {
                msg = LangManager.Instance.GetTranslation("UpgradeAccountWnd.bindAccountRet1");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, msg, confirm1, cancel1, (ok: boolean, v2: boolean) => {
                    if (ok) {
                        if (result > 0) {
                            SharedManager.Instance.setWindowItem("bindAccountRet", "true");
                            SDKManager.Instance.getChannel().logout(true);
                            SDKManager.Instance.getChannel().reload();
                        }
                        return;
                    }
                }, AlertBtnType.O, false, true);
            } else {
                msg = LangManager.Instance.GetTranslation("UpgradeAccountWnd.bindAccountRet0");
                MessageTipManager.Instance.show(msg);
            }
        });
    }

    /**领取 */
    private onClaimRewards() {
        let loginWay = SharedManager.Instance.getWindowItem("loginWay");
        if (Number(loginWay) == LoginWay.Type_GUEST) {
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
            let msg = LangManager.Instance.GetTranslation("UpgradeAccountWnd.bindAccountRechargeReloadTips");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, msg, confirm1, cancel1, (ok: boolean, v2: boolean) => {
                if (ok) {
                    SharedManager.Instance.setWindowItem("bindAccountRet", "true");
                    SDKManager.Instance.getChannel().logout(true);
                    SDKManager.Instance.getChannel().reload();
                    return;
                }
            }, AlertBtnType.O, false, true);
        } else {
            PlayerManager.Instance.reqUserBindReward();
        }
    }

    OnHideWind(): void {
        this.offEvent();
        super.OnHideWind();
    }

}
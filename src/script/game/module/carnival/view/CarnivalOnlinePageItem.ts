import FUI_CarnivalOnlinePageItem from "../../../../../fui/Carnival/FUI_CarnivalOnlinePageItem";
import LangManager from "../../../../core/lang/LangManager";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import CarnivalModel, { CARNIVAL_FOLDER, CARNIVAL_THEME } from "../model/CarnivalModel";

/**
 * 嘉年华---在线奖励
 */
export default class CarnivalOnlinePageItem extends FUI_CarnivalOnlinePageItem {

    private rewards: GoodsInfo[];

    private tempInfo: t_s_carnivalpointexchangeData;

    private _btn_receive: UIButton;
    private _btn_unlock: UIButton;

    protected onConstruct() {
        super.onConstruct();
        this._btn_receive = new UIButton(this.btn_receive);
        this._btn_unlock = new UIButton(this.btn_unlock);
        this._btn_unlock.enabled = false;

        !CarnivalManager.Instance.isRewardTime && (this._btn_unlock.title = LangManager.Instance.GetTranslation("carnival.active.timeover"));

        this.Img_Title07.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.ONLINE, "Img_Title07");
        let themeType = this.model.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.ImgState.selectedIndex = 1;
        } else {
            this.ImgState.selectedIndex = 0;
        }
        this.addEvent();
    }

    private addEvent() {
        this._btn_receive.onClick(this, this.onReceiveClick);
        this.goodsList.setVirtual();
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderReward, null, false);
    }

    private offEvent() {
        this._btn_receive.offClick(this, this.onReceiveClick);
        // this.goodsList.itemRenderer && this.goodsList.itemRenderer.recover();
        Utils.clearGListHandle(this.goodsList);
    }

    private onReceiveClick() {
        if (this.tempInfo) CarnivalManager.Instance.opRequest(CarnivalManager.OP_ONLINE_REWARD, this.tempInfo.Id);
    }

    private renderReward(index: number, box: BaseItem) {
        box.info = this.rewards[index];
    }

    private setTitle(t: number) {
        this.title.setVar("times", t + "").flushVars();
    }

    private fruitIcon: string[] = [
        "Icon_Juice",
        "Icon_Watermelon",
        "Icon_Lemon",
        "Icon_Icecream",
        "Icon_Popsicle",
        "Icon_Miiktea",
    ];
    public set index(value: number) {
        let imgName = this.fruitIcon[value];
        this.icon_fruit.url = this.getThemeFolderImgPath(imgName);
    }

    public set info(value: t_s_carnivalpointexchangeData) {
        this.tempInfo = value;
        if (!value) return;
        this.setTitle(this.tempInfo.Target);
        this.createRewards();
        this.goodsList.numItems = this.rewards.length;
        this.btn_receive.enabled = CarnivalManager.Instance.isRewardTime;
        !CarnivalManager.Instance.isRewardTime && (this.btn_receive.title = LangManager.Instance.GetTranslation("carnival.active.timeover"));

    }

    private createRewards() {
        this.rewards = [];
        let g = null;
        if (this.tempInfo.Item1 != 0 && this.tempInfo.ItemNum1 > 0) {
            g = new GoodsInfo();
            g.templateId = this.tempInfo.Item1;
            g.count = this.tempInfo.ItemNum1;
            this.rewards.push(g);
        }

        if (this.tempInfo.Item2 != 0 && this.tempInfo.ItemNum2 > 0) {
            g = new GoodsInfo();
            g.templateId = this.tempInfo.Item2;
            g.count = this.tempInfo.ItemNum2;
            this.rewards.push(g);
        }

        if (this.tempInfo.Item3 != 0 && this.tempInfo.ItemNum3 > 0) {
            g = new GoodsInfo();
            g.templateId = this.tempInfo.Item3;
            g.count = this.tempInfo.ItemNum3;
            this.rewards.push(g);
        }

        if (this.tempInfo.Item4 != 0 && this.tempInfo.ItemNum4 > 0) {
            g = new GoodsInfo();
            g.templateId = this.tempInfo.Item4;
            g.count = this.tempInfo.ItemNum4;
            this.rewards.push(g);
        }
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    public refreshView(onLine: number) {
        var hasRewardStr: string = this.model.onlineRewardInfo;
        var hasRewardList: Array<string> = hasRewardStr.split(",");
        if (this.tempInfo) {
            var findId: string = "" + this.tempInfo.Id;
            if (hasRewardList.indexOf(findId) != -1) {
                this.state.selectedIndex = 2;
            } else {
                this.state.selectedIndex = 0;
                if (this.tempInfo.Target <= onLine) {
                    this.state.selectedIndex = 1;
                } else {
                    this.state.selectedIndex = 0;
                }
            }
        }
    }

    private getThemeFolderImgPath(imgName: string) {
        let isWinter = this.model.themeType == CARNIVAL_THEME.WINTER;
        if (isWinter) return "";
        return this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.ONLINE, imgName)
    }

    dispose(): void {
        this.offEvent();
        super.dispose();
    }

}
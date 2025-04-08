import FUI_SFashionComposeView from "../../../../../fui/SBag/FUI_SFashionComposeView";
import LangManager from "../../../../core/lang/LangManager";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import UIManager from "../../../../core/ui/UIManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { BaseItem } from "../../../component/item/BaseItem";
import { FashionBagCell } from "../../../component/item/FashionBagCell";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { BagType } from "../../../constant/BagDefine";
import { BagEvent, FashionEvent, NotificationEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { UpgradeType } from "../../../constant/UpgradeType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FashionManager } from "../../../manager/FashionManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { FashionModel } from "../../bag/model/FashionModel";
import { ForgeSocketOutManager } from "../../forge/ForgeSocketOutManager";
import { SFashionBag } from "./SFashionBag";
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg;
import FashionInfoMsg = com.road.yishi.proto.simple.FashionInfoMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/20 20:45
 * @ver 1.0
 *
 */
export class SFashionComposeView extends FUI_SFashionComposeView {
    public item0: FashionBagCell;
    private _itemDic: SimpleDictionary
    private _isDie: boolean = false;
    private isInited: boolean = false;
    private _fashionBag: SFashionBag;
    private _count = 1;
    private sontTypeArr = [111, 112, 110, 109];



    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.item0 = this.item_0 as FashionBagCell;
        this._fashionBag = this.bag as SFashionBag;

        this.progressBar2.visible = false;
        this._progressAddTxt.visible = false;
        this.nextLevelTxt.visible = false;
    }

    public initView() {
        if (this.isInited) return;
        this.isInited = true;
        (this.item0.getChild('item') as BaseItem).pos = 0;
        this.model.opState = 0;
        this.initEvent();
        this.initData();
        this._fashionBag.initView();

    }

    /**
     * 切换到指定
     * @param sontype 
     */
    // showTabIndex(sontype: number) {
    //     let idx = this.sontTypeArr.indexOf(sontype);
    //     // this._fashionBag.selectTabIndex(idx);
    // }

    private initEvent() {
        this.btn_compose.onClick(this, this.__composeHandler);
        this.btn_detail.onClick(this, this.onBonusDetailBtn);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        ServerDataManager.listen(S2CProtocol.U_C_FASHION_COMPOSE, this, this.__onComposeCallback);
        this.model.addEventListener(FashionEvent.RESET_MOVIECLIP, this.__resetMovieclipHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.FASHION_SHOW_CHANGE, this.__refreshHandler, this);
        this.__refreshHandler();
    }

    private initData() {
        this._itemDic = new SimpleDictionary();
        this._itemDic.add("0_0_" + BagType.Hide, this.item0);
        //吞噬只需要一个
        // this._itemDic.add("1_0_" + BagType.Hide, this.item1);
        this.updateView();
    }

    private __composeHandler(e: Laya.Event) {
        this.doCompose();
    }


    /** 合成 */
    private doCompose() {
        if (this._isDie) {
            return;
        }
        if (!this._itemDic) {
            return;
        }
        let goods1: GoodsInfo = this.item0.info as GoodsInfo;
        if (!goods1) {
            return
        }

        if (this.btn_compose) {
            this.btn_compose.enabled = false;
        }
        this.composeStart();
    }

    /** 合成动画开始  在第25帧发送合成协议 */
    private composeStart() {
        if (this.t0) {
            this.t0.play(null, 1, 0, 0, 0.75);
            Laya.timer.frameOnce(25, this, this.__enterFrameHandler)
            this.model.opState = 1;
            Laya.timer
        }
    }

    private __enterFrameHandler(e: Event) {
        ForgeSocketOutManager.sendFashionCompose(true, this._count);
        this.model.opState = 2;
        this.t0.play(null, 1, 0, 0.75, 1);
    }

    private __resetMovieclipHandler() {
        this.resetOpState();
    }

    private resetOpState() {
        this.model.opState = 0;
    }


    /**
     * 时装合成返回处理
     * msg.composeResult（boolean）: 合成结果
     * msg.pos,msg.objectId,msg.bagType:合成物品的参数(位置、objectId、背包类型)
     * */
    private __onComposeCallback(pkg: PackageIn) {
        let msg: StoreRspMsg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
        if (!msg.composeResult) {
            this.btn_compose.enabled = true;
            return;
        }
        let info: GoodsInfo = GoodsManager.Instance.getItemByPOB(msg.pos, msg.objectId, msg.bagType);
        this.updateView(info);
        this.displayObject.event(FashionEvent.COMPOSE_SUCCEED, info);
        FashionManager.Instance.getFashionBook();
    }

    /**
     * 背包更新物品时调用
     * */
    private __bagItemUpdateHandler(infos: GoodsInfo[]) {
        let udp = false;
        for (let info of infos) {
            let item: FashionBagCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
            if (item /*&& this.model.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL*/) {
                item.alpha = 1;
                item.info = info;
                item.c2.selectedIndex = 0;//不显示提示文字
                this._count = item.info.count;
                udp = true;
            }
        }
        udp && this.updateView();
    }


    /**
     * 背包删除物品时调用
     * */
    private __bagItemDeleteHandler(infos: GoodsInfo[]) {
        let upd = false;
        for (let info of infos) {
            let item: FashionBagCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
            if (item /*&& this.model.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL*/) {
                item.info = null;
                item.c2.selectedIndex = 1;//显示提示文字
                upd = true;

            }
        }
        upd && this.updateView();
    }

    /**
     * 时装合成的视图刷新, 在背包删除、更新、时装合成后, 都会调用此方法
     * 有info表示合成成功后的物品
     * */
    private updateView(info: GoodsInfo = null) {
        this.btn_compose.enabled = false;
        this.btn_compose.enabled = !!this.item0.info;
        this.updateAddView();

    }

    private updateAddView(): void {
        this._progressAddTxt.visible = false;
        this.progressBar2.visible = false;
        this.nextLevelTxt.visible = false;
        if (!this.item0.info) return;
        let calcGp = this.calcGp;
        let percent = 0;

        let fashionMsg: FashionInfoMsg = ArmyManager.Instance.fashionInfoMsg;
        let upgradeTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(fashionMsg.grades + 1, UpgradeType.UPGRADE_FASHION);
        if (upgradeTemp) {
            let value = fashionMsg.gp + calcGp;
            let nextValue = upgradeTemp.Data;
            let levelUp = value >= nextValue;
            this._progressAddTxt.text = "+" + calcGp;
            this.nextLevelTxt.text = LangManager.Instance.GetTranslation("public.level2", this.getLevelUpByGp(value));
            if (levelUp) value = nextValue;
            percent = (value / nextValue);
            this.nextLevelTxt.visible = levelUp;
            this.progressBar2.visible = true;
            this._progressAddTxt.visible = true;
            this.progressBar2.scaleX = percent;
        }

    }

    private getLevelUpByGp(gp: number) {
        let fashionMsg: FashionInfoMsg = ArmyManager.Instance.fashionInfoMsg;
        let grades = fashionMsg.grades;
        let upgradeTemp: t_s_upgradetemplateData
        while (upgradeTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(++grades, UpgradeType.UPGRADE_FASHION)) {
            if ((gp -= upgradeTemp.Data) < 0) {
                //不够了 -1 回上一级
                return (grades - 1) + ""
            }
        }

        return "MAX"
    }

    private __refreshHandler() {
        let fashionMsg: FashionInfoMsg = ArmyManager.Instance.fashionInfoMsg;
        this.levelTxt.text = LangManager.Instance.GetTranslation("public.level2", fashionMsg.grades);
        let upgradeTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(fashionMsg.grades + 1, UpgradeType.UPGRADE_FASHION);
        let progressTxt = this.progressTxt
        if (!upgradeTemp) {
            progressTxt.text = "Max";
            this.progressBar.scaleX = 1;
        } else {
            let value = fashionMsg.gp;
            let nextValue = upgradeTemp.Data;
            progressTxt.text = value + "/" + nextValue;
            this.progressBar.scaleX = value / nextValue;
        }
    }

    private onBonusDetailBtn() {
        UIManager.Instance.ShowWind(EmWindow.FashionBonusWnd)
    }

    private get calcGp() {
        let baseGp = 0;
        let totalAddGp = 0;
        let goods: GoodsInfo = this.item0.info as GoodsInfo;
        if (GoodsCheck.isFashion(goods.templateInfo)) {
            let skillTempInfo: t_s_skilltemplateData;
            let skillId = 0;
            for (var i = 1; i <= 5; i++) {
                skillId = goods["randomSkill" + i];
                skillTempInfo = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
                if (skillTempInfo) {
                    break;
                }
            }
            let grade = 1;
            if (skillTempInfo) grade = skillTempInfo.Grades;
            grade = grade > 12 ? 12 : grade;
            grade = grade <= 0 ? 1 : grade;
            if (goods.templateInfo.SonType == GoodsSonType.SONTYPE_WING)//翅膀
            {
                baseGp = this.getFashionWingBaseGp();
            }
            else//其他时装
            {
                baseGp = this.getFashionOtherBaseGp();
            }
            totalAddGp = baseGp * Math.pow(2, grade - 1);
        }
        else {
            if (goods.templateId == 208021)//幸运符
            {
                baseGp = this.getFashionLuckyBaseGp();
            }
            else if (goods.templateId == 208020)//时装之魄
            {
                baseGp = this.getFashionSoulBaseGp();
            }
            totalAddGp = baseGp * this._count; //goods.count
        }
        return totalAddGp;
    }

    private getFashionLuckyBaseGp() {
        return +(TempleteManager.Instance.getConfigInfoByConfigName("Fashion_Lucky").ConfigValue);
    }

    private getFashionSoulBaseGp() {
        return +(TempleteManager.Instance.getConfigInfoByConfigName("Fashion_Soul").ConfigValue);
    }

    private getFashionWingBaseGp() {
        return +(TempleteManager.Instance.getConfigInfoByConfigName("Fashion_Wing").ConfigValue);
    }

    private getFashionOtherBaseGp() {
        return +(TempleteManager.Instance.getConfigInfoByConfigName("Fashion_Other").ConfigValue);
    }

    removeEvent() {
        this.isInited = false;
        this.btn_compose.offClick(this, this.__composeHandler);
        this.btn_detail.offClick(this, this.onBonusDetailBtn);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        ServerDataManager.cancel(S2CProtocol.U_C_FASHION_COMPOSE, this, this.__onComposeCallback);
        this.model.removeEventListener(FashionEvent.RESET_MOVIECLIP, this.__resetMovieclipHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FASHION_SHOW_CHANGE, this.__refreshHandler, this);
    }

    public get model(): FashionModel {
        return FashionManager.Instance.fashionModel;
    }

    dispose() {
        if (this._isDie) {
            return;
        }
        this._isDie = true;
        if (this._itemDic) {
            this._itemDic.clear();
        }
        this._itemDic = null;
        this.model.opState = 0;
        super.dispose();
    }
}
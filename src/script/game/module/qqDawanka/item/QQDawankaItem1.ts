// @ts-nocheck
import FUI_QQDawankaItem1 from "../../../../../fui/QQDawanka/FUI_QQDawankaItem1";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import QQDawankaManager from "../../../manager/QQDawankaManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import QQDawankaItemVO from "./QQDawankaItemVO";

export default class QQDawankaItem1 extends FUI_QQDawankaItem1 {
    info: QQDawankaItemVO = null;
    tipType: any;
    tipData: any;
    startPoint: Laya.Point;
    goodsArrs: GoodsInfo[];

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    setInfo(info: QQDawankaItemVO) {
        this.info = info;
        this.cGet = this.getController('cGet');
        this.cGray = this.getController('cGray');

        this.title.fontSize = info.Privilegename.length > 6 ? 15 : 20;
        
        this.title.text = info.Privilegename;
        this.txtSoon.text = LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.soon');
        this.txt1.text = info.getStr()[0];
        this.txt2.text = info.getStr()[1];
        this.showIcon.icon = QQDawankaManager.Instance.model.getIconByType(info.Privilegetype);
        // this.showIcon.onClick(this, this.onIconClick);

        this.btnJump.onClick(this, this.onBtnJump);
        this.btnGet.onClick(this, this.onBtnGet);
        this.btnGet.title = LangManager.Instance.GetTranslation('GrowthFundItem.getTxt');
        this.btnGray.title = LangManager.Instance.GetTranslation('GrowthFundItem.getTxt');
        this.btnJump.title = LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.jump');
        

        if (this.info.rewards) {
            this.goodsArrs = this.getRewards(this.info.rewards);
            this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        }

        this.refreshBtnState();

        
    }

    private renderListItem(index: number, item: BaseItem) {
        item.info = this.goodsArrs[index];
    }

    getRewards(rewardStr: string) {
        let rewards: GoodsInfo[] = [];
        let rewardItem: string[] = rewardStr.split("|");
        let count = rewardItem.length;
        for (let i = 0; i < count; i++) {
            let tempStr = rewardItem[i];
            let infos = tempStr.split(",");
            let goods = new GoodsInfo();
            goods.templateId = Number(infos[0]);
            goods.count = Number(infos[1]);
            rewards.push(goods);
        }
        return rewards;
    }

    onIconClick() {
        if (this.info.rewards) {
            let rewardItem: string[] = this.info.rewards.split("|");
            let count = rewardItem.length;
            let rewardId = Number(rewardItem[0].split(',')[0]);
            let isFashion = GoodsCheck.isFashion(TempleteManager.Instance.getGoodsTemplatesByTempleteId(rewardId));
            if (isFashion) {
                this.tipType = EmWindow.AvatarTips;
                this.tipData = this.info.rewards;
                this.startPoint = new Laya.Point(-400, -10);
            } else {
                this.tipType = EmWindow.ItemTips;
                this.tipData = this.info.rewards;
                this.startPoint = new Laya.Point(-280, -120);
            }
            
        } else {
            //@ts-ignore
            this.tipType = EmWindow.CommonTips;
            //@ts-ignore
            this.tipData = LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.normalTips');
            // `[color=#ed781d][size=24]特权: [/size][/color]<br/>` +
            // "<br/><br/>" +
            // "[color=#ffc68f]享受QQ大玩咖特权[/color]<br/>";
            this.startPoint = new Laya.Point(-280, -120);
        }
        
        
        ToolTipsManager.Instance.showTip(new Laya.Event(),this.displayObject);


    }

    onBtnJump() {
        if (this.info.Privilegetype == 1) {
            //调取6元充值
            // RechargeAlertMannager.Instance.recharge(TempleteManager.Instance.getRechargeTempletes()[0].ProductId);
            RechargeAlertMannager.Instance.openShopRecharge();
        } else {
            SDKManager.Instance.getChannel().jumpPrivilege(this.info.getCode());
        }
    }

    onBtnGet() {
        QQDawankaManager.Instance.getGift(this.info.getType(), QQDawankaManager.Instance.model.getSelectGrade());
    }

    refreshBtnState() {
        this.list.visible = false;
        this.btnMask.visible = false;
        if (QQDawankaManager.Instance.model.getSoon(this.info.Privilegetype, this.info.Para2)) {
            this.cGray.selectedIndex = 1;
        } else {
            this.cGray.selectedIndex = 0;
        }
        
        if (this.info.Privilegetype == 8 || this.info.Privilegetype == 9) {
            let type = this.info.Privilegetype == 8 ? 1 : 0;
            let gray = QQDawankaManager.Instance.model.getGiftState(type);
            this.cGet.selectedIndex = gray ? 1 : 2;

            if (!QQDawankaManager.Instance.model.getUnlock()) {
                this.list.visible = true;
                this.list.numItems = this.getRewards(this.info.rewards).length;
                // 特权礼包显示时装预览
                if (this.info.Privilegetype == 8) {
                    this.btnMask.onClick(this, this.onIconClick);
                    this.btnMask.visible = true;
                }
            }
        } else {
            this.cGet.selectedIndex = 0;
        }
        if (!QQDawankaManager.Instance.model.getUnlock()) {
            this.cGet.selectedIndex = 3;
        }
    }

    public dispose() {
        super.dispose();
        // if (this.showIcon)
        // this.showIcon.offClick(this, this.onIconClick);
    }
}
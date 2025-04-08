import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { EquipTip } from "./EquipTip";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { EquipTipView } from "./EquipTipView";
import { GoodsManager } from "../manager/GoodsManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { NotificationManager } from "../manager/NotificationManager";
import { TipsEvent } from "../constant/event/NotificationEvent";
import LangManager from "../../core/lang/LangManager";
import GoodsSonType from "../constant/GoodsSonType";
import { Directions } from "../manager/ToolTipsManager";
import BaseTips from "./BaseTips";
import { BagHelper } from '../module/bag/utils/BagHelper';
import GroupLayoutType = fgui.GroupLayoutType;
import { PetEquipTipView } from "./PetEquipTipView";
import { BagType } from "../constant/BagDefine";
import PetCtrl from "../module/pet/control/PetCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";

/**
 * 英灵装备对比TIPS
 * 英灵对应装备位已穿戴其他装备
 * TIPS左侧需要显示英灵当前该部位穿戴装备tips, TIPS无操作按钮
 * 当前选择装备TIPS的评分需要跟当前穿戴装备进行对比
 * 评分高于穿戴装备 显示: 绿色向上箭头  箭头右侧显示高出评分数值
 */
export class PetEquipContrastTips extends BaseTips {
    public goodstip2: PetEquipTipView;
    public goodstip1: PetEquipTipView;
    public totalBox: fgui.GGroup;

    private _info: GoodsInfo;
    private _canOperate: boolean;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        // this.initView();
        this.addEvent();

        this.updateTransform();
        this.goodstip1.ensureBoundsCorrect();
        this.goodstip2.ensureBoundsCorrect();
        this.totalBox.ensureBoundsCorrect();
    }

    private initData() {
        [this._info, this._canOperate] = this.params;
    }

    // private initView() {
    //     // this.goodstip2.equipType = EquipTip.EQUIPED;
    //     // this.goodstip3.equipType = EquipTip.EQUIPED;
    // }

    private addEvent() {
        NotificationManager.Instance.addEventListener(TipsEvent.EQUIP_TIPS_HIDE, this.OnBtnClose, this);
    }

    private get petCtrl(): PetCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    }

    private updateTransform() {
        this.clean();

        if (!this._info) {
            return;
        }

        //英灵对应装备位已穿戴其他装备  当前选择装备TIPS的评分需要跟当前穿戴装备进行对比
        let equiped: GoodsInfo = this.petCtrl.curPartInfo;
        if (equiped) {
            this.goodstip2.canOperate = this._canOperate;
            this.goodstip2.info = equiped;
            this.goodstip2.visible = true;

            this.goodstip1.info = this._info;//TIPS左侧需要显示英灵当前该部位穿戴装备tips, TIPS无操作按钮
            this.goodstip1.visible = true;
            this.goodstip1.showConstrast(this.goodstip2.gradeCount);
            // this.goodstip1.btn_equip.text = LangManager.Instance.GetTranslation("armyII.viewII.skill.btnEquipExchange");//替换  
        }
    }

    /**
     * ToolTipsManager中调用
     * @param value
     */
    public set direction(value: number) {
        // switch (value) {
        //     case Directions.DIRECTION_BL:
        //     case Directions.DIRECTION_L:
        //     case Directions.DIRECTION_TL:
        //     case Directions.DIRECTION_B:
        //         break;
        //     case Directions.DIRECTION_BR:
        //     case Directions.DIRECTION_R:
        //     case Directions.DIRECTION_TR:
        //     case Directions.DIRECTION_T:
        //         //NOTE 有布局的Group只能先取消布局再调换位置、然后开启布局立即重排, 否则位置卡的死死的动不了
        //         // this.totalBox.layout = GroupLayoutType.None;
        //         // this.totalBox.ensureBoundsCorrect();
        //         // this.contentPane.swapChildren(this.goodstip1, this.goodstip2);
        //         // this.totalBox.layout = GroupLayoutType.Horizontal;
        //         // this.totalBox.ensureBoundsCorrect();

        //         // this.contentPane.addChild(this.goodstip1);
        //         // this.contentPane.addChild(this.goodstip3);
        //         // this.contentPane.addChild(this.goodstip2);

        //         // let tempX:number = this.goodstip1.x;
        //         // this.goodstip1.x = this.goodstip2.x;
        //         // this.goodstip2.x = tempX;
        //         break;
        // }
        this.contentPane.ensureBoundsCorrect();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private clean() {
        this.goodstip2.info = null;
        this.goodstip1.info = null;
        this.goodstip2.visible = false;
        this.goodstip1.visible = false;
    }

    protected OnClickModal() {
        super.OnClickModal();
        this.hide();
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(TipsEvent.EQUIP_TIPS_HIDE, this.OnBtnClose, this);
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}
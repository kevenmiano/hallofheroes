// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_pluralpvpsegmentData } from "../../../config/t_s_pluralpvpsegment";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ColosseumRewardsItem from "./ColosseumRewardsItem";
import ColosseumCtrl from "./ColosseumCtrl";

export default class ColosseumRewardsWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public txt1:fgui.GTextField;
	public itemList:fgui.GList;
	public txtMyScoreTitle:fgui.GTextField;
	public txtMyScore:fgui.GTextField;
	public txtTitle1:fgui.GTextField;
	public txtTitle2:fgui.GTextField;

    rewardList: any;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initText();
        this.rewardList = this.getList();
        this.itemList.setVirtual();
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.itemList.numItems = this.rewardList.length;
    }

    initText() {
        this.txt1.text = LangManager.Instance.GetTranslation('RoomList.pvp.colosseum.rewards.txt1');
        this.frame.title = LangManager.Instance.GetTranslation('godarrive.GodArriveFrame.rewardBtn');
        this.txtTitle1.text = LangManager.Instance.GetTranslation('RvrBattleResultWnd.roleScoreTxt');
        this.txtTitle2.text = LangManager.Instance.GetTranslation('mainBar.TopToolsBar.dayGuideBtnTipData');
        this.txtMyScoreTitle.text = LangManager.Instance.GetTranslation('RvrBattleMapRightWnd.myScoreTxt');
        this.txtMyScore.text = (FrameCtrlManager.Instance.getCtrl(EmWindow.Colosseum) as ColosseumCtrl).data.curScore + '';
    }

    getList(): t_s_singlearenarewardsData[] {
        let obj = ConfigMgr.Instance.getDicSync(ConfigType.t_s_singlearenarewards);
        let arrs = [];
        if (obj && obj['Type1']) {
            for (const i in obj['Type1']) {
                if (Object.prototype.hasOwnProperty.call(obj['Type1'], i)) {
                    arrs.push(obj['Type1'][i]);
                }
            }
        }
        
        return arrs;
    }

    renderListItem(index: number, item: ColosseumRewardsItem) {
        item.setInfo(this.rewardList[index]);
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }
}
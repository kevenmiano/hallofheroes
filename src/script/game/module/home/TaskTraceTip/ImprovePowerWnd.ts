
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import FightIngModel from "../../../mvc/model/FightIngModel";
import ImprovePowerItem from "./ImprovePowerItem";
/**
 *  战败提示优化

新增首充礼包，调整优先级，其他不做修改
优先级从高到低为——
1、首充礼包，点击打开首充界面。若已充值并领取完，则不提示
2、强化装备，点击打开铁匠铺界面。若武器和衣服强化均高于5，则不提示
3、升级士兵，点击打开兵营界面。若当前携带士兵等级高于20级，则不提示
4、升级科技，点击打开神学院界面。若有任意科技高于20级，则不提示
5、学习公会技能，点击打开公会技能界面。若有任意公会技能高于3级，或没有公会技能塔，则不提示
6、升级星运，点击打开星运界面。若有任意星运高于3级，则不提示
 */
export default class ImprovePowerWnd extends BaseWindow{
    public frame:fgui.GLabel;
	public list:fgui.GList;
    private _dataList:Array<FightIngModel> = [];
    public OnInitWind() {
        super.OnInitWind();
        this.initView();
        this.addEvent();
        this.setCenter();
        this.refreshFightingView();
    }

    private initView() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("fighting.FightingFrame.title.text");
    }

    private onListItemRender(index:number, item:ImprovePowerItem)
    {
        if(index < 3){//最多3条
            item.info = this._dataList[index];
        }
    }

    private addEvent(){
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
    }

    private removeEvent(){
        Utils.clearGListHandle(this.list);
    }

    private refreshFightingView(){
        this._dataList = this.frameData;
        let len = Math.min(3,this._dataList.length);
        this.list.numItems = len;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        this.removeEvent();
        super.dispose(dispose);
    }
}
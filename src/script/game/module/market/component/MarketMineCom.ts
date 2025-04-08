import FUI_MarketMineCom from "../../../../../fui/Market/FUI_MarketMineCom";
import LangManager from "../../../../core/lang/LangManager";
import MarketMineItem from "./MarketMineItem";
import IMarketOrderMsg = com.road.yishi.proto.market.IMarketOrderMsg;
import MarketManager from "../../../manager/MarketManager";

export default class MarketMineCom extends FUI_MarketMineCom {

    private _marketOrders: IMarketOrderMsg[];

    protected onConstruct(): void {
        super.onConstruct();
        this.init();
    }

    private init() {
        this.initTranslate();
        this.goodsList.setVirtual();
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.onMarkMineItemRender, null, false);
    }


    private onMarkMineItemRender(index: number, item: MarketMineItem) {
        item.info = this._marketOrders[index]
        item.myCancelBtn.onClick(this, this.onCancelPush, [item])
        item.myGetBtn.onClick(this, this.onGetCash, [item])
    }


    public setInfoList(marketOrders: IMarketOrderMsg[]) {
        this._marketOrders = marketOrders;
        this.goodsList.numItems = this._marketOrders.length;
    }

    private initTranslate() {
        this.stateLab.text = LangManager.Instance.GetTranslation("Market.mine.state");
        this.mineLab.text = LangManager.Instance.GetTranslation("Market.mine.my");
        this.wantLab.text = LangManager.Instance.GetTranslation("Market.mine.want");
    }

    public updateList(){
        this.goodsList.refreshVirtualList();
    }

    public scrollToTop(){
        this.goodsList.scrollToView(0); 
    }

    //取消发布
    private onCancelPush(v, e, items: MarketMineItem[]) {
        let item = items[0];
        let info = item.info
        MarketManager.Instance.reqMarketOrderOpertion(2, info.orderId, info.type, info.templateId, info.count, info.point);
    }

    //提取
    private onGetCash(v, e, items: MarketMineItem[]) {
        let item = items[0];
        let info = item.info
        MarketManager.Instance.reqMarketOrderOpertion(3, info.orderId, info.type, info.templateId, info.count, info.point);
    }

}
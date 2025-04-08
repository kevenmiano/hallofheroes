import FUI_GemMazeBoxCom from "../../../../../fui/GemMaze/FUI_GemMazeBoxCom";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { BaseItem } from "../../../component/item/BaseItem";
import { GemMazeEvent } from "../../../constant/event/NotificationEvent";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { Enum_BoxState } from "../../bag/model/Enum_BagState";
import GemMazeModel from "../model/GemMazeModel";
import GemMazeBoxItem from "./item/GemMazeBoxItem";
/**
 * 夺宝奇兵宝箱积分组件
 */
export default class GemMazeBoxCom extends FUI_GemMazeBoxCom{

    private _boxCount:number = 5;
    private _MCEFF_MINY:number = 592;
    private SORT_INDEX_ARRAY:Array<number> = [500, 1000, 2000, 3500, 6000];
    private BOX_INDEX_ARR:Array<number> = [1,2,4,8,16];

    private movie:fairygui.GMovieClip;

    // private _boxArr:Array<any>;
    private _model:GemMazeModel;
    public get model():GemMazeModel
    {
        this._model = GemMazeManager.Instance.model;
        return this._model;
    }

    protected onConstruct() {
        super.onConstruct();
       
        this.initEvent();
        for (let i = 0; i < this.SORT_INDEX_ARRAY.length; i++) {
            const element = this.SORT_INDEX_ARRAY[i];
            (this['txt_point'+(i+1)] as fairygui.GTextField).text = element+'';
        }
        this.bar_com.getChild('maskImg').asImage.fillAmount = 1;
        this.movie = this.bar_com.getChild('ani').asMovieClip;
        this.movie.y = 484;
    }

    private initView(){
        // this._boxArr = [];
        let score:number = this.model.gemMazeInfo.score;
        if(score > this.SORT_INDEX_ARRAY[4]){
            this.movie.y = 0;
            return;
        }
        var _y:number;
        if(score <= this.SORT_INDEX_ARRAY[0])
        {
            _y = score / this.SORT_INDEX_ARRAY[0] * 40;	
        }
        else if(this.SORT_INDEX_ARRAY[0] < score && score  <= this.SORT_INDEX_ARRAY[1])
        {
            _y = 40 + (score - this.SORT_INDEX_ARRAY[0]) / (this.SORT_INDEX_ARRAY[1] - this.SORT_INDEX_ARRAY[0]) * 110;  //552 - 477 = 75
        }
        else if(this.SORT_INDEX_ARRAY[1] < score && score <= this.SORT_INDEX_ARRAY[2])
        {
            _y = 40 + 110 + (score - this.SORT_INDEX_ARRAY[1]) / (this.SORT_INDEX_ARRAY[2] - this.SORT_INDEX_ARRAY[1]) * 110;  //477 - 397 = 80
        }
        else if(this.SORT_INDEX_ARRAY[2] < score && score <= this.SORT_INDEX_ARRAY[3])
        {
            _y = 40 + 110 + 110 + (score - this.SORT_INDEX_ARRAY[2]) / (this.SORT_INDEX_ARRAY[3] - this.SORT_INDEX_ARRAY[2]) * 110; //397 - 317
        }
        else if(this.SORT_INDEX_ARRAY[3] < score && score <= this.SORT_INDEX_ARRAY[4])
        {
            _y = 40 + 110 + 110 + 110 + (score - this.SORT_INDEX_ARRAY[3]) / (this.SORT_INDEX_ARRAY[4] -this.SORT_INDEX_ARRAY[3]) * 110; //317 - 242
        }
        Laya.Tween.to(this.movie,{y:484-_y},300);
    }



    updateView(){
        this.initView();
        this.updateBox();
    }

    private initEvent():void
    {
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_UPDATE_BOX_STATUS, this.updateBox,this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_PLAYER_BOX_GOODS, this.onPlayer,this);
    }

    private removeEvent():void
    {
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_UPDATE_BOX_STATUS, this.updateBox,this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_PLAYER_BOX_GOODS, this.onPlayer,this);
    }

    onUpdateScore(arr:any):void
    {
        for(let i = 0; i < arr.length; i++)
        {
            setTimeout(this.showAddPoint.bind(this), 200 * i, arr[i]);
        }
    }

    /**
     * 显示添加积分
     * @param addIntergal 
     */
    public showAddPoint(point:number):void
    {
        let txtColor:string = "#FFFFFF";
        if(point > 20) txtColor = "#FFFF00";
        if(point > 80) txtColor = "#CEA031";
        
        let txt:fgui.GBasicTextField = new fgui.GBasicTextField();
        txt.color = txtColor;
        txt.bold = true;
        txt.fontSize = 18;
        let str = LangManager.Instance.GetTranslation("gemMaze.GemMazeBoxView.showAddIntergal", point);
        txt.text = str;
        txt.x = 220;
        txt.y = 650;
        this.addChild(txt);
        TweenMax.to(txt,1,{y:500, onComplete:this.onShowAddIntergalComplete,onCompleteParams:[txt]});
    }

    private onShowAddIntergalComplete(txt:fgui.GTextField):void
    {
        TweenMax.to(txt,1,{y:300, alpha:0, onComplete:this.onMoveAddIntergalComplete,onCompleteParams:[txt]});
    }

    private onMoveAddIntergalComplete(txt:fgui.GTextField):void
    {
        txt.removeFromParent();
    }

    /**
     * 更新宝箱状态
     */
    private updateBox():void
    {
        let score:number = this.model.gemMazeInfo.score;
        let boxItem:GemMazeBoxItem;
        for(let i = 1; i <= this.SORT_INDEX_ARRAY.length; i++)
        {
            boxItem = this['box'+i] as GemMazeBoxItem;
            boxItem.boxIndex = i;
            boxItem.filters = [UIFilter.grayFilter];				
            boxItem.setStatus(Enum_BoxState.Unlock);
        
            if(score >= this.SORT_INDEX_ARRAY[i-1])
            {
                boxItem.filters = [];
                boxItem.onClick(this,this.onBoxClick,[i-1]);	
                boxItem.setStatus(Enum_BoxState.Available);
                if(this.model.gemMazeInfo.boxMarkArr[i-1] == 1)
                {						
                    boxItem.setStatus(Enum_BoxState.Received);
                    boxItem.offClick(this, this.onBoxClick);
                }
            }
        }
    }

    private clickBoxIndex:number; //当前点击领取奖励的宝箱Id
    private onBoxClick(idx):void
    {
        this.clickBoxIndex = idx;
        var boxIndex:number = this.BOX_INDEX_ARR[this.clickBoxIndex];
        GemMazeManager.Instance.getBoxGoods(boxIndex);
    }

    /**
     * 播放积分宝箱领取奖励动画 
     * @param evt
     * 
     */		
    private onPlayer(idArr:any):void
    {
        if(idArr == null) return;
       
        for(let i = 0; i < idArr.length; i++)
        {
            setTimeout(this.createIconAnime.bind(this),200 * i ,idArr[i]);
        }
    }

    /**
     * 创建物品掉落动画 
     * 
     */		
    private createIconAnime(rewardId:number):void
    {
        // if(this.stage == null) return;
        // let _icon:BaseItem = new BaseItem();
        // _icon.icon = IconFactory.getGoodsIconByTID(rewardId);	
        
        GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_BAG);
    }

    /**
     * 物品图标加载完成后执行回调方法
     * @param icon
     * 
     */
    // private iconComplete(icon:any=null):void
    // {	
    //     let boxItem:GemMazeBoxItem = this['box'+this.clickBoxIndex];
    //     var point:Laya.Point = new Laya.Point(boxItem.x, boxItem.y);
    //     let pt = this.localToGlobal(point.x,point.y);
    //     icon.x = pt.x;
    //     icon.y = pt.y;
    //     icon.mouseChildren = icon.mouseEnabled = false;
    //     var bagPoint:Laya.Point = this.localToGlobal(745, 200);
    //     if(icon)
    //     {
    //         TweenMax.to(icon, 1, {delay:0.4,bezierThrough:[{x:icon.x, y:icon.y}, {x:bagPoint.x+40, y:bagPoint.y+30}],
    //             scaleX:0.3, scaleY:0.3, orientToBezier:false,ease:Quart.easeIn,
    //             onUpdate:function():void{if(!icon.parent)Laya.stage.addChild(icon)},
    //             onComplete:this._moveComplete,onCompleteParams:[icon]});
    //     }
    // }

    /**
     * Tween完成调用方法
     * @param icon
     * 
     */		
    // private _moveComplete(icon:any):void
    // {
    //     TweenMax.to(icon,0.5,{alpha:0,onComplete:this.disapearComplete,onCompleteParams:[icon]});
    // }

    /**
     * dispose物品掉落动画
     * @param icon
     * 
     */		
    // private disapearComplete(icon:any):void
    // {
    //     ObjectUtils.disposeObject(icon);
    //     GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_BAG);
    // }

    dispose(): void {
        super.dispose();
        this.removeEvent();
    }

}
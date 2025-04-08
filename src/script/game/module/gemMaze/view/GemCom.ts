// @ts-nocheck
import FUI_GemCom from "../../../../../fui/GemMaze/FUI_GemCom";
import LangManager from "../../../../core/lang/LangManager";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { BaseItem } from "../../../component/item/BaseItem";
import { GemMazeEvent } from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import FUIHelper from "../../../utils/FUIHelper";
import GemInfoUpdateInfoVO from "../model/GemInfoUpdateInfoVO";
import GemMazeGemInfoVO from "../model/GemMazeGemInfoVO";
import GemMazeModel from "../model/GemMazeModel";
import GemCell from "./item/GemCell";

/**
 * 夺宝奇兵宝石矩阵
 */
 export default class GemCom extends FUI_GemCom{

    private beginX:number = 28;
    private beginY:number = 20;
    private offsetX:number = 0;
    private offsetY:number = 0;
    private Gem_Width:number = 107;
    private  Gem_Height:number = 105;

    private _gemCellArr:Array<GemCell>;
    private _model:GemMazeModel;
    private _currentGemCell:GemCell;

    private _isAction:boolean = false; //是否正在播放消除移动添加动画
    private gemInfoUpdateInfoVO:GemInfoUpdateInfoVO; //当前回合宝石更新数据

    
    public get isAction() : boolean {
        return this._isAction
    }
    
    protected onConstruct() {
        super.onConstruct();
        this._model = GemMazeManager.Instance.model;
        this._gemCellArr = [];
        this.initEvent();
    }

    private initEvent():void
    {
        // GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GET_INIT_INFO, this.onGetInitInfo,this);
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_UPDATE_INFO, this.onUpdateGemInfo,this);
        // GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GEM_PLAYER_GOODS_FLY, this.onGoodsFly,this);
    }

    private removeEvent():void
    {
        for(let i = 0; i < this._gemCellArr.length; i++)
        {
            this._gemCellArr[i].offClick(this, this.onCellClick);
        }
        // GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GET_INIT_INFO, this.onGetInitInfo,this);
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_UPDATE_INFO, this.onUpdateGemInfo,this);
        // GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GEM_PLAYER_GOODS_FLY, this.onGoodsFly,this);
    }

    private onUpdateGemInfo():void
    {	
        //等服务器返回移动结果后再执行移动动画 ??
        if(this._isAction) return;
        this.updateGemInfo();
    }

    private updateGemInfo():void
    {			
        this.gemInfoUpdateInfoVO = this._model.updateSignUpdateData();
        this._isAction = true;
        this.updateRemoveData();			
    }

    //更新移除的宝石数据
    private updateRemoveData():void
    {
        let gemCell:GemCell;
        for(let i = 0; i < this.gemInfoUpdateInfoVO.gemDelArr.length; i++)
        {
            let gemInfo:GemMazeGemInfoVO = this.gemInfoUpdateInfoVO.gemDelArr[i];
            gemCell = this.getGemCellByIndex(gemInfo.index);
            if(gemCell == null) continue;
            gemCell.offClick(this, this.onCellClick);
            gemCell.gemInfo.nextIndex = -1;
            gemCell.gemInfo.isRemove = true;
            gemCell.playAni();
            this.delGemCellByIndex(gemInfo.index);
        }
        GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_REMOVE_COMPLETE, this.updateAddAndNew,this);				
        GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_PLAYER_GRAIN);
        GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_GEM_UPDATE_FRAME);
    }

    public updateView():void
    {
        //刷新界面之前先移除之前的界面内容
        for (let j = 0; j < this._gemCellArr.length; j++) {
            const element = this._gemCellArr[j];
            if(element && element.parent){
                element.parent.removeChild(element);
            }
        }
        this._gemCellArr.length = 0;

        let gemArr = this._model.gemMazeInfo.gemArr;
        if(gemArr.length == 0) return;
        let gemCell:GemCell;
        for(let i:number = 0; i < gemArr.length; i++)
        {
            gemCell = FUIHelper.createFUIInstance('GemMaze','GemCell');
            gemCell.gemInfo = this._model.gemMazeInfo.gemArr[i];
            this.addChild(gemCell);
            gemCell.scaleX = 1.64;
            gemCell.scaleY = 1.64;
            gemCell.x = this.getXByIndex(gemCell.gemInfo.index); 
            gemCell.y = this.getYByIndex(gemCell.gemInfo.index); 
            gemCell.onClick(this, this.onCellClick,[gemCell]);
            this._gemCellArr.push(gemCell);
        }
        
        // else
        // {
        //     for(let j = 0; j < this._gemCellArr.length; j++)
        //     {
        //         gemCell = this._gemCellArr[j];
        //         this.addChild(gemCell);
        //         gemCell.onClick(this, this.onCellClick,[gemCell]);
        //     }
        // }
    }

    //宝石点击事件处理器
    private onCellClick(gemCell:GemCell):void
    {
        if(!this._model.canMoveGemByUser) return;
        if(this._isAction) return;
        if(this._model.gemMazeInfo.timesLeft <= 0)
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("gemMaze.GemMazeView.TipsTxt"));
            return;
        }
        this.setCurrentCell(gemCell);
    }

    private _indexBegin:number=0;
    private _indexEnd:number=0;
    /**
     * 处理当前点击的宝石, 设置为选中、判断是否可以消除。。。
     * @param gemCell 
     * @returns 
     */
    private setCurrentCell(gemCell:GemCell):void
    {
        if(!this._currentGemCell)
        {
            this._currentGemCell = gemCell;
            gemCell.cellSelected = true;
            this.img_select.setXY(gemCell.x - 10,gemCell.y-10);
            this.img_select.visible = true;
            return;
        }
        
        if(this._currentGemCell == gemCell) //点击已选中的宝石, 则取消选中
        {
            this._currentGemCell.cellSelected = false;
            this._currentGemCell = null;
            this.img_select.visible = false;
            return;
        }
        if(!this.isUpon(this._currentGemCell, gemCell)) //如果2个宝石不相邻, 更换选中宝石
        {
            this._currentGemCell.cellSelected = false;
            this._currentGemCell = gemCell;
            this._currentGemCell.cellSelected = true;
            this.img_select.setXY(gemCell.x - 10,gemCell.y-10);
            this.img_select.visible = true;
        }else //交换宝石位置, 发送协议到服务器, 取消宝石选中
        {
            let itemCount:number = GoodsManager.Instance.getMazeBagList().getList().length;
            if(itemCount >= 48)
            {
                let str:string = LangManager.Instance.GetTranslation("gemMaze.gemMazeView.BagFullTips");
                MessageTipManager.Instance.show(str);
                this.removeSelected();
                return;
            }
            this._model.canMoveGemByUser = false;
            this._indexBegin = this._currentGemCell.gemInfo.index;
            this._indexEnd = gemCell.gemInfo.index;
            let  _gemIndex:number = this._currentGemCell.gemInfo.index;
            this._currentGemCell.gemInfo.index = gemCell.gemInfo.index;
            gemCell.gemInfo.index = _gemIndex;
            gemCell.action(this._currentGemCell.x, this._currentGemCell.y);
            this._currentGemCell.action(gemCell.x, gemCell.y);
            GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GEM_ACTION_COMPLETE, this.onReplacePosComplete,this);
            this._currentGemCell.cellSelected = gemCell.cellSelected = false;
            this._currentGemCell = null;
            this.img_select.visible = false;
        }
    }

    //交换位置完成, 发送到服务器
    private onReplacePosComplete():void
    {	
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GEM_ACTION_COMPLETE, this.onReplacePosComplete,this);
        GemMazeManager.Instance.moveGem(this._indexBegin, this._indexEnd);
    }

    private updateAddAndNew():void
    {
        GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_ADD_INTERGAL, this.gemInfoUpdateInfoVO.addIntergal);
      
        for(let i = 0; i < this.gemInfoUpdateInfoVO.rewardInfo.rewardIdArr.length; i++)
        {
            setTimeout(this.createIconAnime.bind(this), 200 * i, this.gemInfoUpdateInfoVO.rewardInfo.rewardIdArr[i].rewardId);
        }
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_REMOVE_COMPLETE, this.updateAddAndNew,this);
        
        this.updateMoveData();
        this.updateAddData();
        this.updateAllGem();
    }

    //更新所有宝石
    private updateAllGem():void
    {
        let _x:number=0;
        let _y:number=0;
        let gemCell:GemCell;
        let moveGem:GemCell;
        for(let i = 0; i < this._gemCellArr.length; i++)
        {
            gemCell = this._gemCellArr[i];
            if(gemCell.gemInfo.isMove || gemCell.gemInfo.isAdd)
            {
                let nextIndex:number = gemCell.gemInfo.nextIndex;
                _x = this.getXByIndex(nextIndex);
                _y = this.getYByIndex(nextIndex);
                gemCell.action(_x, _y);
                gemCell.gemInfo.index = nextIndex;
                moveGem = gemCell;
            }
        }
        this._model.setAllGemStatus();			
        if(this._model.gemUpdateArr.length != 0 && moveGem != null)
        {				
            GemMazeManager.Instance.addEventListener(GemMazeEvent.GEMMAZE_GEM_ACTION_COMPLETE, this.onAllMoveComplete,this);
        }
        else
        {
            Laya.timer.once(300,this,function(){
                this._isAction = false;
            })
        }
    }	

    private onAllMoveComplete():void
    {
        GemMazeManager.Instance.removeEventListener(GemMazeEvent.GEMMAZE_GEM_ACTION_COMPLETE, this.onAllMoveComplete,this);
        this.updateGemInfo();
    }

    //更新新增的宝石数据
    private updateAddData():void
    {		
        this.img_select.visible = false;
        let j:number = 0;
        for(let i = 0; i < this._model.gemMazeInfo.gemArr.length; i++)
        {
            let info:GemMazeGemInfoVO = this._model.gemMazeInfo.gemArr[i];
            if(info && info.isRemove && info.nextIndex == -1)
            {
                // if(this.gemInfoUpdateInfoVO.gemAddArr[j]){
                //     info.type = this.gemInfoUpdateInfoVO.gemAddArr[j].type;
                //     info.nextIndex = this.gemInfoUpdateInfoVO.gemAddArr[j].index;
                // }else
                // {
                //     Logger.error('gemAddArr',this.gemInfoUpdateInfoVO.gemAddArr,'j',j);
                // }

                info.type = this.gemInfoUpdateInfoVO.gemAddArr[j].type;
                info.nextIndex = this.gemInfoUpdateInfoVO.gemAddArr[j].index;
                info.isAdd = true;		
                let gemCell:GemCell = FUIHelper.createFUIInstance('GemMaze','GemCell');		
                gemCell.gemInfo = info;
                gemCell.x = this.getXByIndex(info.nextIndex);
                gemCell.y = 0 - this.Gem_Height - 5;
                gemCell.scaleX = 1.64;
                gemCell.scaleY = 1.64;
                this.addChild(gemCell);
                gemCell.onClick(this, this.onCellClick,[gemCell]);
                this._gemCellArr.push(gemCell);
                j++;					
            }
        }
    }

    //更新移动的宝石数据
    private updateMoveData():void
    {
        let gemCell:GemCell;
        for(let i = 0; i < this._gemCellArr.length; i++)
        {
            gemCell = this._gemCellArr[i];
            if(gemCell.gemInfo.nextIndex != -1)
            {
                let count:number = this.getDownCount(gemCell.gemInfo.index);
                // Logger.log('updateMoveData-->getDownCount:',count,'gemCell.gemInfo.index',gemCell.gemInfo.index);
                gemCell.gemInfo.nextIndex = gemCell.gemInfo.index + count * 5;
                if(count > 0) 
                {
                    gemCell.gemInfo.isMove = true;
                    // Logger.log('updateMoveData: index:',gemCell.gemInfo.index,'nextIndex:',gemCell.gemInfo.nextIndex);
                }
            }
        }
    }

    /**
     * 创建物品掉落动画 
     * 
     */		
    private createIconAnime(rewardId:number):void
    {
        let item:BaseItem = FUIHelper.createFUIInstance(EmPackName.Base,'BaseItem');
        let boxItemInfo:GoodsInfo = new GoodsInfo();
        boxItemInfo.templateId = rewardId;
        item.info = boxItemInfo;
        item.setXY(this.x+ this.width/2-item.width/2,this.y);
        if(this.parent){
            this.parent.addChild(item);
        }
        Laya.Tween.to(item,{x:1033+280/2,y:312+344/2,scaleX:0.3,scaleY:0.3},1000,Laya.Ease.quintIn,Laya.Handler.create(this,this._moveComplete,[item]))
    }
    
    /**
     * Tween完成调用方法
     * @param icon
     */		
    private _moveComplete(icon:BaseItem):void
    {
        TweenMax.to(icon,0.5,{alpha:0,onComplete:this.disapearComplete,onCompleteParams:[icon]});
    }

    /**
     * dispose物品掉落动画
     * @param icon
     * 
     */		
    private disapearComplete(icon:BaseItem):void
    {
        ObjectUtils.disposeObject(icon);
        GemMazeManager.Instance.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_BAG);
    }

    /**
     * 移除选中
     */		
    public removeSelected():void
    {
        if(this._currentGemCell){
            this._currentGemCell.cellSelected = false;
            this._currentGemCell = null;
            this.img_select.visible = false;
        } 
    }

    /**
     * 判断2个宝石是否是相邻
     * @param gemCellA 
     * @param gemCellB 
     * @returns 
     */
    private isUpon(gemCellA:GemCell, gemCellB:GemCell):Boolean
    {
        let  b:boolean = false;			
        if(gemCellA.gemInfo.index == gemCellB.gemInfo.index + 1) b = true;
        if(gemCellA.gemInfo.index == gemCellB.gemInfo.index - 1) b = true;
        if(gemCellA.gemInfo.index == gemCellB.gemInfo.index + 5) b = true;
        if(gemCellA.gemInfo.index == gemCellB.gemInfo.index - 5) b = true;
        if(gemCellA.gemInfo.index % 5 == 0 && gemCellB.gemInfo.index == (gemCellA.gemInfo.index - 1)) b = false;
        if(gemCellB.gemInfo.index % 5 == 0 && gemCellB.gemInfo.index == (gemCellA.gemInfo.index + 1)) b = false;
        return b;
    }

    /**
     * 根据 index 计算宝石的X
     */
    private getXByIndex(_index:number):number
    {
        let  _x:number = this.beginX + (this.Gem_Width + this.offsetX) * (_index % 5);
        return _x;
    }

    /**
     * 根据 index 计算宝石的Y
     */
    private getYByIndex(_index:number):number
    {
        let  _y:number = this.beginY + (this.Gem_Height + this.offsetY) * Math.floor(_index / 5);
        return _y;
    }

    /**
     * 根据 index 获取宝石 view
     * @param _index 
     * @returns 
     */
    private getGemCellByIndex(_index:number):GemCell
    {
        let gemCell:GemCell;
        for(let i = 0; i < this._gemCellArr.length; i++)
        {
            if(this._gemCellArr[i].gemInfo.index == _index)
            {
                gemCell = this._gemCellArr[i]; 
            }
        }
        return gemCell;
    }

    /**
     * 根据 index 删除宝石view
     * @param _index 
     */
    private delGemCellByIndex(_index:number):void
    {
        // let gemCell:GemCell;
        for(let i = 0; i < this._gemCellArr.length; i++)
        {
            if(this._gemCellArr[i].gemInfo.index == _index)
            {
                this._gemCellArr.splice(i, 1); 
            }
        }
    }

    private getDownCount(_index:number):number
    {
        let count:number=0;
        while(_index + 5 < 25)
        {
            _index += 5;
            let  gemMazeGemInfoVO:GemMazeGemInfoVO = this._model.gemMazeInfo.getGemMazeGemInfoVOByIndex(_index);
            if(gemMazeGemInfoVO == null) return 0;
            if(gemMazeGemInfoVO.nextIndex == -1)
            {
                count++;
            }
        }
        return count;
    }

    //物品飞落监听处理器
    private onGoodsFly(evt:GemMazeEvent):void
    {
        // this.createIconAnime(evt.data);  //2129400
    }

    /**
     * 执行清除操作,  方便内存回收
     * 实现 Disposeable 接口
     */		
    public dispose():void
    {   
        this.removeEvent();
        this._gemCellArr.length=0;
        TweenMax.killChildTweensOf(this);
        this.removeFromParent();
        ObjectUtils.disposeAllChildren(this);
        super.dispose();
    }
 }
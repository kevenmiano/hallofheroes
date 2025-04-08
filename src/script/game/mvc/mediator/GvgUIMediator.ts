// @ts-nocheck
import IMediator from "../../interfaces/IMediator";
import {IEnterFrame} from "../../interfaces/IEnterFrame";
import UIManager from "../../../core/ui/UIManager";
import {EmPackName, EmWindow} from "../../constant/UIDefine";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {CampaignManager} from "../../manager/CampaignManager";
import {CampaignMainBuidingLayer} from "../../map/campaign/view/layer/CampaignMainBuidingLayer";
import {CampaignNpcPhysics} from "../../map/campaign/view/physics/CampaignNpcPhysics";
import {CampaignNode} from "../../map/space/data/CampaignNode";
import ObjectUtils from "../../../core/utils/ObjectUtils";

/**
 *
 * 公会战ui管理
 *
 */
export class GvgUIMediator implements IMediator, IEnterFrame
{
    private _btnDic:Map<CampaignNpcPhysics, fgui.GButton> = new Map();
    private _uiSprite:Laya.Sprite;
    private _itemDic:Map<Laya.Sprite, CampaignNpcPhysics> = new Map();
    /** 图腾柱nodeId*/
    private towersId:number[] = [450105, 450106, 450107, 450108];
    /** 结界塔nodeId*/
    private towersId2:number[] = [450102, 450104];

    constructor()
    {
    }

    /**
     *
     * @param target mapview
     */
    public register(target:Object):void
    {
        this._uiSprite = new Laya.Sprite();
        this._uiSprite.name = "操作按钮层";
        (target as Laya.Sprite).addChild(this._uiSprite);
        UIManager.Instance.ShowWind(EmWindow.GvgBattleWnd);

        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    /**
     * 每帧检测 如果图腾或者结界塔被移出舞台 相应的按钮也应该移出舞台 <br/>
     * 重新添加到舞台时 也把按钮加入舞台
     */
    public enterFrame():void
    {
        //遍历CampaignMainBuidingLayer 为每个节点加上一个快捷攻击按钮
        let layer:CampaignMainBuidingLayer = CampaignManager.Instance.mapView.mainBuidingLayer;
        for(let displayObject of layer.items.values())
        {
            if(displayObject instanceof CampaignNpcPhysics)
            {
                let npcView:CampaignNpcPhysics = displayObject as CampaignNpcPhysics;
                let styleName:string = "";
                let pos:Laya.Point = new Laya.Point();
                let campaignNode:CampaignNode = npcView.info as CampaignNode;
                if(this.towersId.indexOf(campaignNode.nodeId) >= 0)
                {
                    //图腾
                    styleName = "gvg.OccupyBtn";
                    pos.x = -46;
                    pos.y = -108;
                }
                else if(this.towersId2.indexOf(campaignNode.nodeId) >= 0)
                {
                    //基地
                    styleName = "gvg.AttactBtn";
                    let selfTeamId:number = CampaignManager.Instance.mapModel.selfMemberData.teamId;
                    let nodeTeamId:number = (npcView.info as CampaignNode).param1;
                    if(nodeTeamId > 0 && nodeTeamId == selfTeamId)
                    {
                        continue;
                    }
                    if(450102 == campaignNode.nodeId)
                    {
                        pos.x = -164;
                        pos.y = -230;
                    }
                    else
                    {
                        pos.x = 62;
                        pos.y = -230;
                    }
                }
                else
                {
                    continue;
                }

                let fguiBtn:fgui.GButton = this._btnDic.get(npcView);
                if(!fguiBtn)
                {
                    fguiBtn = fgui.UIPackage.createObject(EmPackName.Base, "CommonBtn").asButton;
                    fguiBtn.icon = fgui.UIPackage.getItemURL(EmPackName.Base, styleName);
                    fguiBtn.onClick(this, this.__onClickHandler, [npcView]);
                    this._btnDic.set(npcView, fguiBtn);
                }
                this._itemDic.set(fguiBtn.displayObject, npcView);

                if(!npcView.parent)
                {
                    fguiBtn.displayObject.removeSelf();
                }
                else
                {
                    if(fguiBtn && !fguiBtn.parent)
                    {
                        fguiBtn.x = npcView.x + pos.x;
                        fguiBtn.y = npcView.y + pos.y;
                        this._uiSprite.addChild(fguiBtn.displayObject);
                    }
                }
            }
        }
    }

    private __onClickHandler(nodeView:CampaignNpcPhysics):void
    {
        nodeView.mouseClickHandler(null);
    }

    private clearAllBtn():void
    {
        this._btnDic.forEach((fguiBtn, key, map) =>
        {
            if(fguiBtn)
            {
                fguiBtn.offClick(this, this.__onClickHandler);
                fguiBtn.displayObject.removeSelf();
                fguiBtn.dispose();
            }
        }, this);

        this._btnDic.clear();
        this._btnDic = null;
        this._itemDic.clear();
        this._itemDic = null;
    }

    /**
     *
     * @param target
     */
    public unregister(target:Object):void
    {
        this.clearAllBtn();
        ObjectUtils.disposeObject(this._uiSprite);
        this._uiSprite = null;
        UIManager.Instance.HideWind(EmWindow.GvgBattleWnd);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
}
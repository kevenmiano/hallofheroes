// @ts-nocheck
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { PathManager } from "../../../../manager/PathManager";
import { MonopolyNodeInfo } from "../../../../module/monopoly/model/MonopolyNodeInfo";
import FUIHelper from "../../../../utils/FUIHelper";
import { MapPhysicsBase } from "./MapPhysicsBase";

export class MonopolyEventView extends MapPhysicsBase {
    private _monopolyNodeInfo:MonopolyNodeInfo;

    constructor(monopolyNodeInfo:MonopolyNodeInfo) {
		super();
        this._monopolyNodeInfo = monopolyNodeInfo;
        this.mouseEnabled = false;
	}

    public mouseOverHandler(evt: Laya.Event): boolean {
		return false;
	}
	public mouseOutHandler(evt: Laya.Event): boolean {
		return false;
	}
	public mouseClickHandler(evt: Laya.Event): boolean {
		return false;
	}

    // public get resourcesPath(): string {
	// 	// if(this._monopolyNodeInfo.type == 2) // 宝箱类型
	// 	// 	{
	// 	// 		return 	PathManager.solveCampaignMovieByUrl("images/chest.swf");
	// 	// 	}
	// 	// return null;
	// }

    initView():void
    {
        // _eventIcon = ComponentFactory.Instance.creatComponentByStylename("monopoly.EventIcon");
        // _eventIcon.visible = false;
        // _eventIcon.setFrame(1);
        // _eventIcon.x = -60;
        // _eventIcon.y = -30;

        if(this._monopolyNodeInfo.type == 2){
            let mc =  FUIHelper.createFUIInstance(EmPackName.BaseCommon, "BoxMovieClip") as fgui.GMovieClip;
            if(mc){
                mc.x = -50;
                mc.y = -70;
                mc.scaleX = mc.scaleY = 0.7;
                this.movie.addChild(mc.displayObject);
            }
        }else
        {
            let path = 'icon/gamebox/node_type'+this._monopolyNodeInfo.type+'.png';
            let url = PathManager.resourcePath+path;
            this.img = new Laya.Image();
            this.img.anchorX = this.img.anchorY = 0.5;
            this.img.loadImage(url);
            // if(this._monopolyNodeInfo.type ==1){
            //     // this.img.y = -40;
            //     this.img.scaleX = this.img.scaleY = 0.9;
            // }else{
                this.img.y = -30;
            // }
            this.img.x = -60;
            this.movie.addChild(this.img);
           
        }
       
        // switch(_monopolyNodeInfo.type)
        // {
        //     case 1: // 陷阱
        //         _eventIcon.visible = true;
        //         _eventIcon.setFrame(3);
        //         break;
        //     case 4: // 镜像战斗
        //         _eventIcon.visible = true;
        //         _eventIcon.setFrame(4);
        //         break;
        //     case 3: // 随机移动
        //         _eventIcon.visible = true;
        //         _eventIcon.setFrame(5);
        //         break;
        //     case 9:  //起点
        //         _eventIcon.visible = true;
        //         _eventIcon.setFrame(1);
        //         break;
        //     case 10:  //终点
        //         _eventIcon.visible = true;
        //         _eventIcon.setFrame(2);
        //         break;
        //     default:
        //         _eventIcon.visible = false;
        //         break;
        // }
    }

    setHideView():void
    {
        this.visible = false;
    }
}
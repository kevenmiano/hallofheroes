// @ts-nocheck
import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { MovieClip } from "../../component/MovieClip";
import { t_s_mounttemplateData } from "../../config/t_s_mounttemplate";
import { EmWindow } from "../../constant/UIDefine";
import { SimpleMountInfo } from "../../datas/playerinfo/SimpleMountInfo";
import { AnimationManager } from "../../manager/AnimationManager";
import { PathManager } from "../../manager/PathManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { MyMountWnd } from "./MyMountWnd";

/**
 * @description玩家坐骑
 * @author zhihua.zhou
 */
export class PlayerMountWnd extends BaseWindow {
    private txt_name: fairygui.GBasicTextField;
    private txt0: fairygui.GTextField;
    private txt1: fairygui.GTextField;
    private txt2: fairygui.GTextField;
    private txt3: fairygui.GTextField;
    private txt4: fairygui.GTextField;
    private _resUrl: string = '';
    private _preUrl: string;
    private _cacheName: string;
    private _mountMovieClip: MovieClip;
    private template: t_s_mounttemplateData;
    private bgImg: fairygui.GImage;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.showMount(this.frameData);
    }

    private showMount(info: SimpleMountInfo): void {
        this.txt0.text = info.power.toString();
        this.txt1.text = info.intellect.toString();
        this.txt2.text = info.physique.toString();
        this.txt3.text = info.agility.toString();
        this.txt4.text = info.powerGp.toString();

        this.template = TempleteManager.Instance.getMountTemplateById(info.mountTempId);
        if (this.template) {
            this.txt_name.text = this.template.TemplateNameLang;
            this._resUrl = PathManager.resourcePath + "equip_show" + this.template.AvatarPath.toLocaleLowerCase() + "/2/2.json";
            ResMgr.Instance.loadRes(this._resUrl, (res) => {
                this.loaderCompleteHandler(res);
            }, null, Laya.Loader.ATLAS);
        }
    }

    /**
     * 加载坐骑动画完成后显示
     * @param res 
     * @returns 
     */
    private loaderCompleteHandler(res: any) {
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip.parent && this._mountMovieClip.parent.removeChild(this._mountMovieClip);
        }
        if (!res) {
            return;
        }
        this._preUrl = res.meta.prefix;
        this._cacheName = this._preUrl;
        let aniName = "";
        AnimationManager.Instance.createAnimation(this._preUrl, aniName, undefined, "", AnimationManager.MapPhysicsFormatLen);
        this._mountMovieClip = new MovieClip(this._cacheName);
        this.bgImg.displayObject.addChild(this._mountMovieClip);
        this._mountMovieClip.gotoAndStop(1);
        let frames = res.frames;
        let offsetX: number = 0;
        let offsetY: number = 0;
        if (res.offset) {
            let offset = res.offset;
            offsetX = offset.footX;
            offsetY = offset.footY;
        }
        let sourceSize = new Laya.Rectangle();
        for (let key in frames) {
            if (Object.prototype.hasOwnProperty.call(frames, key)) {
                let sourceItem = frames[key].sourceSize;
                sourceSize.width = sourceItem.w;
                sourceSize.height = sourceItem.h;
                break;
            }
        }
        this._mountMovieClip.pivotX = sourceSize.width >> 1;
        this._mountMovieClip.pivotY = sourceSize.height >> 1;
        // this._mountMovieClip.x = offsetX
        // this._mountMovieClip.y = offsetY

        let templateId = this.template.TemplateId
        if (templateId == 8026 || templateId == 8053) {
            //8026（火箭飞艇） 8053（囚牛）位置调右一点
            offsetX = 80;
            offsetY = 30;
        } else if (templateId == 3041) {
            // 恩克2000（3041）
            offsetX = 60;
            offsetY = 30;
        } else if (templateId == 8233) {
            // 图腾魔像（8233）
            offsetX = 20;
            offsetY = -40;
        } else if (templateId == 3069) {
            // 梦幻鹿（3069）
            offsetX = 120;
            offsetY = -20;
        } else if (templateId == 8160) {
            // 白金刚（8160）
            offsetX = 0;
            offsetY = 0;
        } else if (templateId == 8215) {
            // 独轮车（8215）
            offsetX = 50;
            offsetY = -30;
        } else if (templateId == 8204) {
            // 白羽（8204）
            offsetX = 50;
            offsetY = 0;
        } else {
            offsetX = 0;
            offsetY = 30;
        }
        this._mountMovieClip.x = (this.bgImg.width >> 1) + offsetX;
        this._mountMovieClip.y = (this.bgImg.height >> 1) + offsetY;
        this._mountMovieClip.gotoAndPlay(1, true);
    }

    public dispose() {
        super.dispose();
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip = null;
        }
        AnimationManager.Instance.clearAnimationByName(this._cacheName);
        let wnd: MyMountWnd = UIManager.Instance.FindWind(EmWindow.MyMountWnd);
        if (wnd && wnd.isShowing) {
            wnd.hide();
        }
    }
}
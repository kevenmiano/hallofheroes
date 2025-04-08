// @ts-nocheck
import FUI_MailAttachItem from '../../../../fui/Mail/FUI_MailAttachItem';
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import ResMgr from '../../../core/res/ResMgr';
import { IconFactory } from '../../../core/utils/IconFactory';
import Utils from '../../../core/utils/Utils';
import { BaseItem } from '../../component/item/BaseItem';
import { MovieClip } from '../../component/MovieClip';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { AnimationManager } from '../../manager/AnimationManager';
import StarInfo from './StarInfo';
/**
* @author:pzlricky
* @data: 2021-09-07 12:27
* @description 邮件附件Item
*/
export default class MailAttachItem extends FUI_MailAttachItem {

    private _movie: MovieClip = new MovieClip();

    constructor() {
        super();
    }


    private cellData;

    onConstruct() {
        super.onConstruct();
        this.itemIcon.displayObject.addChild(this._movie);
    }

    public set mailData(value) {
        this.cellData = value;
        if (value instanceof StarInfo) {
            this.starGroup.visible = true;
            this.base.visible = false;
            // 加载、播放、记录动画
            let realPath = IconFactory.getStarIconPath(value.template.Icon);
            ResMgr.Instance.loadRes(realPath, (res) => {
                if (!res) {
                    Logger.warn("[StarItem]info realPath assets is null", realPath)
                    return
                }
                if (!res.meta) {
                    Logger.warn("[StarItem]info realPath assets meta is null", realPath)
                    return
                }

                let prefix = res.meta.prefix;
                let frames = res.frames;
                let sourceSize = new Laya.Rectangle();
                for (let key in frames) {
                    if (Object.prototype.hasOwnProperty.call(frames, key)) {
                        let sourceItem = frames[key].sourceSize;
                        sourceSize.width = sourceItem.w;
                        sourceSize.height = sourceItem.h;
                        break;
                    }
                }
                let cacheName = prefix + String(value.template.Icon);
                let aniCahce = AnimationManager.Instance.getCache(cacheName)
                let success: boolean = true
                if (!aniCahce) {
                    success = AnimationManager.Instance.createAnimation(cacheName, "", 0)
                }
                Logger.xjy("[StarItem]info", cacheName, success, value);
                this.itemIcon.displayObject.addChild(this._movie);
                this._movie.visible = true
                this._movie.gotoAndPlay(0, true, cacheName);
                this._movie.pos((this.itemIcon.width - sourceSize.width) / 2, (this.itemIcon.height - sourceSize.height) / 2)
            })
            // this.txtLevel.text = LangManager.Instance.GetTranslation('public.level.name') + ": " + value.grade;
            this.txtName.text =LangManager.Instance.GetTranslation('public.level.name', value.template.TemplateNameLang,value.grade)
        } else if (value instanceof GoodsInfo) {
            this.starGroup.visible = false;
            this.base.visible = true;
            (this.base as BaseItem).info = value;
            // this.txtLevel.text = "";
            this.txtName.text = "";
        }
    }

    dispose() {
        if (this._movie && this._movie.parent)
            this._movie.parent.removeChild(this._movie);
        super.dispose();
    }

}
/*
 * @Author: jeremy.xu
 * @Date: 2022-04-08 14:37:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 15:13:09
 * @Description: 人物头顶信息分层；创建, 销毁, 显示, ALPHA分别共用同一个事件
 */

import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { eFilterFrameText, FilterFrameText } from '../../../component/FilterFrameText';
import { AvatarInfoTag } from "../../../constant/Const";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import { SpriteObject } from '../../../component/DisplayObject';
import { PathManager } from "../../../manager/PathManager";
import { AppellView } from "../../../avatar/view/AppellView";
import ChatData from "../../../module/chat/data/ChatData";
import ChatPopView from "../../../module/chat/ChatPopView";
import { FilterFrameShadowText } from "../../../component/FilterFrameShadowText";
import QQDawankaManager from "../../../manager/QQDawankaManager";

export class AvatarInfoUIData {
    public visible: boolean = true
    public alpha: number = 1

}

export class AvatarInfoUIName {
    public static SpaceSceneMapView = "SpaceSceneMapView";
    public static CampaignMapView = "CampaignMapView";
    public static OuterCityMap = "OuterCityMap";
}

export class AvatarInfoUILayerHandler {
    private static _handlerView: AvatarInfoUILayer;

    static setHandlerView(view: AvatarInfoUILayer, name: string = "") {
        Logger.warn("[AvatarInfoUILayer]设置handlerView", view, name);
        this._handlerView = view
    }

    static handle_CON_POSX(uuid: string, x: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conPosX(uuid, x);
    }
    static handle_CON_POSY(uuid: string, y: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conPosY(uuid, y);
    }
    static handle_CON_CREATE(uuid: string, type: AvatarInfoTag, obj?: any) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conCreate(uuid, type, obj)
    }
    static handle_CON_DISPOSE(uuid: string, type: AvatarInfoTag) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conDispose(uuid, type)
    }
    static handle_CON_VISIBLE(uuid: string, type: AvatarInfoTag, visible: boolean, force: boolean = false) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conVisible(uuid, type, visible, force);
    }
    static handle_CON_ALPHA(uuid: string, type: AvatarInfoTag, alpha: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__conAlpha(uuid, type, alpha);
    }
    static handle_NAME_TEXT(uuid: string, str: string) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__nickNameText(uuid, str);
    }
    static handle_NAME_FRAME(uuid: string, nameColor: number, type: eFilterFrameText) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__nickNameFrame(uuid, nameColor, type);
    }
    static handle_NAME_STROKE(uuid: string, colorIdx: number, width?: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__nickNameStroke(uuid, colorIdx, width);
    }
    static handle_NAME_BOLD(uuid: string, bold: boolean) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__nickNameBold(uuid, bold);
    }
    static handle_CONSORTIA_TEXT(uuid: string, str: string) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__consortiaNameText(uuid, str);
    }
    static handle_CONSORTIA_FRAME(uuid: string, nameColor: number, type: eFilterFrameText) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__consortiaNameFrame(uuid, nameColor, type);
    }
    static handle_CONSORTIA_STROKE(uuid: string, colorIdx: number, width?: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__consortiaNameStroke(uuid, colorIdx, width);
    }
    static handle_PET_STAR_NUM(uuid: string, mod: number) {
        if (!this._handlerView) {
            Logger.warn("[AvatarInfoUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__petStarNum(uuid, mod);
    }
}

export class AvatarInfoUILayer extends Laya.Sprite {
    public static GAPY_CONSORTIA = 20
    public static GAPY_APPELL = 4
    public static GAPX_VIP = 20
    public static GAPY_CHATPOP = 10
    public static GAPX_QQ_DWK = 30
    public static GAPY_QQ_DWK = 10

    private vipMap: Map<string, SpriteObject> = new Map();
    private chatPopViewMap: Map<string, ChatPopView> = new Map();
    private appellMap: Map<string, AppellView> = new Map();
    private qqDWKMap: Map<string, SpriteObject> = new Map();

    private petStarMap: Map<string, fgui.GComponent> = new Map();
    private petTailMap: Map<string, fgui.GMovieClip> = new Map();

    private nickNameMap: Map<string, FilterFrameShadowText> = new Map();
    private consortiaNameMap: Map<string, FilterFrameShadowText> = new Map();
    // 投影 只支持一种格式
    private nickNameShadowMap: Map<string, FilterFrameText> = new Map();
    private consortiaNameShadowMap: Map<string, FilterFrameText> = new Map();

    // 记录基点
    private conPosMap: Map<string, Laya.Point> = new Map();

    private _imgAppellLayer: Laya.Sprite;
    private _imgBaseCommonLayer: Laya.Sprite;
    private _txtLayer: Laya.Sprite;

    /** 玩家名字 */
    public __nickNameText(uuid: string, str: string) {
        // Logger.xjy("[AvatarInfoUILayer]__nickNameText  uuid=", uuid, "name=", str)
        let nickName = this.nickNameMap.get(uuid)
        if (nickName) {
            nickName.text = str
            nickName.name = str
        }
    }

    public __nickNameFrame(uuid: string, nameColor: number, type: eFilterFrameText) {
        let nickName = this.nickNameMap.get(uuid)
        if (nickName) {
            nickName.setFrame(nameColor, type)
        }
    }

    public __nickNameStroke(uuid: string, colorIdx: number, width?: number) {
        let nickName = this.nickNameMap.get(uuid)
        if (nickName) {
            nickName.setStroke(colorIdx, width)
        }
    }

    public __nickNameBold(uuid: string, bold: boolean) {
        let nickName = this.nickNameMap.get(uuid)
        if (nickName) {
            nickName.bold = bold;
        }
    }

    /** 公会名字 */
    public __consortiaNameText(uuid: string, str: string) {
        // Logger.xjy("[AvatarInfoUILayer]__consortiaNameText  uuid=", uuid, "name=", str)

        let consortiaName = this.consortiaNameMap.get(uuid)
        if (consortiaName) {
            consortiaName.text = str
            consortiaName.name = str
        }
    }

    public __consortiaNameFrame(uuid: string, nameColor: number, type: eFilterFrameText) {
        let consortiaName = this.consortiaNameMap.get(uuid)
        if (consortiaName) {
            consortiaName.setFrame(nameColor, type)
        }
    }

    public __consortiaNameStroke(uuid: string, colorIdx: number, width?: number) {
        let consortiaName = this.consortiaNameMap.get(uuid)
        if (consortiaName) {
            consortiaName.setStroke(colorIdx, width)
        }
    }

    public __petStarNum(uuid: string, mod: number) {
        let petStar = this.petStarMap.get(uuid)
        if (petStar) {
            for (let j: number = 0; j < 5; j++) {
                petStar.getChild("star" + (j + 1)).visible = j < mod
            }
        }
    }

    private alignNodesX(uuid: string) {
        let recordPos = this.conPosMap.get(uuid);
        if (!recordPos) {
            return
        }
        this.__conPosX(uuid, recordPos.x)
    }

    private alignNodesY(uuid: string) {
        let recordPos = this.conPosMap.get(uuid);
        if (!recordPos) {
            return
        }
        this.__conPosY(uuid, recordPos.y)
    }

    constructor() {
        super();
        this._txtLayer = new Laya.Sprite();
        this._imgBaseCommonLayer = new Laya.Sprite();
        this._imgAppellLayer = new Laya.Sprite();
        this.addChild(this._txtLayer)
        this.addChild(this._imgBaseCommonLayer)
        this.addChild(this._imgAppellLayer)
    }

    public __conCreate(uuid: string, type: AvatarInfoTag, obj?: any) {
        if (!uuid) return

        if (type == AvatarInfoTag.NickName) {
            if (obj) {
                this.nickNameCreate(uuid, undefined, obj.fontSize, obj.strokeColorIdx, obj.strokeWidth, obj.shadow, obj.bold)
            } else {
                this.nickNameCreate(uuid)
            }
        } else if (type == AvatarInfoTag.ConsortiaName) {
            if (obj) {
                this.consortiaNameCreate(uuid, undefined, obj.fontSize, obj.strokeColorIdx, obj.strokeWidth, obj.shadow, obj.bold)
            } else {
                this.consortiaNameCreate(uuid)
            }
        } else if (type == AvatarInfoTag.Appell) {
            let imgWidth: number = obj.imgWidth;
            let imgHeight: number = obj.imgHeight;
            let appellId: number = obj.appellId;
            let imgCount: number = obj.imgCount;
            this.appellCreate(uuid, imgWidth, imgHeight, appellId, imgCount)
        } else if (type == AvatarInfoTag.Vip) {
            this.vipCreate(uuid)
        } else if (type == AvatarInfoTag.PetTailMC) {
            this.petTailMCCreate(uuid)
        } else if (type == AvatarInfoTag.PetStar) {
            this.petStarCreate(uuid)
        } else if (type == AvatarInfoTag.PetQualityMC) {
            this.petQualityMCCreate(uuid)
        } else if (type == AvatarInfoTag.ChatPopView) {
            this.chatPopViewCreate(uuid, obj)
        } else if (type == AvatarInfoTag.QQ_DWK) {
            this.qqDWKCreate(uuid)
        }
    }

    public __conDispose(uuid: string, type: AvatarInfoTag) {
        if (!uuid) return
        if (type == AvatarInfoTag.PetInfo) {
            this.nickNameDispose(uuid)
            this.petTailMCDispose(uuid)
            this.petStarDispose(uuid)
            this.petQualityMCDispose(uuid)
        } else if (type == AvatarInfoTag.Info) {
            this.nickNameDispose(uuid)
            this.consortiaNameDispose(uuid)
            this.appellDispose(uuid)
            this.vipDispose(uuid)
            this.chatPopViewDispose(uuid)
            this.qqDWKDispose(uuid)
        } else if (type == AvatarInfoTag.NickName) {
            this.nickNameDispose(uuid)
        } else if (type == AvatarInfoTag.ConsortiaName) {
            this.consortiaNameDispose(uuid)
        } else if (type == AvatarInfoTag.Appell) {
            this.appellDispose(uuid)
        } else if (type == AvatarInfoTag.Vip) {
            this.vipDispose(uuid)
        } else if (type == AvatarInfoTag.PetTailMC) {
            this.petTailMCDispose(uuid)
        } else if (type == AvatarInfoTag.PetStar) {
            this.petStarDispose(uuid)
        } else if (type == AvatarInfoTag.PetQualityMC) {
            this.petQualityMCDispose(uuid)
        } else if (type == AvatarInfoTag.ChatPopView) {
            this.chatPopViewDispose(uuid)
        } else if (type == AvatarInfoTag.QQ_DWK) {
            this.qqDWKDispose(uuid)
        }
    }

    public __conVisible(uuid: string, type: AvatarInfoTag, visible: boolean, force: boolean = false) {
        if (!uuid) return

        let petStar = this.petStarMap.get(uuid)
        // let petTail = this.petTailMap.get(uuid)

        let nickName = this.nickNameMap.get(uuid)
        let consortiaName = this.consortiaNameMap.get(uuid)
        let vip = this.vipMap.get(uuid);
        let qqDwk = this.qqDWKMap.get(uuid);
        let appell = this.appellMap.get(uuid)

        // 单独设置某个组件的visible属性需要记录
        switch (type) {
            case AvatarInfoTag.Info:
                if (nickName) {
                    nickName.visible = force || visible && (nickName.data && nickName.data.visible)
                }
                if (consortiaName) {
                    consortiaName.visible = force || visible && (consortiaName.data && consortiaName.data.visible)
                }
                if (vip) {
                    vip.visible = force || visible && (vip.data && vip.data.visible)
                }
                if (appell) {
                    appell.visible = force || visible && (appell.data && appell.data.visible)
                }
                if (qqDwk) {
                    qqDwk.visible = force || visible && (qqDwk.data && qqDwk.data.visible)
                }
                break;
            case AvatarInfoTag.NickName:
                if (nickName) {
                    nickName.visible = visible
                    nickName.data.visible = visible
                }
                break;
            case AvatarInfoTag.ConsortiaName:
                if (consortiaName) {
                    consortiaName.visible = visible
                    consortiaName.data.visible = visible
                    // 设置consortia显示的时候  节点位置重新排序
                    this.alignNodesX(uuid)
                    this.alignNodesY(uuid)
                }
                break;
            case AvatarInfoTag.Appell:
                if (appell) {
                    // Logger.xjy("[AvatarInfoUILayer]__appellVisible  uuid=", uuid, "url=", appell.url, "name=", visible)

                    appell.visible = visible
                    appell.data.visible = visible
                }
                break;
            case AvatarInfoTag.Vip:
                if (vip) {
                    vip.visible = visible
                    vip.data.visible = visible
                }
                break;
            case AvatarInfoTag.QQ_DWK:
                if (qqDwk) {
                    qqDwk.visible = visible
                    qqDwk.data.visible = visible
                }
                break;
            case AvatarInfoTag.PetTailMC:
            // if (petTail) {
            //     petTail.visible = visible
            //     petTail.data["visible"] = visible
            // }
            // break;
            case AvatarInfoTag.PetStar:
                if (petStar) {
                    petStar.visible = visible
                    petStar.data["visible"] = visible
                }
                break;
            case AvatarInfoTag.PetQualityMC:
                break;
            default:
                break;
        }

    }

    public __conAlpha(uuid: string, type: AvatarInfoTag, alpha: number) {
        if (!uuid) return

        let petStar = this.petStarMap.get(uuid)
        // let petTail = this.petTailMap.get(uuid)

        let nickName = this.nickNameMap.get(uuid)
        let consortiaName = this.consortiaNameMap.get(uuid)
        let vip = this.vipMap.get(uuid)
        let qqDwk = this.qqDWKMap.get(uuid);
        let appell = this.appellMap.get(uuid)

        switch (type) {
            case AvatarInfoTag.All:
                petStar && (petStar.alpha = alpha);
                // petTail && (petTail.alpha = alpha);
                nickName && (nickName.alpha = alpha);
                consortiaName && (consortiaName.alpha = alpha);
                vip && (vip.alpha = alpha);
                qqDwk && (qqDwk.alpha = alpha);
                appell && (appell.alpha = alpha);
                break;
            default:
                break;
        }
    }

    public __conPosX(uuid: string, x: number) {
        if (!uuid) return

        let recordPos = this.conPosMap.get(uuid);
        if (!recordPos) {
            recordPos = new Laya.Point(x, 0);
            this.conPosMap.set(uuid, recordPos);
        }
        recordPos.x = x;

        let nickName = this.nickNameMap.get(uuid);
        let consortiaName = this.consortiaNameMap.get(uuid);
        let appell = this.appellMap.get(uuid);
        let vip = this.vipMap.get(uuid);
        let qqDwk = this.qqDWKMap.get(uuid);
        let petStar = this.petStarMap.get(uuid);
        let chatPopView = this.chatPopViewMap.get(uuid);

        if (nickName) {
            nickName.x = x
        }
        if (petStar) {
            petStar.x = x
        }
        if (vip && vip.data && vip.data.visible) {
            vip.x = -nickName.width / 2 - AvatarInfoUILayer.GAPX_VIP
        }
        if (consortiaName && consortiaName.data && consortiaName.data.visible) {
            consortiaName.x = x
        }
        if (appell && appell.data && appell.data.visible) {
            appell.x = x // - appell.unitWidth / 2
        }
        if (chatPopView) {
            chatPopView.x = x
        }
        if (qqDwk && qqDwk.data && qqDwk.data.visible) {
            qqDwk.x = x - (nickName.width / 2 - AvatarInfoUILayer.GAPX_QQ_DWK);
        }
    }

    public __conPosY(uuid: string, y: number) {
        if (!uuid) return

        let recordPos = this.conPosMap.get(uuid);
        if (!recordPos) {
            recordPos = new Laya.Point(y, 0);
            this.conPosMap.set(uuid, recordPos);
        }
        recordPos.y = y;

        let nickName = this.nickNameMap.get(uuid);
        let consortiaName = this.consortiaNameMap.get(uuid);
        let appell = this.appellMap.get(uuid);
        let vip = this.vipMap.get(uuid);
        let qqDwk = this.qqDWKMap.get(uuid);
        let petStar = this.petStarMap.get(uuid);
        let chatPopView = this.chatPopViewMap.get(uuid);

        if (nickName) {
            nickName.y = y
        }
        if (petStar) {
            petStar.y = y - 10
        }

        if (vip && vip.data && vip.data.visible) {
            vip.y = y
        }

        let fixY = y
        let hasConsortiaName = false
        if (consortiaName && consortiaName.data && consortiaName.data.visible) {
            hasConsortiaName = true
            fixY = y - AvatarInfoUILayer.GAPY_CONSORTIA
            consortiaName.y = fixY
        }
        if (appell && appell.data && appell.data.visible) {
            fixY = fixY - AvatarInfoUILayer.GAPY_APPELL - appell.unitHeight / 2
            appell.y = fixY
        }

        if (chatPopView) {
            fixY = fixY - AvatarInfoUILayer.GAPY_CHATPOP
            chatPopView.y = fixY
        }

        if (qqDwk && qqDwk.data && qqDwk.data.visible) {
            qqDwk.y = y - qqDwk.height - AvatarInfoUILayer.GAPY_QQ_DWK;
        }
    }


    public nickNameCreate(uuid: string, name?: string, fontSize: number = 18, strokeColorIdx: number = 0, strokeWidth: number = 1, shadow: boolean = true, bold: boolean = false) {
        // Logger.xjy("[ShadowUILayer]nickNameCreate uuid=", uuid, "name=", name)
        if (this.nickNameMap.get(uuid)) return

        // Logger.xjy("[AvatarInfoUILayer]nickNameCreate 创建 uuid=", uuid, "name=", name)

        let nickName = new FilterFrameShadowText(240, 20, undefined, fontSize, undefined, undefined, undefined, undefined, 0, false);
        nickName.name = name;
        nickName.text = name;
        nickName.data = new AvatarInfoUIData();
        nickName.setStroke(strokeColorIdx, strokeWidth);
        nickName.bold = bold;
        nickName.shadow = shadow;
        nickName.shadowAlpha = 0.6;
        this._txtLayer.addChild(nickName);
        this.nickNameMap.set(uuid, nickName);

    }

    public consortiaNameCreate(uuid: string, name?: string, fontSize: number = 16, strokeColorIdx: number = 0, strokeWidth: number = 1, shadow: boolean = true, bold: boolean = false) {
        if (this.consortiaNameMap.get(uuid)) return

        let consortiaName = new FilterFrameShadowText(240, 20, undefined, fontSize, undefined, undefined, undefined, undefined, 0, false);
        consortiaName.text = name;
        consortiaName.data = new AvatarInfoUIData();
        consortiaName.setStroke(strokeColorIdx, strokeWidth);
        consortiaName.bold = bold;
        consortiaName.shadow = shadow;
        consortiaName.shadowAlpha = 0.6;
        this._txtLayer.addChild(consortiaName);
        this.consortiaNameMap.set(uuid, consortiaName);
    }

    public appellCreate(uuid: string, imgWidth: number, imgHeight: number, appellId: number, imgCount: number) {
        let appell = this.appellMap.get(uuid)
        let url = PathManager.getAppellImgPath(appellId)
        if (appell) {
            if (appell.url == url) {
                return
            } else {
                this.appellDispose(uuid)
            }
        }

        // Logger.xjy("[AvatarInfoUILayer]appellCreate 创建 uuid=", uuid, "path=", PathManager.getAppellImgPath(appellId))

        appell = new AppellView(imgWidth, imgHeight, appellId);
        appell.data = new AvatarInfoUIData();
        this._imgAppellLayer.addChild(appell);

        this.appellMap.set(uuid, appell)
    }

    public vipCreate(uuid: string, name?: string) {
        if (this.vipMap.get(uuid)) return

        // let vip = new SpriteObject();
        // vip.name = name;
        // vip.data = new AvatarInfoUIData();
        // vip.graphics.drawTexture(FUIHelper.getItemAsset(EmWindow.BaseCommon, "vip"))
        // this._imgBaseCommonLayer.addChild(vip);

        // this.vipMap.set(uuid, vip)
    }

    public qqDWKCreate(uuid: string, name?: string) {
        if (this.qqDWKMap.get(uuid) || uuid == "") return;

        let qqDwk = new SpriteObject();
        qqDwk.name = "QQ_DWK";
        qqDwk.data = new AvatarInfoUIData();
        let isS = QQDawankaManager.Instance.isSuperDWK;
        let imgURL = "Icon_qq01";
        if (isS) {
            imgURL = "Icon_qq02"
        }
        let icon = FUIHelper.getItemAsset(EmPackName.Base, imgURL);
        qqDwk.graphics.drawTexture(icon)
        this._imgBaseCommonLayer.addChild(qqDwk);

        this.qqDWKMap.set(uuid, qqDwk)
    }

    public chatPopViewCreate(uuid: string, chatData?: ChatData) {
        if (this.chatPopViewMap.get(uuid)) return
        if (!chatData) return

        let chatPopView = FUIHelper.createFUIInstance(EmPackName.Base, "ChatBubbleTip") as ChatPopView;
        chatPopView.updateContent(chatData.htmlText, chatData.encodemsg, this.chatCallBack.bind(this), 0, chatData.channel, uuid);
        this.addChild(chatPopView.displayObject)
        this.chatPopViewMap.set(uuid, chatPopView)
    }

    private chatCallBack(uuid: string) {
        this.chatPopViewDispose(uuid)
    }

    public petStarCreate(uuid: string, name?: string) {
        if (this.petStarMap.get(uuid)) return

        let petStar = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "PetStarQuality") as fgui.GComponent;
        petStar.setScale(0.5, 0.5);
        petStar.name = name;
        petStar.data = new AvatarInfoUIData();
        this._imgBaseCommonLayer.addChild(petStar.displayObject);

        this.petStarMap.set(uuid, petStar)
    }

    public petTailMCCreate(uuid: string, name?: string) {
        if (this.petTailMap.get(uuid)) return

        let petTail = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "PetTail") as fgui.GMovieClip;
        petTail.name = name;
        petTail.data = new AvatarInfoUIData();
        this._imgBaseCommonLayer.addChild(petTail.displayObject);

        this.petTailMap.set(uuid, petTail)
    }

    /** 品质动画 */
    public petQualityMCCreate(uuid: string, name?: string) {

    }

    public nickNameDispose(uuid: string) {
        let sp = this.nickNameMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.nickNameMap.delete(uuid);
        let spShdow = this.nickNameShadowMap.get(uuid);
        if (spShdow) {
            ObjectUtils.disposeObject(spShdow);
            this.nickNameShadowMap.delete(uuid);
        }
    }

    public consortiaNameDispose(uuid: string) {
        let sp = this.consortiaNameMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.consortiaNameMap.delete(uuid);
        let spShdow = this.consortiaNameShadowMap.get(uuid);
        if (spShdow) {
            ObjectUtils.disposeObject(spShdow);
            this.consortiaNameShadowMap.delete(uuid);
        }
    }

    public vipDispose(uuid: string) {
        let sp = this.vipMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.vipMap.delete(uuid);
    }

    public qqDWKDispose(uuid: string) {
        let sp = this.qqDWKMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.qqDWKMap.delete(uuid);
    }

    public petTailMCDispose(uuid: string) {
        let sp = this.petTailMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.petTailMap.delete(uuid);
    }
    public petStarDispose(uuid: string) {
        let sp = this.petStarMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.petStarMap.delete(uuid);
    }
    public petQualityMCDispose(uuid: string) {

    }
    public chatPopViewDispose(uuid: string) {
        let sp = this.chatPopViewMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.chatPopViewMap.delete(uuid);
    }

    // TODO:没做资源释放处理
    public appellDispose(uuid: string) {
        let sp = this.appellMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.appellMap.delete(uuid);
    }

    public dispose() {
        this.nickNameMap.forEach((sp: FilterFrameShadowText) => {
            ObjectUtils.disposeObject(sp)
        })
        this.consortiaNameMap.forEach((sp: FilterFrameShadowText) => {
            ObjectUtils.disposeObject(sp)
        })
        this.appellMap.forEach((sp: AppellView) => {
            ObjectUtils.disposeObject(sp)
        })
        this.vipMap.clear();
        this.nickNameMap.clear()
        this.consortiaNameMap.clear()
        this.appellMap.clear()
        this.conPosMap.clear()
        this.qqDWKMap.clear();
    }
}
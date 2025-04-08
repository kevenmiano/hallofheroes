// @ts-nocheck
import FUI_SystemMsgCell from "../../../../fui/Chat/FUI_SystemMsgCell";
import ChatData from "./data/ChatData";
import { ChatChannel } from '../../datas/ChatChannel';
import ChatCellType from "./data/ChatCellType";
import Logger from "../../../core/logger/Logger";
import { NotificationManager } from "../../manager/NotificationManager";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import ChatFormat from "../../utils/ChatFormat";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { EmWindow } from "../../constant/UIDefine";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_startemplateData } from "../../config/t_s_startemplate";
import StarInfo from "../mail/StarInfo";
import { StarBagType } from "../../constant/StarDefine";
import { GoodsType } from "../../constant/GoodsType";
import GoodsSonType from "../../constant/GoodsSonType";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import ArtifactTips from "../../tips/ArtifactTips";

/**
* @author:pzlricky
* @data: 2021-04-29 20:26
* @description *** 
*/
export default class SysMsgCell extends FUI_SystemMsgCell implements ITipedDisplay {

    private _cellData: ChatData = null;

    tipType: EmWindow;
    tipData: any;
    showType?: TipsShowType;
    canOperate?: boolean;
    extData?: any;
    startPoint?: Laya.Point;
    iSDown?: boolean;
    isMove?: boolean;
    mouseDownPoint?: Laya.Point;
    moveDistance?: number;
    alphaTest?: boolean;
    tipDirctions?: string;
    tipGapV?: number;
    tipGapH?: number;

    constructor() {
        super();
    }



    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        this.message.on(Laya.Event.LINK, this, this.onMessageHandler);
    }

    set chatData(value) {
        if (value) {
            this._cellData = value;
            // if (value.htmlText != "") {
            //     //系统 或 信息 栏
            //     this.channelImg.url = FUIHelper.getItemURL('Base', ChatChannel.getChatChannelIcon(value.channel));
            //     let text = "[color=" + ChatChannel.getChatChannelColor(value.channel) + "]" + value.htmlText + "[/color]";
            //     this.message.text = text;
            // }
            let _cellVector = [];
            _cellVector = _cellVector.concat(ChatFormat.getContentCellData(this._cellData));
            let elementText: string = "";
            let elements = _cellVector;
            for (let index = 0; index < elements.length; index++) {
                let element = elements[index];
                if (element) {
                    elementText += element.text;
                }
            }
            this.message.text = "[color=" + ChatChannel.getChatChannelColor(value.channel) + "]" + elementText + "[/color]";
        }
    }

    /**点击文本链接 */
    private onMessageHandler(evtData: string) {
        Logger.warn('Click TextMessage!', evtData);
        //转换为Json数据
        let textData = evtData;
        if (!textData) return;
        let linkData = textData.split('|');
        let jsonData: any = {};
        for (let index = 0; index < linkData.length; index++) {
            let element = linkData[index];
            if (element.indexOf(":") == -1)
                continue;
            let params = element.split(':');
            if (params[0] == "" || params[1] == '')
                continue;
            jsonData[params[0]] = params[1];
        }
        let clickType = Number(jsonData.cellType);
        let ret = null;
        switch (clickType) {//具体类型看ChatData里面定义
            case ChatCellType.Player:
                ret = ChatFormat.createPlayerCellData(this._cellData.channel, this._cellData.userType, this._cellData.uid, this._cellData.serverName, this._cellData.vipGrade, this._cellData.consortiaId, this._cellData.senderName);
                NotificationManager.Instance.dispatchEvent(ChatEvent.PLAYER_NAME_CLICK, ret);
                break;
            case ChatCellType.GENERAL:
                // NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK,ret);
                break;
            case ChatCellType.PROP:
                // ret = ChatFormat.createPlayerCellData(this._cellData.channel, this._cellData.userType, this._cellData.uid, this._cellData.serverName, this._cellData.vipGrade, this._cellData.consortiaId, this._cellData.senderName);
                // NotificationManager.Instance.dispatchEvent(ChatEvent.PROP_CLICK, ret);
                //区分类型
                let temp: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(Number(jsonData.templateId));
                if (!temp) {
                    return;
                }
                ret = ChatFormat.createPropCellData(jsonData);
                if (temp.MasterType == GoodsType.EQUIP || temp.MasterType == GoodsType.HONER) {
                    this.tipType = EmWindow.EquipContrastTips;
                } else if (temp.MasterType == GoodsType.PROP || temp.MasterType == GoodsType.PET_CARD || temp.MasterType == GoodsType.PET_EQUIP) {
                    switch (temp.SonType) {
                        case GoodsSonType.SONTYPE_COMPOSE:
                            this.tipType = EmWindow.ComposeTip;
                            break;
                        case GoodsSonType.SONTYPE_SEED:
                            this.tipType = EmWindow.FarmBagTipWnd;
                            break;
                        case GoodsSonType.SONTYPE_MOUNT_CARD:
                            this.tipType = EmWindow.MountCardTip;
                            break;
                        case GoodsSonType.SONTYPE_PASSIVE_SKILL:
                            //符文石
                            this.tipType = EmWindow.RuneTip;
                            break;
                            // case GoodsSonType.SONTYPE_MAGIC_CARD:
                            //     // this.tipType = EmWindow.MagicCardTip;
                            //     this.tipData = "[color=#ed781d][size=24]我是一个卡牌[/size][/color]<br>" +
                            //         "[color=#ffc68f]但是tips还没实现[/color]<br>" +
                            //         "[color=#ffc68f]惊不惊喜意不意外[/color]";
                            //     this.tipType = EmWindow.CommonTips;
                            break;
                        case GoodsSonType.RESIST_GEM:
                            this.tipType = EmWindow.CryStalTips;
                            break;
                        default:
                            this.tipType = EmWindow.PropTips;
                            break;
                    }
                }

                this.tipData = ret.data;
                ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
                break;
            case ChatCellType.EQUIP:
                ret = jsonData;
                ret = ChatFormat.createPropCellData(jsonData);
                if (ret.data && ret.data instanceof GoodsInfo) {
                    let goodsInfo: GoodsInfo = ret.data;
                    if (goodsInfo && goodsInfo.templateInfo && goodsInfo.templateInfo.SonType == GoodsSonType.ARTIFACT) {
                        this.tipType = EmWindow.ArtifactTips;
                        this.tipData = [goodsInfo, ArtifactTips.OTHER_TYPE];
                    } else {
                        this.tipType = EmWindow.EquipTip;
                        this.tipData = ret.data;
                    }
                } else {
                    this.tipType = EmWindow.EquipTip;
                    this.tipData = ret.data;
                }
                ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
                break;
            case ChatCellType.HONER:
                // NotificationManager.Instance.dispatchEvent(ChatEvent.,ret);
                break;
            case ChatCellType.STAR:
                this.tipType = EmWindow.StarTip;
                let startemp: t_s_startemplateData = TempleteManager.Instance.getStarTemplateById(Number(jsonData.id));
                if (!startemp) return null;
                let sInfo: StarInfo = new StarInfo();
                sInfo.grade = Number(jsonData.grade);
                sInfo.template = startemp;
                sInfo.bagType = StarBagType.SYS;
                this.tipData = sInfo;
                this.startPoint = new Laya.Point(800, 80);
                ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
                NotificationManager.Instance.dispatchEvent(ChatEvent.STAR_CLICK, ret);
                break;
            case ChatCellType.CONSORTIA:
                ret = ChatFormat.createConsortiaCellData(this._cellData.consortiaId, this._cellData.consortiaName);
                NotificationManager.Instance.dispatchEvent(ChatEvent.CONSORTIA_CLICK, ret);
                break;
            case ChatCellType.ROOM:
                ret = ChatFormat.createRoomCellData(this._cellData.msg);
                NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
                break;
            case ChatCellType.CHANNEL:
                NotificationManager.Instance.dispatchEvent(ChatEvent.CHANNEL_CLICK, ret);
                break;
            case ChatCellType.GM:
                NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
                break;
            case ChatCellType.VIP:
                NotificationManager.Instance.dispatchEvent(ChatEvent.VIP_LINK_CLICK, ret);
                break;
            case ChatCellType.VipLink:
                NotificationManager.Instance.dispatchEvent(ChatEvent.VIP_LINK_CLICK, ret);
                break;
            case ChatCellType.APPELL_LINK:
                let appellId = Number(jsonData.id);
                ret = ChatFormat.createAppellCellData(this._cellData.channel, appellId);
                NotificationManager.Instance.dispatchEvent(ChatEvent.APPELL_LINK_CLICK, ret);
                break;
            case ChatCellType.ROSE_BACK:
                NotificationManager.Instance.dispatchEvent(ChatEvent.ROSE_BACK_CLICK, this._cellData.senderName);
                break;
            default: break;
        }
    }

    get chatData(): ChatData {
        return this._cellData;
    }


    dispose(): void {
        if (this.message) {
            this.message.off(Laya.Event.LINK, this, this.onMessageHandler);
        }
        super.dispose();
    }
}
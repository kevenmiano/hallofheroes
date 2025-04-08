// @ts-nocheck
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { EmWindow } from '../../constant/UIDefine';
import FUIHelper from '../../utils/FUIHelper';
import SDKManager from "../../../core/sdk/SDKManager";
import LangManager from '../../../core/lang/LangManager';
import { PathManager } from '../../manager/PathManager';
import Resolution from '../../../core/comps/Resolution';
import Utils from '../../../core/utils/Utils';
import { isOversea } from '../login/manager/SiteZoneCtrl';
import { getMultiLangList, getMultiLangValue } from '../../../core/lang/LanguageDefine';

/**
* @author:pzlricky
* @data: 2021-07-06 10:08
* @description 游戏公告
*/
export default class AnnounceWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public titleIcon: fgui.GLoader;
    public menuTab: fgui.GList;
    public content: fgui.GComponent;

    public isOversea: fgui.Controller;

    private announceData: Array<AnnounceData> = [];
    private xml: Array<any> = [];

    public isNullOrEmpty(str: string): boolean {
        return str == null || str == "";
    }


    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        if (!Resolution.isWebVertical() && !Utils.isQQHall()) {
            this.contentPane.setPivot(0.5, 0.5);
        }

        this.addEvent();
        this.frame.title = LangManager.Instance.GetTranslation("AnnounceWnd.title");

        let logActive = this.getController('LogoActive');
        logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;

        this.isOversea = this.getController("isOversea");
        this.isOversea.selectedIndex = isOversea() ? 1 : 0;

        var args = {
            rnd: Math.random()
        };

        this.menuTab.numItems = 0;
        this.setContentData(null);//默认空数据
        if(this.params && this.params.frameData)
            this.xml = this.params.frameData;
        this.refreshView();
    }

    private refreshView() {
        if (!this.xml || this.xml.length == 0) return;
        let xmlData = this.xml;

        this.announceData = [];
        var contentStr: string = "";
        try {
            var myPattern: RegExp = /\/n/g;
            var item = null;
            for (const key in xmlData) {
                if (Object.prototype.hasOwnProperty.call(xmlData, key)) {
                    item = xmlData[key];
                    let announceItemData = new AnnounceData();
                    announceItemData.startTime = item.startTime;
                    announceItemData.endTime = item.endTime;
                    announceItemData.id = item.id;
                    announceItemData.isCenterTop = item.isCenterTop;
                    announceItemData.order = item.order;
                    announceItemData.status = item.status;
                    announceItemData.uuid = item.uuid;
                    announceItemData.isNoticeFlag = item.isNoticeFlag;
                    announceItemData.title = item.title;
                    contentStr = item.content;
                    //url 地址 /new.html 会变成 <br>ew.html
                    // contentStr = contentStr.replace(myPattern, "<br>");
                    if (!this.isNullOrEmpty(contentStr)) {
                        contentStr = contentStr;
                    }
                    announceItemData.content = contentStr;
                    if (item.status == 1)//是否生效
                        this.announceData.push(announceItemData);
                }
            }
            //排序公告,order越小越排前
            this.announceData.sort((a: AnnounceData, b: AnnounceData) => {
                if (a.order > b.order) {
                    return 1;
                } else if (a.order < b.order) {
                    return -1;
                } else {
                    return 0;
                }
            })
            this.menuTab.numItems = this.announceData.length;
            this.menuTab.selectedIndex = 0;
            //
            let defaultData = this.announceData[0];
            this.setContentData(defaultData);
        } catch (e) {
            this.content.getChild('contentText').text = "";
        }
    }

    addEvent() {
        this.menuTab.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.menuTab.on(fairygui.Events.CLICK_ITEM, this, this.__onTabMenuSelect);
        this.content.getChild('contentText').on(Laya.Event.LINK, this, this.onMessageHandler);
    }

    offEvent() {
        if (this.menuTab && this.menuTab.itemRenderer) {
            this.menuTab.itemRenderer.recover();
            this.menuTab.itemRenderer = null;
        }
        this.menuTab && this.menuTab.off(fairygui.Events.CLICK_ITEM, this, this.__onTabMenuSelect);
        this.content.getChild('contentText').off(Laya.Event.LINK, this, this.onMessageHandler);
    }

    /**点击文本链接 */
    private onMessageHandler(evtData: string) {
        Logger.warn('Click Message!', evtData);
        if (evtData && evtData != "") {
            //转换为Json数据
            let textData = evtData;
            if (!textData || textData == "") {
                return;
            }
            let linkData = textData.split('|');
            let clickType = "";
            let textUrl = "";
            if (linkData.length >= 2) {
                clickType = String(linkData[0]);
                textUrl = String(linkData[1]);
            }
            else {
                textUrl = String(linkData[0]);
            }

            switch (clickType) {
                case "QQ":
                    SDKManager.Instance.getChannel().openQQService(textUrl, "800073277");
                    break;
                case "WX":
                    SDKManager.Instance.getChannel().openWXOfficial(textUrl, "800073277");
                    break;
                default:
                    SDKManager.Instance.getChannel().openURL(textUrl);
                    break;
            }
        }
    }

    renderListItem(index: number, item: fgui.GButton) {
        if (!item || item.isDisposed) return;
        let titleData = this.announceData[index];
        item.icon = fgui.UIPackage.getItemURL(EmWindow.Announce, "Tab_Menu1_Title2");
        item.selectedIcon = fgui.UIPackage.getItemURL(EmWindow.Announce, "Tab_Menu1_Title1");
        if (titleData.isNoticeFlag == 1 && index != 0) {
            let redPointCom = FUIHelper.createFUIInstance(EmWindow.Announce, "RedPoint")
            redPointCom.name = "redPoint";
            item.addChild(redPointCom)
            redPointCom.addRelation(item, fgui.RelationType.Right_Right)
            redPointCom.addRelation(item, fgui.RelationType.Top_Top)
            redPointCom.x = item.width - redPointCom.width + 15;
            redPointCom.y = 0 - redPointCom.height / 2 + 5;
        }
        if (titleData && titleData.title)
            item.title = titleData.title;
        else
            item.title = index.toString();
    }

    __onTabMenuSelect(selectItem: any) {
        let selectedIndex = this.menuTab.selectedIndex;
        let tabData = this.announceData[selectedIndex];
        let item = this.menuTab.getChildAt(selectedIndex).asCom;
        let dot = item.getChild("redPoint");
        if (dot) {
            dot.visible = false;
        }
        this.setContentData(tabData);
    }

    setContentData(tabData: AnnounceData) {
        if (tabData) {
            this.content.getChild('titleText').text = tabData.title;
            if (tabData && tabData.content) {
                this.content.getChild('contentText').text = tabData.content;
            } else {
                this.content.getChild('contentText').text = "";
            }
        } else {
            this.content.getChild('titleText').text = "";
            if (tabData && tabData.content) {
                this.content.getChild('contentText').text = tabData.content;
            } else {
                this.content.getChild('contentText').text = "";
            }
        }
    }

    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        this.offEvent();
        super.OnHideWind();
    }

}

/**
 * 公告具体内容
 */
export class AnnounceData {
    public endTime: string = ""
    public id: number = 0;
    public isCenterTop: number = 0;
    public isNoticeFlag: number = 0;
    public order: number = 0;
    public startTime: string = ""
    public status: number = 0;
    public uuid: string = "";

    //活动标题
    private _multiLanTitles: Map<string, string> = new Map();

    public set title(value: string) {
        this._multiLanTitles = getMultiLangList(value, this._multiLanTitles);
    }

    public get title(): string {
        let value = getMultiLangValue(this._multiLanTitles);
        return value;
    }


    //活动内容
    private _multiLanContents: Map<string, string> = new Map();

    public set content(value: string) {
        this._multiLanContents = getMultiLangList(value, this._multiLanContents);
    }

    public get content(): string {
        let value = getMultiLangValue(this._multiLanContents);
        return value;
    }

}
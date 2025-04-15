/* eslint-disable quotes */
import Resolution from "../../../../core/comps/Resolution";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import ResMgr from "../../../../core/res/ResMgr";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { PathManager } from "../../../manager/PathManager";
import { isOversea } from "../manager/SiteZoneCtrl";
import HTMLContent from "./HTMLContent";

export enum HTML_DEFINE {
  tiaokuan = "tiaokuan",
  PrivacyProtocol = "PrivacyProtocol",
  ChildrenPrivacy = "ChildrenPrivacy",
}

/**
 * 适龄提示Wnd
 */
export default class HTMLWnd extends BaseWindow {
  private textURLKey: string = "";
  private frame: fgui.GComponent;
  private content: HTMLContent;

  private privicy_zhcn_URL: string = "https://www.7road.com/agreement/zhcn/"; //[PrivacyProtocol,tiaokuan]
  private privicy_en_URL: string = "https://bm-wan-agreement.wan.com/"; //[protocol,terms-server]

  //替换标签
  private mapKey: string[] = ["<br>", "&quot;", "&nbsp;"];
  private replaceKey: string[] = ["\n", '"', " "];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();

    if (Resolution.isWebVertical() || Utils.isQQHall()) {
      this.contentPane.setPivot(0.5, 0.5, true);
    } else {
      this.contentPane.setPivot(0.5, 0.5);
    }
    let logActive = this.getController("LogoActive");
    logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;
    let isCOversea = this.getController("isOversea");
    isCOversea.selectedIndex = isOversea() ? 1 : 0;
    this.textURLKey = this.params;
    this.onSetHtmlUrl(this.textURLKey);
  }

  /**
   *
   * @param linkType 链接类型
   */
  private onSetHtmlUrl(linkType: string) {
    this.textURLKey = linkType;
    this.clearValue();
    if (this.textURLKey != "") {
      this.onLoadHTML();
    }
  }

  private clearValue() {
    this.setFrameTitle("");
    this.setFrameContentTitle("");
    this.setFrameContentDate("");
    this.setFrameContent("");
  }

  private addEvent() {
    this.content
      .getChild("contentText")
      .on(Laya.Event.LINK, this, this.onTextEventLink);
  }

  private offEvent() {
    this.content
      .getChild("contentText")
      .off(Laya.Event.LINK, this, this.onTextEventLink);
  }

  private setFrameTitle(title: string) {
    this.frame.getChild("title").text = title;
  }

  private setFrameContentTitle(value: string) {
    this.content.titleText.text = value;
    this.content.titleText.displayObject.cacheAs = "bitmap";
  }

  private setFrameContentDate(value: string) {
    this.content.dateText.text = value;
    this.content.dateText.ensureSizeCorrect();
    this.content.dateText.displayObject.cacheAs = "bitmap";
  }

  private setFrameContent(value: string) {
    this.content.contentText.text = value;
    let htmlText = this.content.contentText.text;
    htmlText = this.replaceMapKey(htmlText);
    this.content.contentText.text = htmlText;
    this.content.contentText.ensureSizeCorrect();
  }

  private get getPrivicyLINK(): string {
    if (!isOversea()) {
      return this.privicy_zhcn_URL;
    }
    return this.privicy_en_URL;
  }

  private onLoadHTML() {
    let loadURL =
      this.getPrivicyLINK +
      this.textURLKey +
      ".html" +
      "?v=" +
      new Date().getTime();
    ResMgr.Instance.loadRes(
      loadURL,
      (htmlText: string) => {
        if (!isOversea()) this.parseCN(htmlText);
        else this.parseEN(htmlText);
      },
      null,
      Laya.Loader.TEXT,
    );
  }

  private replaceMapKey(value: string): string {
    if (value == "") return value;
    let result = value;
    // for (const key in this.mapKey) {
    //     if (Object.prototype.hasOwnProperty.call(this.mapKey, key)) {
    //         let keyItem = this.mapKey[key];
    //         let keyValue = this.replaceKey[key];
    // "<br>", "&quot;", "&nbsp;"
    // "\/n", "\"", " "
    result = result.replace(/<br>/gi, "");
    result = result.replace(/\"/gi, "");
    result = result.replace(/&nbsp;/gi, "");
    result = result.replace(/&apos;/gi, "");
    //     }
    // }
    return result;
  }

  private parseCN(htmlText: string) {
    let frameTitle = this.getHTMLTag("title", htmlText);
    this.setFrameTitle(frameTitle);

    let contentTitle = this.getHTMLTag("h1", htmlText);
    this.setFrameContentTitle(contentTitle);

    let divTags = this.getHTMLDivTag(htmlText);

    let contentDate = "";
    let divTagCount = divTags.length;
    if (divTags && divTagCount >= 3) {
      let contentStr = divTags[divTagCount - 1];
      let contentContent = this.replaceDivContent(contentStr);
      if (contentContent != "") {
        let replaceContent = this.replaceLinkURL(contentContent);
        this.setFrameContent(replaceContent);
      }
      contentDate = divTags[1];
      if (contentDate) this.setFrameContentDate(contentDate);
    }
  }

  private parseEN(htmlText: string) {
    if (!htmlText) return;
    let scriptData = this.getHTMLObject(htmlText);
    if (scriptData && scriptData != "") {
      let jsonData = this.getHTMLJsonData(scriptData);
      if (jsonData) {
        if (jsonData) {
          let langCfg = getdefaultLangageCfg();
          let key = langCfg.key;
          let frameTitle = jsonData[key].title;
          this.setFrameTitle(frameTitle);
          this.setFrameContentTitle(frameTitle);

          let contentDate = jsonData[key].time;
          this.setFrameContentDate(contentDate);

          let replaceContent = jsonData[key].content;
          this.setFrameContent(replaceContent);
        }
      }
    }
  }

  private getHTMLObject(htmlText: string): string {
    if (!htmlText) return "";
    let result = "";
    let tagReg = new RegExp(/var [a-zA-Z]+\s+=\s+{[\s\S]+\}/);
    let textValues = htmlText.match(tagReg);
    if (textValues) {
      //将</p>替换为换行符>
      var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
      let textValue = textValues[0];
      result = textValue;
      // textValue = textValue.replace(/<\/p>/gi, "<br>");
      // result = textValue.replace(pattern, "");
    }
    return result;
  }

  private getHTMLJsonData(htmlText: string): string {
    if (!htmlText) return "";
    let result = "";
    let tagReg = new RegExp(/{[\s\S]+\}/);
    let textValues = htmlText.match(tagReg);
    if (textValues) {
      var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
      let textValue = textValues[0];
      result = textValue.replace(pattern, "");
    }
    var json = new Function("return " + result)();
    if (json) {
      return json;
    }
    return result;
  }

  /**获取HTML标签, 只返回第1个 */
  private getHTMLTag(tag: string, text: string = ""): string {
    if (!text) return "";
    let result = "";
    let tagReg = null;
    tagReg = new RegExp(`<${tag}*>.*</${tag}*>`);
    let textValues = text.match(tagReg);
    if (textValues) {
      var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
      let textValue = textValues[0];
      result = textValue.replace(pattern, "");
    }
    return result;
  }

  /**获取HTML标签 */
  private getHTMLDivTag(text: string = ""): string[] {
    if (!text) return [];
    let tagReg = /<div+.*?>([\s\S]*?)<\/div*?>/g;
    let textValues = text.match(tagReg);
    return textValues;
  }

  private replaceDivContent(text: string, tag: string = "div"): string {
    let result = text;
    let divReg = new RegExp(`<${tag}+.*?>`);
    let enddivReg = new RegExp(`<\/${tag}*?>`);
    result = result.replace(divReg, "");
    result = result.replace(enddivReg, "");
    return result;
  }

  private replaceLinkURL(text: string): string {
    if (!text) return "";
    let linkReg = /<a href+.*?([a-zA-Z]*).html">([\s\S]*?)<\/a>/g;
    let links = text.match(linkReg);
    if (links && links.length) {
      let linkCount = links.length;
      for (let index = 0; index < linkCount; index++) {
        let linkelement = links[index];
        let linkelement1 = linkelement;
        linkelement1 = linkelement1.replace(/</g, "[");
        linkelement1 = linkelement1.replace(/>/g, "]");
        linkelement1 = linkelement1.replace(/a href="/g, "url=");
        linkelement1 = linkelement1.replace(/\/a/g, "/url");
        linkelement1 = linkelement1.replace(/.html"/g, "");
        linkelement1 = linkelement1.replace(/\.\//g, "");
        text = text.replace(linkelement, linkelement1);
      }
    }
    return text;
  }

  private onTextEventLink(evtData: string) {
    let textData = evtData;
    if (!textData || textData == "") return;
    let linkURL = textData;
    if (UIManager.Instance.isShowing(EmWindow.HTMLWnd)) {
      this.onSetHtmlUrl(linkURL);
    } else {
      UIManager.Instance.ShowWind(EmWindow.HTMLWnd, linkURL);
    }
  }

  public OnHideWind(): void {
    this.offEvent();
    super.OnHideWind();
  }
}

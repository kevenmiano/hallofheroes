import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import FUI_ServiceCom from "../../../../../fui/PersonalCenter/FUI_ServiceCom";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { CustomerServiceEvent } from "../../../constant/event/NotificationEvent";
import { ArrayUtils } from "../../../../core/utils/ArrayUtils";
import GameConfig from "../../../../../GameConfig";
import PointUtils from "../../../utils/PointUtils";
import { PlayerManager } from "../../../manager/PlayerManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import { NativeChannel } from "../../../../core/sdk/native/NativeChannel";
import { ChannelID } from "../../../../core/sdk/SDKConfig";

/**
 * 客服
 */
export default class ServiceCom extends FUI_ServiceCom {
  private yearArr: any = [];
  private monthArr: any = [];
  private dayArr: any = [];
  private typeArr: any = [];
  private _checkTextNumber: number = 250;
  private MAX_CHARS: number = 250;
  /** web文件上传元素 */
  private file: any;

  private curYear: string = "";
  private curMonth: string = "";
  private curDay: string = "";

  private _submitEnble: boolean = true;

  private beginYear: number = 2022;
  private endYear: number = 2032;
  private n3: fgui.GLabel;
  private n28: fgui.GLabel;
  private n35: fgui.GLabel;
  private n36: fgui.GLabel;
  private n39: fgui.GLabel;
  private n42: fgui.GLabel;
  private n48: fgui.GLabel;
  private n49: fgui.GLabel;
  onConstruct() {
    super.onConstruct();
    this.txt_warn.text = LangManager.Instance.GetTranslation(
      "SuggestWnd.uploadSuccessTxt",
    );
    this.btn_upload.title = LangManager.Instance.GetTranslation(
      "ServiceCom.uploadScreenTxt",
    );
    this.btn_submit.title =
      LangManager.Instance.GetTranslation("public.submit");
    this.getChild("n3").text = LangManager.Instance.GetTranslation(
      "ServiceCom.questionTypeTxt",
    );
    this.getChild("n28").text = LangManager.Instance.GetTranslation(
      "SuggestWnd.occurTimeTxt",
    );
    this.getChild("n35").text = LangManager.Instance.GetTranslation(
      "ServiceCom.titleDescTxt",
    );
    this.getChild("n36").text = LangManager.Instance.GetTranslation(
      "ServiceCom.questionTitleTxt",
    );
    this.getChild("n39").text = LangManager.Instance.GetTranslation(
      "ServiceCom.payOrderTxt",
    );
    this.getChild("n42").text = LangManager.Instance.GetTranslation(
      "ServiceCom.payTypeTxt",
    );
    this.getChild("n48").text = LangManager.Instance.GetTranslation(
      "ServiceCom.payValueTxt",
    );
    this.getChild("n49").text = LangManager.Instance.GetTranslation(
      "ServiceCom.payDescTxt",
    );
  }

  init() {
    (this.txt_desc.displayObject as Laya.Input).wordWrap = true;
    this.txt_warn.visible = false;
    this.beginYear =
      PlayerManager.Instance.currentPlayerModel.sysCurtime.getFullYear();
    this.endYear = this.beginYear + 10;
    for (let i = this.beginYear; i <= this.endYear; i++) {
      this.yearArr.push(i + LangManager.Instance.GetTranslation("public.year"));
    }

    for (let i = 1; i <= 12; i++) {
      this.monthArr.push(
        i + LangManager.Instance.GetTranslation("public.month"),
      );
    }

    for (let i = 1; i <= 31; i++) {
      this.dayArr.push(i + LangManager.Instance.GetTranslation("public.daily"));
    }
    let array = CustomerServiceManager.Instance.model.problemList;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.typeArr.push(element.name);
    }
    this.combox0.items = this.typeArr;
    this.combox1.items = this.yearArr;
    this.combox2.items = this.monthArr;
    this.combox3.items = this.dayArr;
    this.combox2.selectedIndex = new Date().getMonth();
    this.combox3.selectedIndex = new Date().getDate() - 1;

    this.txt_num.text = LangManager.Instance.GetTranslation(
      "customerservice.CustomerServiceBaseView.content01",
      this._checkTextNumber,
    );

    this.addEvent();
    this.checkChannel();
  }

  private checkChannel() {
    let channel = SDKManager.Instance.getChannel();
    if (channel.channleID == ChannelID.NATIVE) {
      this.btn_upload.visible = false;
    } else {
      this.btn_upload.visible = true;
    }
  }

  private _textInputHandler(e: Event): void {
    this._checkTextNumber = this.MAX_CHARS - this.txt_desc.text.length;
    if (this._checkTextNumber < 0) {
      this._checkTextNumber = 0;
      this.txt_desc.text = this.txt_desc.text.substring(0, this.MAX_CHARS);
      this.txt_num.text = LangManager.Instance.GetTranslation(
        "customerservice.CustomerServiceBaseView.content01",
        0,
      );
      return;
    }
    this.txt_num.text = LangManager.Instance.GetTranslation(
      "customerservice.CustomerServiceBaseView.content01",
      this._checkTextNumber,
    );
  }

  private addEvent(): void {
    this.btn_submit.onClick(this, this.onSubmit);
    this.btn_upload.onClick(this, this.onUpload.bind(this));
    this.txt_desc.on(Laya.Event.INPUT, this, this._textInputHandler);
    this.combox0.on(fairygui.Events.STATE_CHANGED, this, this.onSelectItem, [
      0,
    ]);
    this.combox1.on(fairygui.Events.STATE_CHANGED, this, this.onSelectItem, [
      1,
    ]);
    this.combox2.on(fairygui.Events.STATE_CHANGED, this, this.onSelectItem, [
      2,
    ]);
    this.combox3.on(fairygui.Events.STATE_CHANGED, this, this.onSelectItem, [
      3,
    ]);
    Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    NotificationManager.Instance.addEventListener(
      CustomerServiceEvent.UPLOAD_SUCCESS,
      this.uploadSuc,
      this,
    );

    this.txt_input1.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input2.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input3.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_desc.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_title.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input1.on(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_input2.on(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_input3.on(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_desc.on(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_title.on(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  onResize() {
    if (this.file) {
      let point = this.stageTopPoint(this.btn_upload);
      this.file.style.left = point.x + "px";
      this.file.style.top = point.y + "px";
    }
  }

  private uploadSuc() {
    this.txt_warn.visible = true;
    this.btn_upload.title = LangManager.Instance.GetTranslation(
      "suggest.upload.btntext",
    );
    setTimeout(() => {
      this.txt_warn.visible = false;
    }, 3000);
  }

  /**获取一个月有多少天 */
  private getMonthDayCount(year: number, month: number): number {
    var d = new Date(year, month, 0);
    let days = d.getDate();
    return days;
  }

  private onSelectItem(index: number, combo: fgui.GComboBox) {
    if (index == 0) {
      this.c1.selectedIndex = this.combox0.selectedIndex == 0 ? 0 : 1;
      this.txt_title.text = "";
      this.txt_input1.text = "";
      this.txt_input2.text = "";
      this.txt_input3.text = "";
      this.txt_desc.text = "";
      this.txt_num.text = LangManager.Instance.GetTranslation(
        "customerservice.CustomerServiceBaseView.content01",
        this.MAX_CHARS,
      );
      return;
    }
    this.curYear = this.yearArr[this.combox1.selectedIndex];
    this.curMonth = this.monthArr[this.combox2.selectedIndex];
    if (index == 2) {
      let maxDays = this.getMonthDayCount(
        this.beginYear + this.combox1.selectedIndex,
        1 + this.combox2.selectedIndex,
      );
      let tempDays: string[] = ArrayUtils.cloneArray(this.dayArr);
      tempDays = tempDays.splice(0, maxDays);
      this.combox3.items = tempDays;
    }
    this.curDay = this.dayArr[this.combox3.selectedIndex];
  }

  removeEvent(): void {
    // this.mailContent.unRegister()
    this.btn_submit.offClick(this, this.onSubmit);
    this.btn_upload.offClick(this, this.onUpload);
    this.txt_desc.off(Laya.Event.INPUT, this, this._textInputHandler);
    this.combox0.off(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    this.combox1.off(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    this.combox2.off(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    this.combox3.off(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);

    NotificationManager.Instance.removeEventListener(
      CustomerServiceEvent.UPLOAD_SUCCESS,
      this.uploadSuc,
      this,
    );

    this.txt_input1.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input2.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input3.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_desc.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_title.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.txt_input1.off(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_input2.off(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_input3.off(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_desc.off(Laya.Event.BLUR, this, this.onBlurTarget);
    this.txt_title.off(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  onBlurTarget() {
    this.scrollPane.touchEffect = true;
    this.scrollPane.mouseWheelEnabled = true;
  }

  onFocusTarget() {
    this.scrollPane.touchEffect = false;
    this.scrollPane.mouseWheelEnabled = false;
  }

  private stageTopPoint(target: fairygui.GButton): Laya.Point {
    // 触发浏览器文件上传框
    let pt: Laya.Point = this.localToGlobal(target.x, target.y);
    // let pt1: Laya.Point = this.localToGlobal(new Laya.Point(this.btn_upload.x, this.btn_upload.y), true);
    PointUtils.localToGlobal(this, new Laya.Point(target.x, target.y));

    //相对游戏坐标
    let topLeftX = (Laya.Browser.clientWidth - GameConfig.width) / 2;
    let topLeftY = (Laya.Browser.clientHeight - GameConfig.height) / 2;
    return new Laya.Point(topLeftX + pt.x, topLeftY + pt.y);
  }

  private onUpload() {
    let channel = SDKManager.Instance.getChannel();
    if (channel instanceof NativeChannel) {
      return;
    } else {
      if (!this.file) {
        let point = this.stageTopPoint(this.btn_upload);
        //创建隐藏的file并且把它和按钮对齐。达到位置一致, 这里我们默认在0点位置
        let file: any = Laya.Browser.document.createElement("input");
        // let img: any = Laya.Browser.document.createElement('img');

        file.id = "upload";
        file.style =
          "filter:alpha(opacity=0);opacity:0;width:136px;height:55px;left:500px;background:url(b1.png) no-repeat center;cursor:pointer;";
        file.style.left = point.x + "px";
        file.style.top = point.y + "px";
        file.type = "file"; //设置类型是file类型。
        file.size = "30";
        file.accept = "image/png/jpg"; //设置文件的格式为png；
        file.style.position = "absolute";
        Laya.Browser.document.body.appendChild(file); //添加到页面；
        this.file = file;

        var fileReader: any = new Laya.Browser.window.FileReader();
        file.onchange = function (e: any): void {
          if (file.files.length > 0) {
            if (1024 * 1024 < file.files[0].size) {
              MessageTipManager.Instance.show(
                LangManager.Instance.GetTranslation("ServiceCom.onchangeTips"),
              );
            } else {
              fileReader.readAsDataURL(file.files[0]); //转换图片格式为字符编码
            }
          }
        };

        fileReader.onload = function (e): void {
          if (Laya.Browser.window.FileReader.DONE == fileReader.readyState) {
            var data = e.target.result;
            // img.onload = function () {
            //     var width = img.width;
            //     var height = img.height;
            //     if (width < 1334 && height < 750) {
            //         var bgImg = new Laya.Sprite();
            //         bgImg.loadImage(data);
            //         Laya.stage.addChild(bgImg)
            //     } else {
            //         Logger.log("图片超标" + width + "--" + height);
            //     }
            // };
            // img.src = data;
            CustomerServiceManager.Instance.selectFile(data, file.files[0]);
          }
        };
      }

      this.file.click();
    }
  }

  removeUpLoad() {
    if (this.file) {
      //获取需要删除节点的父节点
      var parent = this.file.parentElement;
      //进行删除操作
      parent && parent.removeChild(this.file);
    }
  }

  /**
   * 提交
   */
  private onSubmit() {
    //标题必填
    if (this.txt_title.text == "") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.manager.CustomerServiceManger.content05",
        ),
      );
      return true;
    }
    //描述必填
    if (this.txt_desc.text == "") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.manager.CustomerServiceManger.content06",
        ),
      );
      return true;
    }
    if (this.txt_desc.text.length < 8) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.manager.CustomerServiceManger.content07",
        ),
      );
      return true;
    }
    //不能超过当日
    let y = Number(this.curYear.substring(0, this.curYear.length - 1));
    let m = Number(this.curMonth.substring(0, this.curMonth.length - 1));
    let d = Number(this.curDay.substring(0, this.curDay.length - 1));

    let str = LangManager.Instance.GetTranslation("ServiceCom.selecteTxt");
    let date: Date = new Date();
    if (y > date.getFullYear()) {
      MessageTipManager.Instance.show(str);
      return;
    } else if (y == date.getFullYear()) {
      if (m > date.getMonth() + 1) {
        MessageTipManager.Instance.show(str);
        return;
      } else if (m == date.getMonth() + 1) {
        if (d > date.getDate()) {
          MessageTipManager.Instance.show(str);
          return;
        }
      }
    }

    if (this.submitDelay()) {
      if (this.combox0.selectedIndex == 0) {
        CustomerServiceManager.Instance.model.setRechargeData(
          this.txt_input1.text,
          this.txt_input2.text,
          this.txt_input3.text,
        );
      }
      date = new Date(y, m, d);
      CustomerServiceManager.Instance.model.setData(
        this.txt_title.text,
        this.txt_desc.text,
        date,
        this.combox0.selectedIndex,
      );
      CustomerServiceManager.Instance.sendHttpRequest();
    }
  }

  protected submitDelay(): boolean {
    if (this._submitEnble) {
      this._submitEnble = false;
      Laya.timer.clearAll(this);
      Laya.timer.once(5000, this, this._clearSumbitTimeId);
      return true;
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return false;
    }
  }

  private _clearSumbitTimeId(): void {
    Laya.timer.clearAll(this);
    this._submitEnble = true;
  }
}

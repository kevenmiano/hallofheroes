import GameConfig from "../../../../../GameConfig";
import LangManager from "../../../../core/lang/LangManager";
import { NativeChannel } from "../../../../core/sdk/native/NativeChannel";
import { ChannelID } from "../../../../core/sdk/SDKConfig";
import SDKManager from "../../../../core/sdk/SDKManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { CustomerServiceEvent } from "../../../constant/event/NotificationEvent";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import PointUtils from "../../../utils/PointUtils";

/**
* @author:zhihua.zhou
* @data: 2021-12-9 11:27
* @description 建议反馈界面
*/
export default class SuggestWnd extends BaseWindow {
    private txt_title: fairygui.GTextInput;
    private txt_desc: fairygui.GTextInput;
    private txt_warn: fairygui.GTextField;
    private txt_num: fairygui.GTextField;
    private btn_upload: fairygui.GButton;
    private btn_submit: fairygui.GButton;
    private _checkTextNumber: number = 250;
    private MAX_CHARS: number = 250;
    /** web文件上传元素 */
    private file: any;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        (this.txt_desc.displayObject as Laya.Input).wordWrap = true;
        this.txt_warn.visible = false;
        this.txt_num.text = LangManager.Instance.GetTranslation("customerservice.CustomerServiceBaseView.content01", this._checkTextNumber);
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
            return;
        }
        this.txt_num.text = LangManager.Instance.GetTranslation("customerservice.CustomerServiceBaseView.content01", this._checkTextNumber);
    }

    private addEvent(): void {
        this.btn_submit.onClick(this, this.onSubmit);
        this.btn_upload.onClick(this, this.onUpload.bind(this));
        this.txt_desc.on(Laya.Event.INPUT, this, this._textInputHandler);
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        NotificationManager.Instance.addEventListener(CustomerServiceEvent.UPLOAD_SUCCESS, this.uploadSuc, this);
    }

    private uploadSuc() {
        this.txt_warn.visible = true;
        this.btn_upload.title = LangManager.Instance.GetTranslation('suggest.upload.btntext');
    }

    private removeEvent(): void {
        // this.mailContent.unRegister()
        this.btn_submit.offClick(this, this.onSubmit);
        this.btn_upload.offClick(this, this.onUpload);
        this.txt_desc.off(Laya.Event.INPUT, this, this._textInputHandler);
        Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);

        NotificationManager.Instance.removeEventListener(CustomerServiceEvent.UPLOAD_SUCCESS, this.uploadSuc, this);
    }

    onResize() {
        if (this.file) {
            let point = this.stageTopPoint(this.btn_upload);
            this.file.style.left = point.x + 'px';
            this.file.style.top = point.y + 'px';
        }
    }

    private stageTopPoint(target: fairygui.GButton): Laya.Point {
        // 触发浏览器文件上传框
        let pt: Laya.Point = this.localToGlobal(new Laya.Point(target.x, target.y), true);
        // let pt1: Laya.Point = this.localToGlobal(new Laya.Point(this.btn_upload.x, this.btn_upload.y), true);
        PointUtils.localToGlobal(this, new Laya.Point(target.x, target.y));

        //相对游戏坐标
        let topLeftX = (Laya.Browser.clientWidth - GameConfig.width) / 2;
        let topLeftY = (Laya.Browser.clientHeight - GameConfig.height) / 2;
        return new Laya.Point(topLeftX + pt.x, topLeftY + pt.y)
    }

    private onUpload() {
        let channel = SDKManager.Instance.getChannel();
        if (channel instanceof NativeChannel) {
            return;
        } else {
            if (!this.file) {
                let point = this.stageTopPoint(this.btn_upload);
                //创建隐藏的file并且把它和按钮对齐。达到位置一致, 这里我们默认在0点位置
                let file: any = Laya.Browser.document.createElement('input');
                // let img: any = Laya.Browser.document.createElement('img');

                file.id = "upload";
                file.style = "filter:alpha(opacity=0);opacity:0;width:136px;height:55px;left:500px;background:url(b1.png) no-repeat center;cursor:pointer;";
                file.style.left = point.x + 'px';
                file.style.top = point.y + 'px';
                file.type = 'file';//设置类型是file类型。
                file.size = '30';
                file.accept = "image/png/jpg";//设置文件的格式为png；
                file.style.position = "absolute";
                Laya.Browser.document.body.appendChild(file);//添加到页面；
                this.file = file;


                var fileReader: any = new Laya.Browser.window.FileReader();
                file.onchange = function (e: any): void {
                    if (file.files.length > 0) {
                        if (1024 * 1024 < file.files[0].size) {
                            let str = LangManager.Instance.GetTranslation("CustomerService.pic", '1024kb');
                            MessageTipManager.Instance.show(str);
                        } else {
                            fileReader.readAsDataURL(file.files[0]); //转换图片格式为字符编码
                        }
                    }
                }

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
                }
            }

            this.file.click();
        }
    }

    private removeUpLoad() {
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
        if (this.txt_title.text == '') {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content05"));
            return true;
        }
        if (this.txt_desc.text == '') {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content06"));
            return true;
        }
        if (this.txt_desc.text.length < 8) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content07"));
            return true;
        }

        let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        CustomerServiceManager.Instance.model.setData(this.txt_title.text, this.txt_desc.text, sysTime, 2);
        CustomerServiceManager.Instance.sendHttpRequest(); 
    }

    OnHideWind() {
        CustomerServiceManager.Instance.model.fileName = null;
        super.OnHideWind();
        this.removeEvent();
        this.removeUpLoad();
    }
}
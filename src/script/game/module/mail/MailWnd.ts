import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { EmailEvent } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { ArmyManager } from '../../manager/ArmyManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import EmailInfo from './EmailInfo';
import EmailType from './EmailType';
import MailCtrl from './MailCtrl';
import MailItem from './MailItem';
import MailModel from './MailModel';
import { SharedManager } from '../../manager/SharedManager';
import MailAttachItem from './MailAttachItem';
import BattleInfo from './BattleInfo';
import { MapGrid } from '../../map/space/constant/MapGrid';
import { IconFactory } from '../../../core/utils/IconFactory';
import { JobType } from '../../constant/JobType';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { MopupManager } from '../../manager/MopupManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { MapInitData } from '../../map/data/MapInitData';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import { WorldBossHelper } from '../../utils/WorldBossHelper';
import { BattleRecordReader } from '../../battle/record/BattleRecordReader';
import { PathManager } from '../../manager/PathManager';
import SpaceManager from '../../map/space/SpaceManager';
import NewbieBaseConditionMediator from '../guide/mediators/NewbieBaseConditionMediator';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { GlobalConfig } from '../../constant/GlobalConfig';
import SDKManager from '../../../core/sdk/SDKManager';
import EmailSocketOutManager from '../../manager/EmailSocketOutManager';
import EmailManager from '../../manager/EmailManager';
import Utils from '../../../core/utils/Utils';
import { DateFormatter } from '../../../core/utils/DateFormatter';
/**
* @author:pzlricky
* @data: 2021-04-12 16:27
* @description 邮件
*/
export default class MailWnd extends BaseWindow {
    public modelEnable: boolean = false;
    private static UNDERLEVEL: number = 6;
    private selectMailIndex: number = 0;//当前列表选中项
    private oneKeyDeleteBtn: UIButton = null;//一键删除
    private oneKeyReceiveBtn: UIButton = null;//一键查收
    private oneKeyReadBtn: UIButton = null;//一键已读
    private receiveBtn: UIButton = null;//领取
    private deleteBtn: UIButton = null;//删除
    private frame: fgui.GComponent;
    private maillist: fgui.GList;
    private contentSender: fgui.GTextField;
    private contentTheme: fgui.GTextField;
    private mailContent: fgui.GComponent;
    private mailOverTime: fgui.GTextField;
    private noMailText: fgui.GTextField;//暂无邮件
    private attachlist: fgui.GList;//附件列表
    private playInfoBtn: UIButton;
    public mailBtn: UIButton;
    public BattleInfoBtn: UIButton;
    public playerIcon1: fgui.GLoader;
    public playerIcon2: fgui.GLoader;
    public jobIcon1: fgui.GLoader;
    public jobIcon2: fgui.GLoader;
    public descTxt: fgui.GTextField;
    public levelTxt1: fgui.GTextField;
    public levelTxt2: fgui.GTextField;
    public successTxt: fgui.GTextField;
    public successTxt2: fgui.GTextField;
    public playerNameTxt1: fgui.GTextField;
    public playerNameTxt2: fgui.GTextField;
    public txtCapacity1: fgui.GTextField;
    public txtCapacity2: fgui.GTextField;
    public goldValueTxt1: fgui.GTextField;
    public goldValueTxt2: fgui.GTextField;
    public goldValueTxt3: fgui.GTextField;
    public battleDeleteBtn: fgui.GButton;
    public battleRecordBtn: UIButton;
    public battleGroup: fgui.GGroup;
    public timeTxt: fgui.GTextField;
    public posTxt: fgui.GRichTextField;
    public c1: fgui.Controller;
    public win2: fgui.GImage;
    public win1: fgui.GImage;
    public crystalGroup1: fgui.GGroup;
    public successTxt_2: fgui.GTextField;
    public goldValueTxt4: fgui.GTextField;
    public crystalGroup2: fgui.GGroup;
    public descTxt2: fgui.GTextField;
    public battleInfo1: fgui.GGroup;
    private attachListInfo: Array<any> = [];

    public static SYSTEM_TYPE: number = 0;
    public static NORMAL_TYPE: number = 1;
    public static BATTLE_TYPE: number = 2;
    private listData: Array<EmailInfo> = [];
    private mailTypeList: Array<number> = [];
    private _currentSelectedItem: MailItem;
    public OnInitWind() {
        this.setCenter();
        this.c1 = this.getController("c1");
        this.addEvent();
        this.initView();
        PlayerManager.Instance.currentPlayerModel.mailWndIsOpen = true;
    }

    public OnShowWind() {
        super.OnShowWind();
        this.c1 && (this.c1.selectedIndex = MailWnd.SYSTEM_TYPE);
        this.initData();
        this.onChangeController();
        if (EmailManager.Instance.mailModel.allList.keys.length >= 300 && EmailManager.Instance.mailModel.totalLength >= 300) {
            var prompt: string = LangManager.Instance.GetTranslation("emailII.EmailControler.prompt");
            var content: string = LangManager.Instance.GetTranslation("emailII.EmailControler.content01");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content);
        }
    }

    private initData() {
        this.listData = this.mailModel.sysEmails;
        if (this.listData.length < this.mailModel.pageCapicity)
            this.maillist.numItems = this.listData.length;
        else {
            this.maillist.numItems = this.mailModel.pageCapicity;
        }
    }

    private initView() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("emailII.EmailFrame.title");
        this.receiveBtn.view.asButton.text = LangManager.Instance.GetTranslation("emailII.EmailFrame.attach");
        this.deleteBtn.view.asButton.text = LangManager.Instance.GetTranslation("emailII.EmailFrame.delete");
        // this.oneKeyReceiveBtn.view.text = LangManager.Instance.GetTranslation("emailII.EmailFrame.oneKeyReceiveBtn");
        // this.oneKeyReadBtn.view.text = LangManager.Instance.GetTranslation("emailII.EmailFrame.oneKeyReceiveBtn");
        this.playInfoBtn.title = LangManager.Instance.GetTranslation("emailII.EmailFrame.guild");
        this.maillist.setVirtual();
        this.updateRedDot();
    }

    private addEvent() {
        this.oneKeyDeleteBtn && this.oneKeyDeleteBtn.onClick(this, this.__oneKeyDeleteHandler.bind(this));
        this.oneKeyReceiveBtn && this.oneKeyReceiveBtn.onClick(this, this.__oneKeyReceiveHandler.bind(this));
        this.oneKeyReadBtn && this.oneKeyReadBtn.onClick(this, this.__oneKeyReadHandler.bind(this));
        this.receiveBtn && this.receiveBtn.onClick(this, this.__receiveHandler.bind(this));
        this.deleteBtn && this.deleteBtn.onClick(this, this._deleteHandler.bind(this));
        this.c1.on(fairygui.Events.STATE_CHANGED, this, this.onChangeController);
        this.battleDeleteBtn && this.battleDeleteBtn.onClick(this, this.battleDeleteBtnHandler.bind(this));
        this.posTxt.on(Laya.Event.LINK, this, this.onPosTxtHandler);
        this.maillist.on(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
        this.maillist.on(fairygui.Events.CLICK_ITEM, this, this.onMailSelect);
        this.mailContent.getChild('content').on(Laya.Event.LINK, this, this.onClickLink);
        this.maillist.itemRenderer = Laya.Handler.create(this, this.renderMailListItem, null, false);
        this.attachlist.itemRenderer = Laya.Handler.create(this, this.renderAttachListItem, null, false);
        EmailManager.Instance.addEventListener(EmailEvent.DATA_EMAIL_DELETE, this.__deleteHandler, this);
        if (this.mailModel) {
            this.mailModel.addEventListener(EmailEvent.DATA_EMAIL_UPDATE, this.__dateUpdateHandler, this);
            this.mailModel.addEventListener(EmailEvent.UPDATE_EMAIL_STATUS, this.__updateStatus, this);
            this.mailModel.addEventListener(EmailEvent.UPDATE_ALL_EMAIL_STATUS, this._updateAllEmailStatus, this);
        }
    }

    private offEvent() {
        this.oneKeyDeleteBtn && this.oneKeyDeleteBtn.offClick(this, this.__oneKeyDeleteHandler.bind(this));
        this.oneKeyReceiveBtn && this.oneKeyReceiveBtn.offClick(this, this.__oneKeyReceiveHandler.bind(this));
        this.oneKeyReadBtn && this.oneKeyReadBtn.offClick(this, this.__oneKeyReadHandler.bind(this));
        this.deleteBtn && this.deleteBtn.offClick(this, this._deleteHandler.bind(this));
        this.maillist.off(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
        this.maillist.off(fairygui.Events.CLICK_ITEM, this, this.onMailSelect);
        this.c1.off(fairygui.Events.STATE_CHANGED, this, this.onChangeController);
        this.battleDeleteBtn && this.battleDeleteBtn.offClick(this, this.battleDeleteBtnHandler.bind(this));
        this.posTxt.off(Laya.Event.LINK, this, this.onPosTxtHandler);
        this.mailContent.getChild('content').off(Laya.Event.LINK, this, this.onClickLink);
        // this.maillist.itemRenderer.recover();
        // this.attachlist.itemRenderer.recover();
        Utils.clearGListHandle(this.maillist);
        Utils.clearGListHandle(this.attachlist);
        EmailManager.Instance.removeEventListener(EmailEvent.DATA_EMAIL_DELETE, this.__deleteHandler, this);
        if (this.mailModel) {
            this.mailModel.removeEventListener(EmailEvent.DATA_EMAIL_UPDATE, this.__dateUpdateHandler, this);
            this.mailModel.removeEventListener(EmailEvent.UPDATE_EMAIL_STATUS, this.__updateStatus, this);
            this.mailModel.removeEventListener(EmailEvent.UPDATE_ALL_EMAIL_STATUS, this._updateAllEmailStatus, this);
        }
    }

    private updateRedDot() {
        let cnt = this.mailModel.existUnreadSysMailCount()
        this.mailBtn.selfRedDot(cnt > 0 ? 1 : 0, 1)
        cnt = this.mailModel.existUnreadNormalMailCount()
        this.playInfoBtn.selfRedDot(cnt > 0 ? 1 : 0, 1)
        cnt = this.mailModel.existUnreadBattleMailCount()
        this.BattleInfoBtn.selfRedDot(cnt > 0 ? 1 : 0, 1)
    }

    private refreshSelectedMail() {
        let mailData: EmailInfo;
        this.maillist.selectedIndex = this.selectMailIndex;
        if (this.c1.selectedIndex == MailWnd.SYSTEM_TYPE) {//系统邮件
            if (this.mailModel.sysEmails.length > this.selectMailIndex) {
                mailData = this.mailModel.sysEmails[this.selectMailIndex];
            }
        } else if (this.c1.selectedIndex == MailWnd.NORMAL_TYPE) {//玩家邮件
            if (this.mailModel.normalEmails.length > this.selectMailIndex) {
                mailData = this.mailModel.normalEmails[this.selectMailIndex];
            }
        } else if (this.c1.selectedIndex == MailWnd.BATTLE_TYPE) {//战报
            if (this.mailModel.allBattleList.length > this.selectMailIndex) {
                mailData = this.mailModel.allBattleList[this.selectMailIndex];
            }
        }
        if (mailData) {
            this.mailModel.currentReadEmail = mailData;
            this.mailModel.selectedMailId = mailData.Id;
            this.mailModel.updateAllListEmail(mailData);
        }
        this.readEmail(mailData);
    }

    private readEmail(mailData: EmailInfo) {
        if (mailData) {
            this.contentSender.text = mailData.SendNickName;
            this.contentTheme.text = mailData.Title;
            this.mailOverTime.text = DateFormatter.format(mailData.sendDate, "YYYY-MM-DD hh:mm");
            this.mailContent.getChild('content').text = mailData.Contents;
            this.receiveBtn.visible = true;//领取按钮
            this.deleteBtn.visible = true;//删除按钮
            this.refreshAnnex(mailData);//刷新附件
        }
        this.noMailText.visible = this.maillist.numItems <= 0;//暂无邮件
        if (this.c1.selectedIndex == MailWnd.SYSTEM_TYPE) {//系统邮件
            this.battleGroup.visible = false;
            this.oneKeyDeleteBtn.enabled = this.mailModel.sysEmails.length > 0;
            this.oneKeyReceiveBtn.enabled = this.mailModel.sysEmails.length > 0;
            if (mailData && mailData.MailType == EmailType.STAR_MAIL) {
                this.refreshStar(mailData);
            }
        }
        else if (this.c1.selectedIndex == MailWnd.NORMAL_TYPE) {//玩家邮件
            this.battleGroup.visible = false;
            this.oneKeyDeleteBtn.enabled = this.mailModel.normalEmails.length > 0;
            this.oneKeyReceiveBtn.enabled = this.mailModel.normalEmails.length > 0;
        }
        else if (this.c1.selectedIndex == MailWnd.BATTLE_TYPE) {//战报
            this.receiveBtn.visible = false;
            this.deleteBtn.visible = false;
            this.oneKeyDeleteBtn.enabled = this.mailModel.allBattleList.length > 0;
            this.oneKeyReadBtn.enabled = this.mailModel.allBattleList.length > 0 && this.mailModel.isBattleUnreadExist();
            if (mailData) {
                this.battleRecordBtn.visible = Boolean(mailData.Params);
                this.battleGroup.visible = true;
            }
            if (mailData && mailData.report.type == 2) {
                this.battleInfo1.visible = false;
                this.descTxt2.visible = true;
                this.descTxt2.text = mailData.report.content;
                return;
            }
            else {
                this.battleInfo1.visible = true;
                this.descTxt2.visible = false;
            }
            this.successTxt2.text = this.successTxt.text = LangManager.Instance.GetTranslation("mailwnd.battleReport.descTxt");
            let str: string;
            if (mailData && mailData.report && mailData.report.camp == BattleInfo.ATTACKED) {
                str = LangManager.Instance.GetTranslation("emailII.view.ReadBattleReportView.content01")
            }
            else {
                str = LangManager.Instance.GetTranslation("emailII.view.ReadBattleReportView.content02")
            }
            this.playerIcon1.icon = IconFactory.getHeroicon(ArmyManager.Instance.thane.templateId);
            this.playerNameTxt1.text = ArmyManager.Instance.thane.nickName;
            if (mailData && mailData.report) {
                this.descTxt.text = mailData.report.playerName + "&nbsp;" + str;
                this.timeTxt.text = mailData.report.time;
                let posTxtStr: string = "(" + MapGrid.getPositionString(mailData.report.pos) + ")&nbsp;" + mailData.report.mapName;
                this.posTxt.text = "[url='event:'|type:" + posTxtStr + "]" + "[color=#00F0FF]" + posTxtStr + "[/color]" + "[/url]&nbsp;";
                this.levelTxt1.text = mailData.report.selfGrade.toString();
                this.win1.visible = mailData.report.result == 1;
                this.txtCapacity1.text = mailData.report.selfFight;
                if (mailData.report.selfGold >= 0) {
                    this.goldValueTxt1.color = "#71F000";
                    this.goldValueTxt1.text = "+" + mailData.report.selfGold;
                } else {
                    this.goldValueTxt1.color = "#FF0000";
                    this.goldValueTxt1.text = mailData.report.selfGold.toString();
                }
                if (mailData.report.selfCrystal > 0) {
                    this.crystalGroup1.visible = true;
                    this.goldValueTxt3.text = mailData.report.selfCrystal + ""
                } else {
                    this.crystalGroup1.visible = false;
                }
                this.jobIcon1.url = JobType.getJobIcon(ArmyManager.Instance.thane.job);
                if (mailData.report.enemyHeroId != 0) {
                    let enemy: ThaneInfo = new ThaneInfo();
                    enemy.templateId = mailData.report.enemyHeroId;
                    this.playerIcon2.icon = IconFactory.getHeroicon(mailData.report.enemyHeroId);
                    this.jobIcon2.url = JobType.getJobIcon(enemy.templateInfo.Job);
                    this.playerNameTxt2.text = mailData.report.playerName;
                    this.levelTxt2.text = mailData.report.enemyGrade.toString();
                    this.txtCapacity2.text = mailData.report.enemyFight;
                    this.win2.visible = mailData.report.result != 1;
                    if (mailData.report.enemyGold >= 0) {
                        this.goldValueTxt2.color = "#71F000";
                        this.goldValueTxt2.text = "+" + mailData.report.enemyGold;
                    }
                    else {
                        this.goldValueTxt2.color = "#FF0000";
                        this.goldValueTxt2.text = mailData.report.enemyGold.toString();
                    }
                }
            }
        }
    }

    private onClickLink(evtData: string) {
        let mailData = this.mailModel.currentReadEmail;
        let isSystemMail = mailData.MailType == EmailType.SYStem_MAIL || mailData.SendId == 0;
        if (!isSystemMail) return;
        let textData = evtData;
        if (!textData || textData == "") return;
        let linkData = textData.split('|');
        let clickType = "";
        let textUrl = "";
        if (linkData.length >= 2) {
            clickType = String(linkData[0]);
            textUrl = String(linkData[1]);
        }
        switch (clickType) {
            case "COPY":
                SDKManager.Instance.getChannel().copyStr(textUrl);
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("copy.success"))
                break;
        }
    }

    /**选择邮件 */
    onMailSelect(clickItem: MailItem) {
        this.clearMail();
        this.maillist.selectedIndex = clickItem.index;
        Logger.log('选择邮件', clickItem.index);
        this.selectMailIndex = clickItem.index;
        if (clickItem.Itemdata) {
            let itemData = clickItem.Itemdata;
            this._currentSelectedItem = clickItem;
            this.mailModel.currentReadEmail = itemData;
            this.mailModel.selectedMailId = itemData.Id;
            this.mailModel.updateAllListEmail(itemData);
            this.readEmail(itemData);
            EmailSocketOutManager.readOneEmail([this.mailModel.selectedMailId]);
        }
    }

    clearMail() {
        // this.maillist.selectedIndex = 0;
        this.mailModel.selectedMailId = 0;
        this.receiveBtn.visible = false;
        this.deleteBtn.visible = false;
        this.contentSender.text = '';
        this.contentTheme.text = '';
        this.mailContent.getChild('content').text = '';
        this.mailOverTime.text = '';
        this.attachlist.numItems = 0;
        this.battleGroup.visible = false;
    }

    onChangeController() {
        switch (this.c1.selectedIndex) {
            case 1:
                this.listData = this.mailModel.normalEmails;
                this.mailTypeList = [EmailType.NORMAL_MAIL];
                break
            case 2:
                this.listData = this.mailModel.allBattleList;
                this.mailTypeList = [EmailType.BATTLE_REPORT];
                break
            case 0:
            default:
                this.listData = this.mailModel.sysEmails;
                this.mailTypeList = [EmailType.SYStem_MAIL, EmailType.PET_MAIL, EmailType.STAR_MAIL];
        }
        if (this.listData.length < this.mailModel.pageCapicity) {
            this.listData.sort(this.sortList);
            this.maillist.numItems = this.listData.length;
        } else {
            this.maillist.numItems = this.mailModel.pageCapicity;
        }
        this.clearMail();
        this.noMailText.visible = this.maillist.numItems <= 0;//暂无邮件
        this.oneKeyDeleteBtn.enabled = this.maillist.numItems > 0;
        this.oneKeyReceiveBtn.enabled = this.maillist.numItems > 0;
        this.oneKeyReadBtn.enabled = this.maillist.numItems > 0;
    }

    private sortList(a: EmailInfo, b: EmailInfo): number {
        if (a.isRead && !b.isRead) {
            return 1;
        } else if (!a.isRead && b.isRead) {
            return -1;
        } else {
            if (a.sendDate > b.sendDate) {
                return -1;
            } else if (a.sendDate < b.sendDate) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    /**刷新附件物品**/
    private refreshAnnex(mailData: EmailInfo) {
        this.attachListInfo = mailData.getAnnexs();
        this.attachlist.numItems = this.attachListInfo.length;
        this.receiveBtn.visible = this.attachListInfo.length > 0;
    }

    private refreshStar(mailData: EmailInfo) {
        this.attachListInfo = mailData.getStar();
        this.attachlist.numItems = this.attachListInfo.length;
        this.receiveBtn.visible = this.attachListInfo.length > 0;
    }

    /**删除邮件返回处理 */
    private __deleteHandler() {
        if (this.mailCtrl) {
            this.updateRedDot();
            if (this.mailModel && this.mailModel.selectedMailId == 0) {
                this.updateView();
            }
            else {
                switch (this.c1.selectedIndex) {
                    case 1:
                        this.listData = this.mailModel.normalEmails;
                        this.mailTypeList = [EmailType.NORMAL_MAIL];
                        break
                    case 2:
                        this.listData = this.mailModel.allBattleList;
                        this.mailTypeList = [EmailType.BATTLE_REPORT];
                        break
                    case 0:
                    default:
                        this.listData = this.mailModel.sysEmails;
                        this.mailTypeList = [EmailType.SYStem_MAIL, EmailType.PET_MAIL, EmailType.STAR_MAIL];
                }
                if (this.listData.length < this.mailModel.pageCapicity)
                    this.maillist.numItems = this.listData.length;
                else {
                    this.maillist.numItems = this.mailModel.pageCapicity;
                }
                this.clearMail();
                this.refreshSelectedMail();
            }
        }
    }

    /**
     * 一键查收或者收到新邮件的处理
     */
    __dateUpdateHandler() {
        if (this.mailCtrl) {
            this.updateRedDot();
            this.updateView();
        }
    }

    /**
     * 读单封邮件的返回处理, 改变图标的状态  
     * 某个分页只有一封邮件，点一键查收，直接更新当前列表
     */
    private __updateStatus() {
        if (this._currentSelectedItem) {
            this.updateRedDot();
            this._currentSelectedItem.Itemdata = this.mailModel.getEmailById(this.mailModel.selectedMailId);
        } else {
            this._updateAllEmailStatus()
        }
    }

    private _updateAllEmailStatus() {
        this.updateRedDot();
        switch (this.c1.selectedIndex) {
            case 1:
                this.listData = this.mailModel.normalEmails;
                this.mailTypeList = [EmailType.NORMAL_MAIL];
                break
            case 2:
                this.listData = this.mailModel.allBattleList;
                this.mailTypeList = [EmailType.BATTLE_REPORT];
                break
            case 0:
            default:
                this.listData = this.mailModel.sysEmails;
                this.mailTypeList = [EmailType.SYStem_MAIL, EmailType.PET_MAIL, EmailType.STAR_MAIL];
        }
        if (this.listData.length < this.mailModel.pageCapicity)
            this.maillist.numItems = this.listData.length;
        else {
            this.maillist.numItems = this.mailModel.pageCapicity;
        }
    }

    private updateView() {
        switch (this.c1.selectedIndex) {
            case 1:
                this.listData = this.mailModel.normalEmails;
                this.mailTypeList = [EmailType.NORMAL_MAIL];
                break
            case 2:
                this.listData = this.mailModel.allBattleList;
                this.mailTypeList = [EmailType.BATTLE_REPORT];
                break
            case 0:
            default:
                this.listData = this.mailModel.sysEmails;
                this.mailTypeList = [EmailType.SYStem_MAIL, EmailType.PET_MAIL, EmailType.STAR_MAIL];
        }
        if (this.listData.length < this.mailModel.pageCapicity)
            this.maillist.numItems = this.listData.length;
        else {
            this.maillist.numItems = this.mailModel.pageCapicity;
        }
        this.clearMail();
        this.refreshSelectedMail();
    }


    private onPullUpToRefresh(evt: Laya.Event) {
        if (!this.maillist.scrollPane.footer) {
            return;
        }
        var footer: fgui.GComponent = this.maillist.scrollPane.footer.asCom;
        footer.getController("c1").selectedIndex = 1;
        this.maillist.scrollPane.lockFooter(footer.sourceHeight);
        Laya.timer.once(1000, this, this.callRefresh);
    }

    private callRefresh() {
        let self = this;
        if (!this.maillist.scrollPane.footer) {
            return;
        }
        var footer: fgui.GComponent = this.maillist.scrollPane.footer.asCom;
        if (!self.mailCtrl || self.mailCtrl.view.isDisposed)
            return;
        if (self.maillist.numItems >= this.listData.length) {
            self.maillist.numItems += 0;
        } else {
            let leftCount = this.listData.length - self.maillist.numItems;
            //后续每次增加6条邮件
            self.maillist.numItems += leftCount > this.mailModel.pageAddCapicity ? this.mailModel.pageAddCapicity : leftCount;
        }
        footer.getController("c1").selectedIndex = 0;
        self.maillist.scrollPane.lockFooter(0);
    }

    /**刷新单元格 */
    renderMailListItem(index: number, item: MailItem) {
        if (!item || item.isDisposed) return;
        item.index = index;
        item.Itemdata = this.listData[index];
    }

    /**刷新附件单元格 */
    renderAttachListItem(index: number, item: MailAttachItem) {
        item.mailData = this.attachListInfo[index];
    }

    /**写邮件 */
    private __writeMailHandler() {
        Logger.warn('__writeMailHandler');
        if (ArmyManager.Instance.thane.grades < MailWnd.UNDERLEVEL) {
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var content: string = LangManager.Instance.GetTranslation("emailII.EmailFrame.view.underSixLevel", MailWnd.UNDERLEVEL);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel);
        } else {
            if (!FrameCtrlManager.Instance.isOpen(EmWindow.WriteMailWnd)) {
                FrameCtrlManager.Instance.open(EmWindow.WriteMailWnd, { returnToWin: EmWindow.MailWnd, users: [] }, null, EmWindow.MailWnd);
            }
        }
    }

    /**一键删除 */
    private __oneKeyDeleteHandler() {
        let needAlert: boolean = true;
        let preDate: Date = new Date(SharedManager.Instance.emailDeleteTipCheckDate);
        let now: Date = new Date();
        let check: boolean = SharedManager.Instance.emailDelete;
        if (!check || preDate.getDate() < now.getDate()) {
            needAlert = true;
        } else {
            needAlert = false;
        }
        var content: string;
        if (needAlert) {
            if (this.c1.selectedIndex == MailWnd.SYSTEM_TYPE) {//系统邮件
                content = LangManager.Instance.GetTranslation("emailII.EmailFrame.command03");
            } else if (this.c1.selectedIndex == MailWnd.NORMAL_TYPE) {//普通邮件
                content = LangManager.Instance.GetTranslation("emailII.EmailFrame.command06");
            } else if (this.c1.selectedIndex == MailWnd.BATTLE_TYPE) {//战报
                content = LangManager.Instance.GetTranslation("emailII.EmailFrame.command07");
            }
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.confirmDelete.bind(this), state: 2 });
        } else {
            this.confirmDelete(true, false);
        }
    }

    /**一键删除确认 */
    private confirmDelete(notalert: boolean, check: boolean) {
        SharedManager.Instance.emailDelete = notalert;
        SharedManager.Instance.emailDeleteTipCheckDate = new Date();
        SharedManager.Instance.saveEmailDeleteCheck();
        if (this.c1.selectedIndex == MailWnd.SYSTEM_TYPE) {//系统邮件
            EmailSocketOutManager.delSystems();
        } else if (this.c1.selectedIndex == MailWnd.NORMAL_TYPE) {//普通邮件
            EmailSocketOutManager.delNormals();
        }
        else {//战报邮件
            EmailSocketOutManager.delBattleReports();
        }
    }

    /**一键查收普通邮件和系统邮件 */
    private __oneKeyReceiveHandler() {
        let needAlert: boolean = true;
        let preDate: Date = new Date(SharedManager.Instance.emailReceiveTipCheckDate);
        let now: Date = new Date();
        let check: boolean = SharedManager.Instance.emailReceive;
        if (!check || preDate.getDate() < now.getDate()) {
            needAlert = true;
        } else {
            needAlert = false;
        }
        var content: string;
        if (needAlert) {
            if (this.c1.selectedIndex == MailWnd.BATTLE_TYPE) {
                content = LangManager.Instance.GetTranslation("emailII.EmailFrame.command05");
            }
            else {
                content = LangManager.Instance.GetTranslation("emailII.EmailFrame.command02");
            }
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.confirmReceive.bind(this), state: 2 });
        } else {
            this.confirmReceive(true, false);
        }
    }

    /**确定一键查收回调 */
    confirmReceive(notalert: boolean, check: boolean) {
        SharedManager.Instance.emailReceive = notalert;
        SharedManager.Instance.emailReceiveTipCheckDate = new Date();
        SharedManager.Instance.saveEmailReceiveCheck();
        if (!this.mailModel) return;
        if (this.checkIsAllRead()) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mailwnd.onkeyreceive.tips"));
            return;
        }
        EmailSocketOutManager.getAttachAll(this.mailTypeList);
    }

    private checkIsAllRead() {
        let flag: boolean = true;
        let arr: Array<EmailInfo> = [];
        if (this.c1.selectedIndex == MailWnd.SYSTEM_TYPE) {
            arr = this.mailModel.sysEmails;
        } else if (this.c1.selectedIndex == MailWnd.NORMAL_TYPE) {
            arr = this.mailModel.normalEmails;
        }
        if (arr) {
            let len: number = arr.length;
            let item: EmailInfo;
            for (let i: number = 0; i < len; i++) {
                item = arr[i];
                if (!item.isRead) {
                    flag = false;
                    break;
                } else if ((!item.IsAnnex1 && item.Annex1 != 0)
                    || (!item.IsAnnex2 && item.Annex2 != 0)
                    || (!item.IsAnnex3 && item.Annex3 != 0)
                    || (!item.IsAnnex4 && item.Annex4 != 0)) {
                    flag = false;
                    break;
                }
            }
        }
        return flag;
    }

    /**一键查收战报 */
    private __oneKeyReadHandler() {
        let needAlert: boolean = true;
        let preDate: Date = new Date(SharedManager.Instance.emailBattleReadTipCheckDate);
        let now: Date = new Date();
        let check: boolean = SharedManager.Instance.emailBattleRead;
        if (!check || preDate.getDate() < now.getDate()) {
            needAlert = true;
        } else {
            needAlert = false;
        }
        if (needAlert) {
            var content: string = LangManager.Instance.GetTranslation("emailII.EmailFrame.command05");
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.confirmBattleMailRead.bind(this), state: 2 });
        } else {
            this.confirmBattleMailRead(true, false);
        }
    }

    private confirmBattleMailRead(notalert: boolean, check: boolean) {
        SharedManager.Instance.emailBattleRead = notalert;
        SharedManager.Instance.emailBattleReadTipCheckDate = new Date();
        SharedManager.Instance.saveEmailBattleReadCheck();
        if (!this.mailModel) return;
        EmailSocketOutManager.getAttachAll(this.mailTypeList);
    }

    /**回复 */
    private __replayHandler() {
        Logger.warn('__replayHandler');
        let _data: EmailInfo = this.mailModel.currentReadEmail
        if (_data.MailType == EmailType.SYStem_MAIL || _data.SendId == 0) {
            var str: string = LangManager.Instance.GetTranslation("emailII.view.ReadEmailView.content01");
            MessageTipManager.Instance.show(str);
            return;
        } else if (ArmyManager.Instance.thane.grades < MailWnd.UNDERLEVEL) {
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var content: string = LangManager.Instance.GetTranslation("emailII.EmailFrame.view.underSixLevel", MailWnd.UNDERLEVEL);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel);
            return;
        }
        this.mailModel.reply = _data.SendNickName;
        if (!FrameCtrlManager.Instance.isOpen(EmWindow.WriteMailWnd)) {
            FrameCtrlManager.Instance.open(EmWindow.WriteMailWnd, { returnToWin: EmWindow.MailWnd, users: [_data.SendNickName] }, null, EmWindow.MailWnd);
        }
    }

    /**领取 */
    private __receiveHandler() {
        Logger.warn('__receiveHandler');
        let _data: EmailInfo = this.mailModel.currentReadEmail
        if (_data.hasGoods) {
            EmailSocketOutManager.getAttachedOne([_data.Id]);
        }
    }

    /**删除普通邮件和系统邮件 */
    private _deleteHandler() {
        if (this.mailModel.selectedMailId > 0) {
            if (this.checkHasAnnex(this.mailModel.currentReadEmail)) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("emailII.EmailControler.command01"));
                return;
            }
            this.mailCtrl.deleteEmails([this.mailModel.selectedMailId]);
        } else {
            var str: string = LangManager.Instance.GetTranslation("emailII.EmailFrame.command01");
            MessageTipManager.Instance.show(str);
        }
    }

    private checkHasAnnex(EmailInfo: EmailInfo): boolean {
        let flag: boolean = false;
        if ((!EmailInfo.IsAnnex1 && EmailInfo.Annex1 != 0)
            || (!EmailInfo.IsAnnex2 && EmailInfo.Annex2 != 0)
            || (!EmailInfo.IsAnnex3 && EmailInfo.Annex3 != 0)
            || (!EmailInfo.IsAnnex4 && EmailInfo.Annex4 != 0)) {
            flag = true;
        }
        return flag;
    }

    /**删除战报 */
    private battleDeleteBtnHandler() {
        if (this.mailModel.selectedMailId > 0) {
            this.mailCtrl.deleteEmails([this.mailModel.selectedMailId]);
        } else {
            var str: string = LangManager.Instance.GetTranslation("emailII.EmailFrame.command01");
            MessageTipManager.Instance.show(str);
        }
    }

    /**战斗回放 */
    private battleRecordBtnClick() {
        if (SpaceManager.PKInvite) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("battle.record.playLater"));
            return;
        }
        if (!NewbieBaseConditionMediator.checkInScene(1) && !NewbieBaseConditionMediator.checkInScene(10)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("battle.record.cannotPlayInCurrentScene"));
            return;
        }
        let _data: EmailInfo = this.mailModel.currentReadEmail
        if (_data && _data.MailType == EmailType.BATTLE_REPORT) {
            let url = _data.Params
            if (url) {
                BattleRecordReader.loadData(PathManager.getBattleRecordPath(url), () => { BattleRecordReader.play() })
            }
        }
    }

    private onPosTxtHandler() {
        let str: string;
        let _data: EmailInfo = this.mailModel.currentReadEmail
        // 新手地图不让跳转
        if (_data && _data.report.mapId >= GlobalConfig.Novice.NewMapID) {
            str = LangManager.Instance.GetTranslation("emailII.view.ReadBattleReportView.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (_data && _data.report.mapId != PlayerManager.Instance.currentPlayerModel.mapNodeInfo["info"].mapId) {
            str = LangManager.Instance.GetTranslation("emailII.view.ReadBattleReportView.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (MopupManager.Instance.model.isMopup) {
            str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            MessageTipManager.Instance.show(WorldBossHelper.getCampaignTips());
            return;
        }
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            str = LangManager.Instance.GetTranslation("emailII.view.ReadBattleReportView.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        let posX: number = MapGrid.getConvertWidth(parseInt(_data.report.pos.split(",")[0]));
        let posY: number = MapGrid.getConvertWidth(parseInt(_data.report.pos.split(",")[1]));
        let posPoint: Laya.Point = new Laya.Point(posX * 50, posY * 50);
        let mInfo: MapInitData = new MapInitData();
        mInfo.mapTempInfo = TempleteManager.Instance.getMapTemplateById(_data.report.mapId);
        mInfo.targetPoint = posPoint;
        SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE, mInfo, true);
    }

    private get mailCtrl(): MailCtrl {
        return this.ctrl;
    }

    private get mailModel(): MailModel {
        if (this.ctrl)
            return this.ctrl.data;
        return null;
    }

    private onDelaySetFlag() {
        PlayerManager.Instance.currentPlayerModel.mailWndIsOpen = false;
    }

    OnHideWind() {
        super.OnHideWind();
        Laya.timer.clear(this, this.callRefresh);
        Laya.timer.once(1000, this, this.onDelaySetFlag);
        this.offEvent();
    }
}
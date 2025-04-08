/*
 * @Author: jeremy.xu
 * @Date: 2024-02-28 12:22:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-18 14:13:52
 * @Description: 事件视图
 */
import FUI_SecretEventCom from "../../../../../../fui/PveSecretScene/FUI_SecretEventCom";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { GameLoadNeedData } from "../../../../battle/data/GameLoadNeedData";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { t_s_secreteventData } from "../../../../config/t_s_secretevent";
import { t_s_secretoptionData } from "../../../../config/t_s_secretoption";
import { t_s_secrettreasureData } from "../../../../config/t_s_secrettreasure";
import ColorConstant from "../../../../constant/ColorConstant";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { SecretEvent } from "../../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PathManager } from "../../../../manager/PathManager";
import { SecretManager } from "../../../../manager/SecretManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import PveSecretSceneCtrl from "../PveSecretSceneCtrl";
import PveSecretSceneData from "../PveSecretSceneData";
import { SecretEventOptType } from "../model/SecretEventOptType";

export class SecretEventCom extends FUI_SecretEventCom {
    private _info: number;
    private cfg: t_s_secreteventData;

    get info(): number {
        return this._info;
    }

    set info(value: number) {
        this._info = value;
        if (value) {
            this.cfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secretevent, value) as t_s_secreteventData
            if (this.cfg.HeadId > 0) {
                this.imgHead.url = PathManager.solveHeadPath(this.cfg.HeadId)
                this.cFigureTitle.setSelectedIndex(1)
                this.txtFigureTitle.text = this.cfg.DescriptionLang
            } else {
                this.imgHead.url = ""
                this.cFigureTitle.setSelectedIndex(0)
                if (this.cfg.DescriptionLang) {
                    this.txtTitle.text = this.cfg.DescriptionLang
                } else {
                    this.gTitle.visible = false
                }
            }

            // 移除场景中所有怪物
            NotificationManager.Instance.dispatchEvent(SecretEvent.REMOVE_NPC)
            if (this.cfg.BattlePath) {
                let data = new GameLoadNeedData()
                data.urlPath = PathManager.solveRolePath(this.cfg.BattlePath.toLocaleLowerCase())
                data.key = this.cfg.BattlePath
                NotificationManager.Instance.dispatchEvent(SecretEvent.ADD_NPC, data)
            }

            for (let index = 1; index <= PveSecretSceneData.EventOptCnt; index++) {
                let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secretoption, this.cfg["Option" + index]) as t_s_secretoptionData
                this.setItemData(index, temp);
            }
        } else {
            this.cfg = null;
        }
    }

    private setItemData(index: number, optInfo: t_s_secretoptionData) {
        let item = this["item" + index] as fgui.GComponent
        item.visible = Boolean(optInfo)
        if (optInfo) {
            let [mainStr, viceStr] = optInfo.optionName
            item.getChild("mainTitle").text = mainStr
            item.getChild("viceTitle").text = viceStr

            let color = ColorConstant.DEEP2_TEXT_COLOR
            if (optInfo.Type == SecretEventOptType.Tresure) {
                if (optInfo.Param2 == "" && optInfo.Param3 == "") {

                } else if (optInfo.Param2 != "" && optInfo.Param3 != "") {
                    let ownP2 = this.model.getOwnTresureCnt(Number(optInfo.Param2))
                    let ownP3 = this.model.getOwnTresureCnt(Number(optInfo.Param3))
                    if (ownP2 > 0 && ownP3 > 0) {

                    } else {
                        color = ColorConstant.RED2_COLOR
                    }
                } else {
                    if (optInfo.Param2) {
                        let ownP2 = this.model.getOwnTresureCnt(Number(optInfo.Param2))
                        if (ownP2 <= 0) {
                            color = ColorConstant.RED2_COLOR
                        }
                    } else if (optInfo.Param3) {
                        let ownP3 = this.model.getOwnTresureCnt(Number(optInfo.Param3))
                        if (ownP3 <= 0) {
                            color = ColorConstant.RED2_COLOR
                        }
                    }
                }
            }
            item.getChild("viceTitle").asTextField.color = color
            item.onClick(this, this.onClickItem, [optInfo])
        }
    }

    private onClickItem(optInfo: t_s_secretoptionData) {
        switch (optInfo.Type) {
            case SecretEventOptType.Next:
                this.dealTypeNext(optInfo)
                break;
            case SecretEventOptType.Battle:
                this.dealTypeBattle(optInfo)
                break;
            case SecretEventOptType.Tresure:
                this.dealTypeTresure(optInfo)
                break;
        }
    }

    private dealTypeNext(optInfo: t_s_secretoptionData) {
        let str = LangManager.Instance.GetTranslation("Pve.secretScene.tip.next")
        SimpleAlertHelper.Instance.ShowSimple(SimpleAlertHelper.SIMPLE_ALERT, { optInfo: optInfo }, str, (b: boolean) => {
            if (b) {
                this.sendOpt(optInfo)
            }
        })
        // let b = SharedManager.Instance.checkIsExpired(SharedManager.Instance.secretNextLevelCheckDate)
        // if (b) {
        //     let str = LangManager.Instance.GetTranslation("Pve.secretScene.tip.next")
        //     let checkStr = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
        //     SimpleAlertHelper.Instance.ShowSimple(SimpleAlertHelper.USEBINDPOINT_ALERT, { optInfo: optInfo, checkRickText: checkStr, checkRickText2: " ", checkDefault: true }, str, (b: boolean, flag: boolean) => {
        //         if (b) {
        //             this.sendOpt(optInfo)
        //             if (flag) {
        //                 SharedManager.Instance.secretNextLevelCheckDate = new Date()
        //                 SharedManager.Instance.saveSecretNextLevelCheck()
        //             }
        //         }
        //     })
        // } else {
        //     this.sendOpt(optInfo)
        // }
    }

    private dealTypeBattle(optInfo: t_s_secretoptionData) {
        if (optInfo.Param1) {
            let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secrettreasure, optInfo.Param1) as t_s_secrettreasureData
            let str = LangManager.Instance.GetTranslation("Pve.secretScene.tip.battle", temp.TemplateNameLang, temp.profileColor)
            SimpleAlertHelper.Instance.ShowSimple(SimpleAlertHelper.SIMPLE_ALERT, { optInfo: optInfo }, str, (b: boolean) => {
                if (b) {
                    this.sendOpt(optInfo)
                }
            })
        } else {
            this.sendOpt(optInfo)
        }
    }

    private dealTypeTresure(optInfo: t_s_secretoptionData) {
        let con2 = true
        let con3 = true
        if (optInfo.Param2) {
            let ownP2 = this.model.getOwnTresureCnt(Number(optInfo.Param2))
            con2 = ownP2 > 0
        }
        if (optInfo.Param3) {
            let ownP3 = this.model.getOwnTresureCnt(Number(optInfo.Param3))
            con3 = ownP3 > 0
        }
        if (con2 && con3) {
            this.sendOpt(optInfo)
        } else {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Pve.secretScene.tip.tresure"))
        }
    }

    private sendOpt(optInfo: t_s_secretoptionData) {

        let str = ""
        switch (optInfo.Type) {
            case SecretEventOptType.Next:
                str = "下一层"
                break;
            case SecretEventOptType.Battle:
                if (optInfo.Param1) {
                    str = "消耗秘宝战斗"
                } else {
                    str = "战斗"
                }
                break;
            case SecretEventOptType.Tresure:
                if (optInfo.Param1) {
                    str = "获得一个秘宝"
                } else {
                    str = "消耗秘宝战斗"
                }

                if (optInfo.Param2 == "" && optInfo.Param3 == "") {
                    str = "获得一个秘宝"
                } else if (optInfo.Param2 != "" && optInfo.Param3 != "") {
                    str = "消耗2个秘宝，获得1个秘宝"
                } else {
                    if (optInfo.Param2 || optInfo.Param3) {
                        str = "消耗1个秘宝，获得1个秘宝"
                    }
                }
                break;
        }
        Logger.info("[SecretEventCom]选项操作:" + str, this.model.secretInfo.secretId, optInfo.OptionId)

        SecretManager.Instance.sendEventOpt(this.model.secretInfo.secretId, optInfo.OptionId, this.model.secretInfo.curLayer)
    }

    private get model() {
        return this.ctrl.data as PveSecretSceneData
    }

    private get ctrl() {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.PveSecretSceneWnd) as PveSecretSceneCtrl
    }
}
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { t_s_specialtemplateData } from "../../config/t_s_specialtemplate";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { TempleteManager } from "../../manager/TempleteManager";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import AllocateCtrl from "./control/AllocateCtrl";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { PlayerManager } from "../../manager/PlayerManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import Logger from "../../../core/logger/Logger";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import BuildingManager from "../../map/castle/BuildingManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
export default class SoliderInfoTipWnd extends BaseWindow {
  private param: any;
  private PawnNameTxt: fgui.GTextField;
  private DescTxt: fgui.GTextField;
  private SpecialTxt: fgui.GTextField;
  private SpecialDescTxt: fgui.GTextField;
  private list: fgui.GList = null;
  private BtnCancel: UIButton; //遣散
  public BtnSoldiers: UIButton; //配兵
  public BtnFree: UIButton; //撤兵
  public BtnLevelUp: UIButton;
  public BtnLevelUp2: UIButton;
  public cType: fgui.Controller;
  public gOptBtn: fgui.GGroup;
  public ap: ArmyPawn;
  private type: number;
  private attributeArray: Array<string> = [
    "attack",
    "magicAttack",
    "defence",
    "magicDefence",
    "live",
  ];
  public OnInitWind() {
    this.param = this.params;
    this.cType = this.getController("cType");
    this.BtnLevelUp.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.allocate.upgrade",
    );
    this.BtnLevelUp2.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.allocate.upgrade",
    );
    if (this.param) {
      this.ap = this.param.pawnData;
      this.type = this.param.type;

      this.cType.setSelectedIndex(this.type);
      this.setPositon();
    }
    this.addEvent();
  }

  OnShowWind() {
    super.OnShowWind();
    this.initData();
  }

  private addEvent() {
    this.BtnCancel.onClick(this, this.__cancelClickHandler.bind(this));
    this.BtnSoldiers.onClick(this, this.__soliderClickHandler.bind(this));
    this.BtnFree.onClick(this, this.__freeClickHandler.bind(this));
    this.BtnLevelUp.onClick(this, this.__levelClickHandler.bind(this));
    this.BtnLevelUp2.onClick(this, this.__levelClickHandler.bind(this));
  }

  private removeEvent() {
    this.BtnCancel.offClick(this, this.__cancelClickHandler.bind(this));
    this.BtnSoldiers.offClick(this, this.__soliderClickHandler.bind(this));
    this.BtnFree.offClick(this, this.__freeClickHandler.bind(this));
    this.BtnLevelUp.offClick(this, this.__levelClickHandler.bind(this));
    this.BtnLevelUp2.offClick(this, this.__levelClickHandler.bind(this));
  }

  private __cancelClickHandler() {
    UIManager.Instance.ShowWind(EmWindow.SeveranceSoliderWnd, this.ap);
    UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
  }

  private __soliderClickHandler() {
    // let staffingPawnCount = ArmyManager.Instance.army.countAllArmyPawnNmber();
    let totalCanStaffingPawn =
      ArmyManager.Instance.army.baseHero.attackProrerty.totalConatArmy;
    let emputyPos: number = ArmyManager.Instance.army.getEmputyPos();
    let ap = this.ap;
    // 城堡中拥有的准备上阵的兵的数量
    let castleOwnPawnCount = ap.ownPawns;
    // 最大化编排士兵
    let expectStaffingCount: number = 0;
    // 实际编排士兵
    let actualStaffingCount: number = 0;
    // 还缺少的士兵
    let lackCount: number = 0;
    let dstId: number = 0;
    let dstCount: number = 0;
    //剩余的居民可以招募的兵种数量
    let leftPeopleCanBydstCount: number = 0;
    /**
     * 1空
     * 2同一个兵
     * 3不同兵替换
     */
    let type: number;
    if (emputyPos == 0) {
      type = 1;
      expectStaffingCount = totalCanStaffingPawn;
      lackCount = expectStaffingCount - castleOwnPawnCount;
    } else {
      let curPawn: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
      dstId = curPawn.templateId;
      dstCount = curPawn.ownPawns;
      if (curPawn.ownPawns > 0 && curPawn.templateId == ap.templateId) {
        if (curPawn.ownPawns >= totalCanStaffingPawn) return;

        type = 2;
        expectStaffingCount = totalCanStaffingPawn - curPawn.ownPawns;
        lackCount = expectStaffingCount - castleOwnPawnCount;
      } else {
        type = 3;
        expectStaffingCount = totalCanStaffingPawn;
        lackCount = expectStaffingCount - castleOwnPawnCount;
      }
    }

    Logger.info(
      "[SoliderInfoTipWnd]处理方式",
      type,
      lackCount,
      ap.templateInfo.PawnNameLang,
    );
    if (lackCount > 0) {
      let content = LangManager.Instance.GetTranslation(
        "Allocate.askAutoRecruitPawn",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        null,
        content,
        null,
        null,
        (b: boolean) => {
          if (!b) {
            switch (type) {
              case 1:
                this.allocateControler.staffingNewPawn(ap, castleOwnPawnCount);
                break;
              case 2:
                this.allocateControler.staffingOldPawn(ap, castleOwnPawnCount);
                break;
              case 3:
                this.allocateControler.staffingPawnForReplace(
                  ap,
                  castleOwnPawnCount,
                  dstId,
                  dstCount,
                );
                break;
            }
            return;
          }
          let ownPawns = ap.ownPawns;
          //剩余的黄金还能招募的士兵数量
          let canRecruitNum = Math.floor(
            ResourceManager.Instance.gold.count / this.recruitOneGold,
          );
          let nowCount = ResourceManager.Instance.population.count;
          let totalCount = ResourceManager.Instance.population.limit;
          //剩余的人口还能招募的士兵数量
          leftPeopleCanBydstCount = totalCount - nowCount;
          let canMax = Math.min(canRecruitNum, leftPeopleCanBydstCount);
          if (canMax <= 0) {
            //能招募的数量为0
            if (canRecruitNum <= 0) {
              //剩余的黄金还能招募的士兵数量为0
              if (ownPawns <= 0) {
                //该兵种数量为0
                MessageTipManager.Instance.show(
                  LangManager.Instance.GetTranslation("Allocate.GoldNotEnough"),
                );
              } else {
                this.allocateControler.showStopRecruitTip(100);
                Logger.info(
                  "[SoliderInfoTipWnd]没钱招募了且城堡有兵, 直接上阵已有的兵数量",
                  type,
                  lackCount,
                  ap.templateInfo.PawnNameLang,
                );
                actualStaffingCount = ownPawns;
                switch (type) {
                  case 1:
                    this.allocateControler.staffingNewPawn(
                      ap,
                      actualStaffingCount,
                    );
                    break;
                  case 2:
                    this.allocateControler.staffingOldPawn(
                      ap,
                      actualStaffingCount,
                    );
                    break;
                  case 3:
                    this.allocateControler.staffingPawnForReplace(
                      ap,
                      actualStaffingCount,
                      dstId,
                      dstCount,
                    );
                    break;
                }
              }
              return;
            } else if (leftPeopleCanBydstCount <= 0) {
              //人口数量为0
              if (ownPawns <= 0) {
                //该兵种数量为0
                MessageTipManager.Instance.show(
                  LangManager.Instance.GetTranslation(
                    "Allocate.PeopleNotEnough",
                  ),
                );
              } else {
                this.allocateControler.showStopRecruitTip2(100);
                Logger.info(
                  "[SoliderInfoTipWnd]没人口招募了且城堡有兵, 直接上阵已有的兵数量",
                  type,
                  lackCount,
                  ap.templateInfo.PawnNameLang,
                );
                actualStaffingCount = ownPawns;
                switch (type) {
                  case 1:
                    this.allocateControler.staffingNewPawn(
                      ap,
                      actualStaffingCount,
                    );
                    break;
                  case 2:
                    this.allocateControler.staffingOldPawn(
                      ap,
                      actualStaffingCount,
                    );
                    break;
                  case 3:
                    this.allocateControler.staffingPawnForReplace(
                      ap,
                      actualStaffingCount,
                      dstId,
                      dstCount,
                    );
                    break;
                }
              }
              return;
            }
          }

          // 招募后自动上阵
          let recruitNum = Math.min(lackCount, canMax);
          actualStaffingCount = recruitNum + ownPawns;
          this.allocateControler.sendRecruitPawn(
            type,
            ap,
            recruitNum,
            actualStaffingCount,
            dstId,
            dstCount,
            true,
          );

          if (canMax < lackCount) {
            if (canRecruitNum < lackCount) {
              this.allocateControler.showStopRecruitTip();
            } else if (leftPeopleCanBydstCount < lackCount) {
              this.allocateControler.showStopRecruitTip2();
            }
          }
        },
      );
    } else {
      actualStaffingCount = expectStaffingCount;
      switch (type) {
        case 1:
          this.allocateControler.staffingNewPawn(ap, actualStaffingCount);
          break;
        case 2:
          this.allocateControler.staffingOldPawn(ap, actualStaffingCount);
          break;
        case 3:
          this.allocateControler.staffingPawnForReplace(
            ap,
            actualStaffingCount,
            dstId,
            dstCount,
          );
          break;
      }
    }
    UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
  }

  private get recruitOneGold(): number {
    let arr: Array<t_s_buildingtemplateData> =
      BuildingManager.Instance.getMaxEffectBuildingTemplate(
        this.ap.templateInfo,
      );
    if (!arr) return 0;
    arr = ArrayUtils.sortOn(arr, "Property4", ArrayConstant.NUMERIC);
    let buildTemp: t_s_buildingtemplateData = arr[0];

    let playerModel = PlayerManager.Instance.currentPlayerModel;

    let goldValue: number =
      playerModel.playerEffect.getRecruitPawnResourceAddition(
        this.ap.templateInfo.GoldConsume * (1 - buildTemp.Property4 / 100),
      );
    return Math.ceil(goldValue);
  }

  private __freeClickHandler() {
    var count: number = this.ap.ownPawns;
    ArmyManager.Instance.army.removeArmyPawnCountByIndex(0, count);
    ArmyManager.Instance.addPawnCountById(this.ap.templateId, count);
    this.allocateControler.sendMovePawnInfo();
    UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
  }

  private __levelClickHandler() {
    this.hide();
    FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp, this.ap);
  }

  private setPositon() {
    if (this.param.posX + 440 > Resolution.gameWidth) {
      this.x = Resolution.gameWidth - 336;
    } else {
      this.x = this.param.posX + 105;
    }
    if (this.param.posY + 545 > Resolution.gameHeight) {
      this.y = Resolution.gameHeight - 440;
    } else {
      this.y = this.param.posY + 105;
    }
  }

  private initData() {
    if (this.type == 1) {
      //部队界面
      if (this.ap && this.ap.templateInfo && this.ap.ownPawns > 0) {
        this.PawnNameTxt.text =
          this.ap.templateInfo.PawnNameLang +
          " " +
          LangManager.Instance.GetTranslation(
            "buildings.casern.view.RecruitPawnCell.command06",
            this.ap.templateInfo.Level,
          );
        this.DescTxt.text = this.ap.templateInfo.DescriptionLang;
        this.SpecialTxt.text = LangManager.Instance.GetTranslation(
          "gameguide.GameGuideModel.guideInfoTitle20",
        );
        let specialTemp: t_s_specialtemplateData =
          TempleteManager.Instance.getPawnSpecialTemplateByID(
            parseInt(this.ap.specialAbility),
          );
        if (specialTemp) {
          this.SpecialDescTxt.text = LangManager.Instance.GetTranslation(
            "public.level.name",
            specialTemp.TemplateNameLang,
            specialTemp.Grades,
          );
        } else {
          this.SpecialDescTxt.text = LangManager.Instance.GetTranslation(
            "PawnLevelUpWnd.SpecialAbilityNameTxt.openTxt",
          );
        }
        while (this.list.numChildren > 0) {
          this.list.removeChildToPoolAt(0);
        }
        let attributeNameKey: string;
        for (let key in this.attributeArray) {
          let attribute: string = this.attributeArray[key];
          if (this.ap[attribute] > 0) {
            let currentItem: any = this.list.addItemFromPool();
            attributeNameKey = "PawnLevelUpWnd.AttributeNameTxt." + attribute;
            (<fgui.GTextField>currentItem.getChild("AttributeNameTxt")).text =
              LangManager.Instance.GetTranslation(attributeNameKey);
            (<fgui.GTextField>currentItem.getChild("AttributeValueTxt")).text =
              this.ap[attribute].toString();
          }
        }
        this.list.ensureBoundsCorrect();
      }
    } else if (this.type == 2 || this.type == 3) {
      if (this.ap && this.ap.templateInfo) {
        this.PawnNameTxt.text =
          this.ap.templateInfo.PawnNameLang +
          " " +
          LangManager.Instance.GetTranslation(
            "buildings.casern.view.RecruitPawnCell.command06",
            this.ap.templateInfo.Level,
          );
        this.DescTxt.text = this.ap.templateInfo.DescriptionLang;
        this.SpecialTxt.text = LangManager.Instance.GetTranslation(
          "gameguide.GameGuideModel.guideInfoTitle20",
        );
        let specialTemp: t_s_specialtemplateData =
          TempleteManager.Instance.getPawnSpecialTemplateByID(
            parseInt(this.ap.specialAbility),
          );
        if (specialTemp) {
          this.SpecialDescTxt.text = LangManager.Instance.GetTranslation(
            "public.level.name",
            specialTemp.TemplateNameLang,
            specialTemp.Grades,
          );
        } else {
          this.SpecialDescTxt.text = LangManager.Instance.GetTranslation(
            "PawnLevelUpWnd.SpecialAbilityNameTxt.openTxt",
          );
        }
        while (this.list.numChildren > 0) {
          this.list.removeChildToPoolAt(0);
        }
        let attributeNameKey: string;
        for (let key in this.attributeArray) {
          let attribute: string = this.attributeArray[key];
          if (this.ap[attribute] > 0) {
            let currentItem: any = this.list.addItemFromPool();
            attributeNameKey = "PawnLevelUpWnd.AttributeNameTxt." + attribute;
            (<fgui.GTextField>currentItem.getChild("AttributeNameTxt")).text =
              LangManager.Instance.GetTranslation(attributeNameKey);
            (<fgui.GTextField>currentItem.getChild("AttributeValueTxt")).text =
              this.ap[attribute].toString();
          }
        }
        this.list.ensureBoundsCorrect();
      }
    }
  }

  private get allocateControler(): AllocateCtrl {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.AllocateWnd,
    ) as AllocateCtrl;
  }

  protected OnClickModal() {
    this.OnBtnClose();
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}

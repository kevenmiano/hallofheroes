/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 15:17:54
 * @Description: 挑战确认、第一次获得英灵Item
 */

import FUI_TeamFormationPetFigureItem from "../../../../../fui/BaseCommon/FUI_TeamFormationPetFigureItem";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { EmPackName } from '../../../constant/UIDefine';
import FUIHelper from "../../../utils/FUIHelper";
import { PetData } from "../../pet/data/PetData";

export class TeamFormationPetFigureItem extends FUI_TeamFormationPetFigureItem {
    public pos: number = -1;
    private _info: PetData;
    private _avatar: ShowPetAvatar;
    private _isPetFirstSelectWnd = false;
    public bgClickFunc: Function;
    public figureClickFunc: Function;

    public get type(): number {
        return this.cTitleType.selectedIndex;
    }

    public get info(): PetData {
        return this._info;
    }

    public set info(value: PetData) {
        this._info = value;
        if (value) {
            this.refresh();
        } else {
            this.resetView();
        }
    }

    protected onConstruct() {
        super.onConstruct()

        this.btnBg.onClick(this, () => {
            this.bgClickFunc && this.bgClickFunc(this);
        })
        this._avatar = new ShowPetAvatar()
        this._avatar.clickFunc = () => {
            this.figureClickFunc && this.figureClickFunc(this)
        }
        this._avatar.layoutNameFunc = () => {
            // TODO 配置里的位置有偏移
            // this.txtName.y = this.container.y - this._avatar.nameHeight
        }
        this.container.displayObject.addChild(this._avatar)
        this._avatar.pos(20, 200)
    }

    private refresh() {
        this.txtCapacity.text = this._info.fightPower.toString();
        this.txtName.text = this._info.name.toString();
        this.txtName.color = PetData.getQualityColor(this._info.quality - 1);
        this.txtName2.text = this._info.name.toString(); //LangManager.Instance.GetTranslation("public.level2", this._info.grade);
        this.txtName2.color = (this.type == 2) ? "#ffecc6" : PetData.getQualityColor(this._info.quality - 1);
        // this._info.template.PetAvatar = "/pet_athena"
        this._avatar.data = this._info.template;

        this.typeIcon.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + this._info.template.PetType + "_s");
        this.txtDesc.text = this._info.petSkillOutPutTypeLanguage;
    }

    public light() {
        if (this.imgBg && !this.imgBg.isDisposed) {
            if (this.imgBg.displayObject && !this.imgBg.displayObject.destroyed) {
                this.imgBg.url = FUIHelper.getItemURL(EmPackName.BaseCommon, "Img_Formation_Platform_Sel")
                this.imgBg.filters = [UIFilter.light2Filter];
            }
        }
    }

    public normal() {
        if (this.imgBg && !this.imgBg.isDisposed) {
            if (this.imgBg.displayObject && !this.imgBg.displayObject.destroyed) {
                this.imgBg.url = FUIHelper.getItemURL(EmPackName.BaseCommon, "Img_Formation_Platform")
                this.imgBg.filters = [];
            }
        }
    }

    private resetView() {
        this.normal();
        this._avatar.data = null;
        this.txtName.text = "";
        this.txtName2.text = "";
        this.imgFlag.visible = false;
    }
}
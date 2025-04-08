// @ts-nocheck
import FUI_StarTipCom from "../../../../fui/PlayerInfo/FUI_StarTipCom";
import LangManager from "../../../core/lang/LangManager";
import Utils from "../../../core/utils/Utils";
import { StarHelper } from "../../utils/StarHelper";
import StarInfo from "../mail/StarInfo";

/**
 * 星运提示框
 */
export default class StarTipCom extends FUI_StarTipCom {

    private listData: Array<StarInfo>;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent(): void {
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
    }

    private onRenderList(index: number, item: any): void {
        let starInfo: StarInfo = this.listData[index];
        let desc = "";
        if (starInfo) {
            let profile = starInfo.template.Profile;
            var color: string = StarHelper.profileColors[profile];
            // item.getChild('txt_name').color = item.getChild('txt_lv').color = color;
            desc = `[color=${color}]${starInfo.template.TemplateNameLang}  ${LangManager.Instance.GetTranslation("public.level2", starInfo.grade)}[/color]&nbsp;&nbsp;`
            // item.getChild('txt_name').text = starInfo.template.TemplateNameLang;
            // item.getChild('txt_lv').text = LangManager.Instance.GetTranslation("public.level2",starInfo.grade);

            if (starInfo.template.DefaultSkill.length > 0) {
                // item.getChild('txt_desc').text = StarHelper.getStarBufferName(starInfo);
                desc += StarHelper.getStarBufferName(starInfo);
            } else {
                // item.getChild('txt_desc').text = this.getAttribute(starInfo);
                desc += this.getAttribute(starInfo);
            }
            item.getChild('txt_desc').text = desc;
        }
    }

    private getAttribute(info: StarInfo): string {
        var str: string = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Power");
        if (info.template.Power > 0) {
            str += String(info.template.Power * info.grade);
            return str;
        }
        if (info.template.Agility > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Agility");
            str += String(info.template.Agility * info.grade);
            return str;
        }
        if (info.template.Intellect > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Intellect");
            str += String(info.template.Intellect * info.grade);
            return str;
        }
        if (info.template.Physique > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Physique");
            str += String(info.template.Physique * info.grade);
            return str;
        }
        if (info.template.Captain > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Captain");
            str += String(info.template.Captain * info.grade);
            return str;
        }
        if (info.template.Attack > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Attack");
            str += String(info.template.Attack * info.grade);
            return str;
        }
        if (info.template.Defence > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Defence");
            str += String(info.template.Defence * info.grade);
            return str;
        }
        if (info.template.MagicAttack > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.MagicAttack");
            str += String(info.template.MagicAttack * info.grade);
            return str;
        }
        if (info.template.MagicDefence > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.MagicDefence");
            str += String(info.template.MagicDefence * info.grade);
            return str;
        }
        if (info.template.ForceHit > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.ForceHit");
            str += String(info.template.ForceHit * info.grade);
            return str;
        }
        if (info.template.Live > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Live");
            str += String(info.template.Live * info.grade);
            return str;
        }
        if (info.template.Conat > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Conat");
            str += String(info.template.Conat * info.grade);
            return str;
        }
        if (info.template.Parry > 0) {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.StarPowTip.Parry");
            str += String(info.template.Parry * info.grade);
            return str;
        }
    }

    setData(data: Array<StarInfo>): void {
        this.listData = data;
        let len = this.list.numItems = data.length;
        this.txt_star.text = StarHelper.getStarPower(data) + '';
        this.list.visible = len > 0;
        this.list.resizeToFit(len);
        this.group && this.group.ensureSizeCorrect();
    }

    removeEvent(): void {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.listData = null;
    }
}
import LangManager from "../../../../core/lang/LangManager";

/**
 * 公会职务（权限）等级
 * @author yuanzhan.yu
 */
export class ConsortiaDutyLevel {
    public static CHAIRMAN: number = 1;
    public static VICE_CHAIRMAN: number = 2;
    public static OFFICIAL: number = 3;
    public static ELITE: number = 4;
    public static NORMAL: number = 5;

    constructor() {
    }

    public static getDutyByButyLevel(level: number): string {
        var str: string = "";
        switch (level) {
            case ConsortiaDutyLevel.CHAIRMAN:
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaPermissionFrame.name00");
                break;
            case ConsortiaDutyLevel.VICE_CHAIRMAN:
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaPermissionFrame.name01");
                break;
            case ConsortiaDutyLevel.OFFICIAL:
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaPermissionFrame.name02");
                break;
            case ConsortiaDutyLevel.ELITE:
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaPermissionFrame.name03");
                break;
            case ConsortiaDutyLevel.NORMAL:
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaPermissionFrame.name03");
                break;
        }
        return str;
    }

    private static _dutyOpenNameList: string[]
    public static get dutyOpenNameList() {
        if (!this._dutyOpenNameList) {
            let conunt = 42;
            this._dutyOpenNameList = [];
            for (let index = 1; index <= conunt; index++) {
                let strelement = "ConsortiaDutyLevel.duty" + index.toString();
                let strValue = LangManager.Instance.GetTranslation(strelement)
                if(!strValue || strValue == "") continue;
                this._dutyOpenNameList.push(strValue);
            }
        }
        return this._dutyOpenNameList;
    }

    public static showDutyList = [ConsortiaDutyLevel.CHAIRMAN, ConsortiaDutyLevel.VICE_CHAIRMAN, ConsortiaDutyLevel.OFFICIAL, ConsortiaDutyLevel.NORMAL]
}
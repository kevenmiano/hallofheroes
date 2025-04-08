// @ts-nocheck
import { ActionTemplateData } from "../../battle/skillsys/mode/ActionTemplateData";
import { SkillFrameData } from "../../battle/skillsys/mode/framedata/SkillFrameData";
import { SkillFrameDataTransform } from "../../battle/skillsys/transform/SkillFrameDataTransform";
import { t_s_actionData } from "../t_s_action";


export class ActionTemplateInfoResolveII {
    actionTeamplateData: ActionTemplateData

    constructor() {
        this.actionTeamplateData = new ActionTemplateData()
        return this
    }

    public resolveImp(element: t_s_actionData): ActionTemplateData {
        this.actionTeamplateData.ActionId = element["ActionId"];
        this.actionTeamplateData.frames.push(ActionTemplateInfoResolveII.createFrameData(element));
        return this.actionTeamplateData
    }
    /**
     * 将一行的数据转换为帧数据. 
     * @param element
     * @return 
     */
    private static createFrameData(element: t_s_actionData): SkillFrameData {
        let frameData: SkillFrameData = new SkillFrameData();
        frameData.ActionType = element.ActionType
        frameData.Frame = element.Frame
        frameData.Frame2 = element.Frame
        // t_s_action 把性别去掉了？？
        frameData.Sex = 2;
        SkillFrameDataTransform.transformStringToFrameData(frameData, element);

        return frameData;
    }
}
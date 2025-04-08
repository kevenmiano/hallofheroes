// @ts-nocheck
import FUI_BaseIcon from "../../../fui/Base/FUI_BaseIcon";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/26 17:50
 * @ver 1.0
 *
 */
export class BaseIcon extends FUI_BaseIcon
{
    constructor()
    {
        super();
    }

    public setIcon(url:string)
    {
        this.icon = url;
    }

    dispose()
    {
        super.dispose();
    }
}
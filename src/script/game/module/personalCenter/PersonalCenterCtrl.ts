import { SharedManager } from "../../manager/SharedManager"
import FrameCtrlBase from "../../mvc/FrameCtrlBase"
import { AthorzieType } from "./comp/PrivacyCom"
import PersonalCenterWnd from "./PersonalCenterWnd"
/**
 * 个人中心控制器
 * Ctrl类中持有对UI类、数据类的引用（view、data）, 在Ctrl中进行逻辑数据处理后, 再传递处理后的数据直接刷新界面
 */
export default class PersonalCenterCtrl extends FrameCtrlBase {
    show() {
        super.show()

    }

    hide() {
        super.hide()
    }

    dispose() {
        super.dispose()
    }

    /**
     * 手机端授权后更新对应的状态
     * @param type 
     */
    updatePrivacyData(type:AthorzieType):void
    {
        // switch (type) {
        //     case AthorzieType.Phone:
                
        //         break;
        
        //     default:
        //         break;
        // }
        SharedManager.Instance.authorizDic[type] = 1;
        SharedManager.Instance.saveAuthorizeDic();

        (this.view as PersonalCenterWnd).updatePrivacyView();
    }

}
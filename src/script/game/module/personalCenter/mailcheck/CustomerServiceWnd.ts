import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";
import ServiceCom from "../comp/ServiceCom";

/**
 * @author:zhihua.zhou
 * @data: 2022-3-1
 * @description 客服界面
 */
export default class CustomerServiceWnd extends BaseWindow {
  private serviceCom: ServiceCom;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.serviceCom.init();
  }

  OnHideWind() {
    super.OnHideWind();
    this.serviceCom.removeEvent();
    this.serviceCom.removeUpLoad();
    CustomerServiceManager.Instance.model.fileName = null;
  }
}

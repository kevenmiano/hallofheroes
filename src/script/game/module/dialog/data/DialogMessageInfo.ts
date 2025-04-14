import t_s_baseConfigData from "../../../config/t_s_baseConfigData";

/**
 * @author yuanzhan.yu
 */
export class DialogMessageInfo extends t_s_baseConfigData {
  public index: number;
  public event: string; //事件,比如回话完成后回调服务器
  public rawData: string;
  public param: string;

  public direction: number;
  public roleId: number; //角色id, 取图片
  public delayTime: number; //延迟
  public roleName: string = "";
  public txt: string = "";

  copy(data?: any) {
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private txtKey: string = "txt";
  public get txtLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.txtKey));
    if (value) {
      return value;
    }
    return this.getKeyValue(this.txtKey);
  }

  private roleNameKey: string = "roleName";
  public get roleNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.roleNameKey));
    if (value) {
      return value;
    }
    return this.getKeyValue(this.roleNameKey);
  }

  public set roleNameLang(str: string) {
    this[this.getLangKey(this.roleNameKey)] = str;
  }
}

/**
 * @author:pzlricky
 * @data: 2021-02-25 10:27
 * @description ***
 */
export default class ConfigInfosTempInfo {
  public static temp = new ConfigInfosTempInfo();

  public ConfigName: string = ""; //配置名称
  public ConfigValue: string = ""; //配置值
  public Description: string = ""; //配置描述

  constructor(data?: object) {
    for (let i in data) {
      this[i] = data[i];
    }
  }
}

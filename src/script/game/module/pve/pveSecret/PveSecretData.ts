//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2024-02-28 12:22:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-19 11:16:51
 * @Description:
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_secretData } from "../../../config/t_s_secret";
import { ConfigType } from "../../../constant/ConfigDefine";
import { SecretType } from "../../../datas/secret/SecretConst";
import SecretModel from "../../../datas/secret/SecretModel";
import FrameDataBase from "../../../mvc/FrameDataBase";

export default class PveSecretData extends FrameDataBase {
  secretCfg: t_s_secretData;
  secretCfgList: t_s_secretData[] = [];

  show() {
    super.show();
    /** 按照类型取配置表 */
    this.secretCfgList = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_secret,
      SecretModel.transSecretType2CfgType(SecretType.Single),
    ) as t_s_secretData[];
  }

  hide() {
    super.hide();
  }

  dispose() {
    super.dispose();
  }
}

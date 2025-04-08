import FUI_PreviewBoxItem from "../../../fui/Base/FUI_PreviewBoxItem";
import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";

/**
 * 宝箱预览项
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年8月8日17:10:43
 */
export class PreviewBoxItem extends FUI_PreviewBoxItem {
  /**道具信息 */
  public goods: GoodsInfo = null;

  /**构造函数 */
  protected onConstruct(): void {
    super.onConstruct();
  }

  /**设置道具信息 */
  public set info(goods: GoodsInfo) {
    this.goods = goods;

    (this.goodsItem as BaseItem).info = goods;
    (this.goodsItem as BaseItem).text = goods.count.toString();

    this.goodsName.color = goods.templateInfo.profileColor;
    this.goodsName.text = goods.templateInfo.TemplateNameLang;
  }

  /**释放 */
  public dispose() {
    super.dispose();
  }
}

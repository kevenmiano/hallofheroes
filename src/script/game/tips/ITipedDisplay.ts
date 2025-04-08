import { EmWindow } from "../constant/UIDefine";

export interface ITipedDisplay extends fgui.GObject {
  tipType: EmWindow;
  tipData: any;
  showType?: TipsShowType; //显示tips的方式, TipsShowType类型,默认单击显示
  canOperate?: boolean; //tips上是否显示可操作按钮
  extData?: any; //tips附带的额外数据
  startPoint?: Laya.Point; //tips显示位置, 默认居中显示
  iSDown?: boolean; //是否按下
  isMove?: boolean; //当按下鼠标移动超过多少距离才算移动
  mouseDownPoint?: Laya.Point; //当前按下坐标点
  moveDistance?: number;
  alphaTest?: boolean; //点到非透明像素才显示 TODO: 只做了单击
  /**
   * 在前面的优先级高。
   *
   * 例如 tipDirctions="7,0" 组件会优先查找方向7显示是否正常(有没有超出屏幕)
   * 如果没有超出那么TIP将会以方向7来进行展示, 如果方向7显示不正常, 那么将会查找0方向
   * 的显示是否正常, 如果显示正常那么将以方向0来进行展示, 如果方向0与方向7都显示不正常
   * 那么将会以优先级最高的那么个也就是方向7来进行展示
   *
   * 具体方向参见 Directions类
   * 具体显示规则参见ToolTipsManager 的 showTip方法
   */
  tipDirctions?: string;

  /**
   * TIP 的目标对象与TIP之间的纵向间距
   */
  tipGapV?: number;

  /**
   * TIP 的目标对象与TIP之间的横向间距
   */
  tipGapH?: number;
}

export enum TipsShowType {
  onDefault, //单击
  onClick, //单击
  onDoubleClick, //双击
  onMouseDown, //按下
  onLongPress, //长按
  onLongPress2, //长按显示, 松开后消失
}

import LangManager from "../../core/lang/LangManager";
/**
 * 海外主干1.6.5——静态变量类
 * 由于海外一些特殊需求, 不得不写死一些ID, 考虑到后期维护不是很方便, 故写这类专存这些静态变量, 以便后期维护
 * @author xiaobin.chen
 *
 */
export class CommonConstant {
  /**
   * 王者之塔的sontype
   */
  public static KINGTOWER_SONTYPE: number = 300;
  /**
   * 王者之塔的areaId
   */
  public static KINGTOWER_AREAID: number = 300;
  /**
   * 试炼之塔的sontype
   */
  public static TRAILTOWER_SONTYPE: number = 301;
  /**
   * 团队副本泰拉神庙的AreaId
   */
  public static TAILA_SHENMIAO: number = 401;
  /**
   * 坐骑卡前面的三位ID
   */
  public static MOUNT_CARD: string = "218";

  public static RENAME_CARD_TEMPID: number = 208018;

  public static RUNE_GEM_ENERGY: number = 4020003;
  public static RUNE_GEM_ENERGY_2: number = 4020002;
  /** 符孔钻 */
  public static RUNE_HOLE_CARVE: number = 4010001;
  /** 符石碎片*/
  public static RUNE_GEM_FRAGMENT: number = -1000;

  public static PET_SOUL_STONE: number = 208023; //圣魂石物品模板id
  /**物品品质框*/
  public static QUALITY_RES = [
    "Icon_Box_White",
    "Icon_Box_Green",
    "Icon_Box_Blue",
    "Icon_Box_Purple",
    "Icon_Box_Golden",
    "Icon_Box_Red",
    "Icon_Box_Fashion",
  ];
  /**角色框背景*/
  public static FIGURE_BG_RES = [
    "Img_RoleBg_Knight",
    "Img_RoleBg_Archer",
    "Img_RoleBg_Mage",
  ];
  /**镶嵌宝石*/
  public static GEM_ITEMS_RES = [
    "",
    "Lab_Gem_7",
    "Lab_Gem_1",
    "Lab_Gem_2",
    "Lab_Gem_6",
    "Lab_Gem_5",
    "Lab_Gem_8",
    "Lab_Gem_3",
    "Lab_Gem_4",
    "",
    "Lab_Gem_0",
  ];
  /**镶嵌符石*/
  public static RUNEGEM_ITEMS_RES = [
    "Lab_Gem_0",
    "icon_lab01",
    "icon_lab02",
    "icon_lab03",
    "icon_lab04",
    "icon_lab05",
    "icon_lab06",
  ];
}

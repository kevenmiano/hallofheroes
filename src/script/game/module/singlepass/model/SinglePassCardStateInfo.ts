//@ts-expect-error: External dependencies
export default class SinglePassCardStateInfo {
  public static LEFT: string = "left";
  public static CENTER: string = "center";
  public static RIGHT: string = "right";

  public alpha: number = 0;
  public x: number = 0;
  public y: number = 0;
  public scale: number = 0;
  public align: string = "";

  constructor(
    $alpha: number,
    $x: number,
    $y: number,
    $scale: number,
    $align: string,
  ) {
    this.alpha = $alpha;
    this.x = $x;
    this.y = $y;
    this.scale = $scale;
    this.align = $align;
  }
}

export class Func {
  private mThisObj: any;
  private mCallBack: Function;

  public constructor(thisObj: any, callBack: Function) {
    this.mThisObj = thisObj;
    this.mCallBack = callBack;
  }

  public Invoke(...args: any[]) {
    if (this.mCallBack) {
      this.mCallBack.call(this.mThisObj, ...args);
    }
  }

  public get handler(): Function {
    return this.mCallBack;
  }

  public get target(): any {
    return this.mThisObj;
  }
}

export class DataAnalyzer {
  protected _onCompleteCall: Function;
  public constructor(onCompleteCall: Function) {
    this._onCompleteCall = onCompleteCall;
  }

  public analyze(data: any) {}
  public message: string;
  public analyzeCompleteCall: Function;
  public analyzeErrorCall: Function;
  protected onAnalyzeComplete() {
    if (this._onCompleteCall != null) this._onCompleteCall(this);
    if (this.analyzeCompleteCall != null) this.analyzeCompleteCall();
  }

  protected onAnalyzeError() {
    if (this.analyzeErrorCall != null) this.analyzeErrorCall();
  }
}

/**
 * 解析Json文件
 * @author:pzlricky
 * @data: 2020-11-26 15:57
 * @description ***
 */
export default class LanguageAnalyzer extends DataAnalyzer {
  private nAllExp: RegExp = /\\n/g;
  public languages: { [key: string]: object };

  constructor(onCompleteCall: Function) {
    super(onCompleteCall);
  }

  public analyze(data: any) {
    if (data && data.mDataList) {
      let list = data.mDataList;
      this.languages = list;
    }
    this.onAnalyzeComplete();
  }
}

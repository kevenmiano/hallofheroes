export default class DataAnalyzer {
  protected _onCompleteCall: Function;

  constructor(onCompleteCall: Function) {
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

import { DataAnalyzer } from "../../../core/lang/LanguageAnalyzer";
import ResMgr from '../../../core/res/ResMgr';
import ByteArray from '../../../core/net/ByteArray';

export class FilterWordAnalyzer extends DataAnalyzer {

    constructor(onCompleteCall: Function) {
        super(onCompleteCall);
        this.words = [];
        this.nickNames = [];
    }

    public words: any[];
    public nickNames: any[];
    public unableChar: string

    public analyze(dataPath: string) {
        let data = null;
        if (dataPath) {
            ResMgr.Instance.loadRes(dataPath, (ret) => {
                if (ret) {
                    let content: ByteArray = new ByteArray();
                    content.writeArrayBuffer(ret);
                    if (content && (content.bytesAvailable || content.length)) {
                        try {
                            content.position = 0;
                            content.uncompress();
                            data = content.readUTF();
                            content.clear();
                            var arr: any[] = (<string>data).toLocaleLowerCase().split("\n"); //"\n" 回车换行
                            this.unableChar = arr[0];
                            this.nickNames = arr[1].split("|");
                            this.words = arr[2].split("|");
                            this.onAnalyzeComplete();
                        } catch (error) {
                            this.onAnalyzeComplete();
                        }
                    } else {
                        this.onAnalyzeComplete();
                    }
                } else {
                    this.onAnalyzeComplete();
                }
            }, null, Laya.Loader.BUFFER)
        } else {
            this.onAnalyzeComplete();
        }
    }
}
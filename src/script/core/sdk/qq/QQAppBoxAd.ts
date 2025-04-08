
import BaseAd from "../base/BaseAd";

export default class QQAppBoxAd extends BaseAd {

    protected Instance: qq.AppBox;
    open(id: string) {

        this.create(id)
    }

    create(id: string) {
        this.adUnitID = id;
        this.Instance = qq.createAppBox({ adUnitId: id })
        this.load()
    }

    load() {
        if (this.Instance) {
            this.Instance.load()
        }
    }

    show() {
        if (this.Instance) {
            this.Instance.show()
        }
    }

    destroy() {
        if (this.Instance) {
            this.Instance.destroy()
        }
    }


}
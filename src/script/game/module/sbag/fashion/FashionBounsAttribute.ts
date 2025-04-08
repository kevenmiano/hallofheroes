import FUI_FashionBounsAttribute from "../../../../../fui/SBag/FUI_FashionBounsAttribute";

export class FashionBounsAttribute extends FUI_FashionBounsAttribute {

    // public setData(att: string, value: number) {
    //     this.setAttribute(att);
    //     this.setValue(value);
    // }

    public setAttribute(att: string) {
        this.attLab.text = att;
    }

    // public setValue(value: number) {
    //     this.valeLab.text = value + "";
    // }
}
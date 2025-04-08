import FUI_AirGardenGameLLKGroup from "../../../../../fui/Carnival/FUI_AirGardenGameLLKGroup";
import AirGardenGameLLKItem from "./AirGardenGameLLKItem";


export class AirGardenGameLLKGroup extends FUI_AirGardenGameLLKGroup {

    protected onConstruct(): void {
        super.onConstruct();
    }

    public getItemAt(index: number) {
        let r = (index / 10) >> 0;
        let c = index % 10;
        return this.getChild("l" + r + c) as AirGardenGameLLKItem;
    }

}
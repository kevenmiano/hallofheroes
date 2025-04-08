// @ts-nocheck
import FUI_RuneHoldList from "../../../../../fui/Skill/FUI_RuneHoldList";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { RuneHoldListItem } from "./RuneHoldListItem";

export class RuneHoldList extends FUI_RuneHoldList {

    private runeHoles: RuneHoleInfo[];

    protected onConstruct(): void {
        super.onConstruct();
        this.list.displayObject['dyna'] = true;
        this.list.itemRenderer = Laya.Handler.create(this, this.itemRenderer, null, false);
        this.list.setVirtual();
    }


    private itemRenderer(index: number, box: RuneHoldListItem) {
        box.info = this.runeHoles[index];
    }

    public setListData(runeHoles: RuneHoleInfo[]) {
        this.runeHoles = runeHoles;
        this.list.numItems = this.runeHoles.length;
        this.list.selectedIndex = 0;        
    }


    public refresh() {
        this.list.refreshVirtualList();
    }


}
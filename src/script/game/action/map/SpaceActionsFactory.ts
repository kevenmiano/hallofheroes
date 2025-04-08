// @ts-nocheck
import {PackageIn} from "../../../core/net/PackageIn";
import CollectionAction from "../../battle/actions/CollectionAction";
import {GameBaseQueueManager} from "../../manager/GameBaseQueueManager";
import SpaceManager from "../../map/space/SpaceManager";

/**
 * @author:pzlricky
 * @data: 2021-06-21 14:08
 * @description ***
 */
export default class SpaceActionsFactory
{

    constructor()
    {

    }

    public static createAction($action:string, $target:Object, pkg:PackageIn, time:number = 75, targetId:number = 0)
    {
        pkg.position = PackageIn.HEADER_SIZE;
        switch($action)
        {
            case "COLLECTION":
                if(SpaceManager.Instance.model.onCollectionId == 0)
                {
                    GameBaseQueueManager.Instance.addAction(new CollectionAction($target, targetId));
                }
                break;

        }
    }

}
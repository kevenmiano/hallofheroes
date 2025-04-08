// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-12-27 16:36:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-04-20 16:48:15
 * @Description: 
 */
import {PackageIn} from "../../../core/net/PackageIn";
import AlphaFlickerAction from "../../battle/actions/AlphaFlickerAction";
import CollectionAction from "../../battle/actions/CollectionAction";
import MessageAction from "../../battle/actions/common/MessageAction";
import TrapAction from "./TrapAction";
import {JoyStickEvent} from "../../constant/event/NotificationEvent";
import {CampaignManager} from "../../manager/CampaignManager";
import {CampaignMovieQueueManager} from "../../manager/CampaignMovieQueueManager";
import {NotificationManager} from "../../manager/NotificationManager";
import {SceneManager} from "../../map/scene/SceneManager";
import MovieType from "../../map/space/constant/MovieType";
import {CommonAction} from "./CommonAction";
import MapNameMovieAction from "./MapNameMovieAction";
import {TranseferAction} from "./TranseferAction";
import {TranseferEndAction} from "./TranseferEndAction";

export class CampaignActionsFactory
{
    public static createAction($action:string, $target:any, pkg:PackageIn, time:number = 75, targetId:number = 0)
    {
        pkg.position = PackageIn.HEADER_SIZE;
        switch($action)
        {
            case MovieType.DISAPPEARD:
                CampaignMovieQueueManager.Instance.addAction(new CommonAction($target, time));
                break;
            case MovieType.TRANSPORT_START:
                SceneManager.Instance.enable = false
                NotificationManager.Instance.dispatchEvent(JoyStickEvent.JoystickTriggerUp);
                CampaignMovieQueueManager.Instance.addAction(new TranseferAction($target, $target.x, $target.y, $action));
                break;
            case MovieType.TRANSPORT_END:
                CampaignMovieQueueManager.Instance.addAction(new TranseferEndAction(pkg, $action));
                break;
            case MovieType.FLICKER:
                CampaignMovieQueueManager.Instance.addAction(new AlphaFlickerAction($target));
                break;
            case MovieType.TRAP:
                CampaignMovieQueueManager.Instance.addAction(new TrapAction($target));
                break;
            case MovieType.SESSION:
                CampaignMovieQueueManager.Instance.addAction(new MessageAction(pkg));
                break;
            case MovieType.GAME_PLOT:

                break;
            case MovieType.MOVIE_MAP_NAME:
                CampaignMovieQueueManager.Instance.addAction(new MapNameMovieAction());
                break;
            case MovieType.COLLECTION:
                if(CampaignManager.Instance.mapModel.onCollectionId == 0)
                {
                    CampaignMovieQueueManager.Instance.addAction(new CollectionAction($target, targetId));
                }
                break;
        }
    }
}
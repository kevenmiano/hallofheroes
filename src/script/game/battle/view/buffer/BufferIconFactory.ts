import { BattleEffect } from "../../skillsys/effect/BattleEffect";
import { SkillEffect } from "../../skillsys/effect/SkillEffect";

/**
 * @author:pzlricky
 * @data: 2021-05-17 21:06
 * @description ***
 */
export default class BufferIconFactory {
  private static _instance: BufferIconFactory;

  public static get Instance(): BufferIconFactory {
    if (!this._instance) {
      this._instance = new BufferIconFactory();
    }
    return this._instance;
  }

  //		public getBufferIconII(icon : String):GameView
  //		{
  //			var gameView : GameView = new GameView();
  //			gameView.data = BattleManager.Instance.resourceModel.getDefinition(icon);
  //			return gameView;
  //		}
  //		public getBufferIcon(iconId:int):GameView
  //		{
  //			var resourceId : int = 1;
  //			var gameView : GameView;
  //
  //			switch(iconId)
  //			{
  //				case 1:
  //				case 2:
  //				case 3:
  //				case 4:
  //				case 5:
  //				case 6:
  //				case 7:
  //				case 8:
  //				case 9:
  //				case 10:
  //				case 11:
  //					resourceId = iconId;
  //					break;
  //				default:
  //					break;
  //			}
  //			gameView = new GameView();
  //			gameView.data = BattleManager.Instance.resourceModel.getDefinition("battle.buffer.BufferIcon" + resourceId);
  //			return gameView;
  //		}

  public getBufferEffectII(icon: string): BattleEffect {
    var effect: BattleEffect;
    effect = new SkillEffect(icon);

    return effect;
  }

  public getBufferEffect(iconId: number): BattleEffect {
    var effect: BattleEffect;
    var resourceId: number = 1;
    switch (iconId) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        resourceId = iconId;
        break;
      default:
        break;
    }
    effect = new SkillEffect("slg.resource.BufferEffect" + resourceId);
    //			effect.getDisplayObject().y = -80;
    return effect;
  }
}

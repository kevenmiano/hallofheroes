import { SwitchInfo } from "../datas/SwitchInfo";

	export class ConfigManager
	{
		private static _info:SwitchInfo;
		constructor()
		{
		}
		
		public static setup(info:SwitchInfo)
		{
			ConfigManager._info = info;
		}
		
		public static get info():SwitchInfo
		{
			return ConfigManager._info;
		}
		
	}
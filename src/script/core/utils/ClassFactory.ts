// @ts-nocheck
import {DateFormatter} from "./DateFormatter";

export class ClassFactory
{
    public static createInstance(cls:any, properties:Object):any
    {
        var Instance:Object = new cls();

        if(properties != null)
        {
            for(var p in properties)
            {
                if(Instance[p] instanceof Date)
                {
                    Instance[p] = this.copyDateType(properties[p]);
                }
                else
                {
                    Instance[p] = properties[p];
                }
            }
        }
        return Instance;
    }

//         public static createInstanceII(cls:any, properties:Object,classInfo:XML):any
//         {
//             var Instance:Object = new cls();
//             for each ( var v:XML in classInfo..*.( name() == "variable" || name() == "accessor" ) )
//             {
//                 if(v.@access == "readonly")continue;
//                 var t:string = v.@type;
//                 var property:string = v.@name;
//                 switch(t)
//                 {
//                     case "boolean":
//                         Instance[property] = sloveBooble(properties[property]);
//                         break;
//                     case "number":
//                         Instance[property] = number(properties[property]);
//                         break;
//                     case "number":
//                         Instance[property] = number(properties[property]);
//                         break;
//                     case "number":
//                         Instance[property] = number(properties[property]);
//                         break;
//                     case "string":
//                         Instance[property] = string(properties[property]);
//                         break;
//                     case "Date":
//                         Instance[property] = copyDateType(properties[property]);
//                         break;
//                     default:
// //						if(properties[v.@name])Instance[v.@name] = properties[v.@name];
//                 }
//             }
//             return Instance;
//         }

    private static sloveBooble(obj:any):boolean
    {
        if(obj instanceof String)
        {
            if(String(obj) == "true")
            {
                return true;
            }
            else if(String(obj) == "false")
            {
                return false;
            }
            else
            {
                return Boolean(obj);
            }
        }
        return Boolean(obj);
    }


    public static copyDateType(properties:Object):Date
    {
        if(!properties)
        {
            return null;
        }
        var d:Date;
        if(properties.hasOwnProperty('year'))
        {
            d = new Date(properties["year"], properties["month"] - 1, properties["day"], properties["hour"], properties["minute"], properties["second"]);
        }
        else
        {
            d = DateFormatter.parse(properties.toString(), "YYYY-MM-DD hh:mm:ss");
        }
        return d;
    }
}
import ByteArray from "../net/ByteArray";

export class ByteUtils
{
    /// <summary>
    /// Converts a byte array into a hex dump
    /// </summary>
    /// <param name="description">Dump description</param>
    /// <param name="dump">byte array</param>
    /// <param name="start">dump start offset</param>
    /// <param name="count">dump bytes count</param>
    /// <returns>the converted hex dump</returns>
    public static ToHexDump(description:string, dump:ByteArray, start:number, count:number):string
    {
        var hexDump:string = "";
        if(description != null)
        {
            hexDump += description;
            hexDump += "\n";
        }
        var end:number = start + count;
        for(var i:number = start; i < end; i += 16)
        {
            var text:string = "";
            var hex:string = "";
            for(var j:number = 0; j < 16; j++)
            {
                if(j + i < end)
                {
                    var val:number = dump[j + i];
                    if(val < 16)
                    {
                        hex += "0" + val.toString(16) + " ";
                    }
                    else
                    {
                        hex += val.toString(16) + " ";
                    }

                    if(val >= 32 && val <= 127)
                    {
                        text += String.fromCharCode(val);
                    }
                    else
                    {
                        text += ".";
                    }
                }
                else
                {
                    hex += "   ";
                    text += " ";
                }
            }
            hex += "  ";
            hex += text;
            hex += '\n';
            hexDump += hex;
        }
        return hexDump;
    }
}
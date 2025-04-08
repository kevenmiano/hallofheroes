

export class AvatarPartInfo
{
    public static BODY:string = "body";
    public static ARMS:string = "arms";
    public static HAIR_UP:string = "hair_up";
    public static HAIR_DOWN:string = "hair_down";
    public static CLOAK:string = "cloak";
    public static MOUNT:string = "mount";
    public static WING:string = "wing";
    public static PET:string = "pet";
    
    public static BODY_MOUNT:string = "body_mount";
    public static ARMS_MOUNT:string = "arms_mount";
    public static HAIR_UP_MOUNT:string = "hair_up_mount";
    public static HAIR_DOWN_MOUNT:string = "hair_down_mount";
    public static CLOAK_MOUNT:string = "cloak_mount";
    public static MOUNT_MOUNT:string = "mount_mount";
    public static WING_MOUNT:string = "wing_mount";
    public static PET_MOUNT:string = "pet_mount";
    
    
    private _url:string;
    public partPosition:string;
    constructor()
    {
    }
    
    public get url():string
    {
        return this._url;
    }

    public set url(value:string)
    {
        this._url = value.toLowerCase();
    }

}
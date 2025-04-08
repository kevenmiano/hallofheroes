import { PetData } from "../../../module/pet/data/PetData";

export class RemotePetListInfo {
  public fight: number;

  public petPos: string;

  public formationString: string = "-1,-1,-1,-1,-1,-1,-1,-1";

  public petList: PetData[];

  public constructor() {
    this.petList = [];
  }

  public get remotePetFormationOfArray() {
    return this.formationString.split(",");
  }

  /** 查找宠物 */
  public getPet(petId: number): PetData {
    for (let pet of this.petList) {
      if (pet && pet.petId == petId) {
        return pet;
      }
    }
    return null;
  }
}

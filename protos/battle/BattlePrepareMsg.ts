// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: battle/BattlePrepareMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.battle";

export interface BattlePrepareMsg {
  battleId: string;
  battleType: number;
  mapTempId: number;
  needAnimation: boolean;
  side: number;
  hasAssault: boolean;
  useWay: number;
  attackModel: number;
  reinforceCount: number;
  currentReinforce: number;
  battleCapity: number;
  countDown: number;
  damageImprove: number;
  soldiers: number[];
  heros: number[];
  soldierTemplated: number[];
  coolDown: number[];
  currentWave: number;
  pets: number[];
  watchHeros: number[];
}

function createBaseBattlePrepareMsg(): BattlePrepareMsg {
  return {
    battleId: "",
    battleType: 0,
    mapTempId: 0,
    needAnimation: false,
    side: 0,
    hasAssault: false,
    useWay: 0,
    attackModel: 0,
    reinforceCount: 0,
    currentReinforce: 0,
    battleCapity: 0,
    countDown: 0,
    damageImprove: 0,
    soldiers: [],
    heros: [],
    soldierTemplated: [],
    coolDown: [],
    currentWave: 0,
    pets: [],
    watchHeros: [],
  };
}

export const BattlePrepareMsg: MessageFns<BattlePrepareMsg> = {
  encode(message: BattlePrepareMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.battleId !== "") {
      writer.uint32(10).string(message.battleId);
    }
    if (message.battleType !== 0) {
      writer.uint32(16).int32(message.battleType);
    }
    if (message.mapTempId !== 0) {
      writer.uint32(24).int32(message.mapTempId);
    }
    if (message.needAnimation !== false) {
      writer.uint32(32).bool(message.needAnimation);
    }
    if (message.side !== 0) {
      writer.uint32(40).int32(message.side);
    }
    if (message.hasAssault !== false) {
      writer.uint32(48).bool(message.hasAssault);
    }
    if (message.useWay !== 0) {
      writer.uint32(56).int32(message.useWay);
    }
    if (message.attackModel !== 0) {
      writer.uint32(64).int32(message.attackModel);
    }
    if (message.reinforceCount !== 0) {
      writer.uint32(72).int32(message.reinforceCount);
    }
    if (message.currentReinforce !== 0) {
      writer.uint32(80).int32(message.currentReinforce);
    }
    if (message.battleCapity !== 0) {
      writer.uint32(88).int32(message.battleCapity);
    }
    if (message.countDown !== 0) {
      writer.uint32(96).int32(message.countDown);
    }
    if (message.damageImprove !== 0) {
      writer.uint32(104).int32(message.damageImprove);
    }
    writer.uint32(114).fork();
    for (const v of message.soldiers) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(122).fork();
    for (const v of message.heros) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(130).fork();
    for (const v of message.soldierTemplated) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(138).fork();
    for (const v of message.coolDown) {
      writer.int32(v);
    }
    writer.join();
    if (message.currentWave !== 0) {
      writer.uint32(144).int32(message.currentWave);
    }
    writer.uint32(154).fork();
    for (const v of message.pets) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(162).fork();
    for (const v of message.watchHeros) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BattlePrepareMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBattlePrepareMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.battleId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.battleType = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.mapTempId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.needAnimation = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.side = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.hasAssault = reader.bool();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.useWay = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.attackModel = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.reinforceCount = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.currentReinforce = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.battleCapity = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 96) {
            break;
          }

          message.countDown = reader.int32();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.damageImprove = reader.int32();
          continue;
        }
        case 14: {
          if (tag === 112) {
            message.soldiers.push(reader.int32());

            continue;
          }

          if (tag === 114) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.soldiers.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 15: {
          if (tag === 120) {
            message.heros.push(reader.int32());

            continue;
          }

          if (tag === 122) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.heros.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 16: {
          if (tag === 128) {
            message.soldierTemplated.push(reader.int32());

            continue;
          }

          if (tag === 130) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.soldierTemplated.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 17: {
          if (tag === 136) {
            message.coolDown.push(reader.int32());

            continue;
          }

          if (tag === 138) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.coolDown.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 18: {
          if (tag !== 144) {
            break;
          }

          message.currentWave = reader.int32();
          continue;
        }
        case 19: {
          if (tag === 152) {
            message.pets.push(reader.int32());

            continue;
          }

          if (tag === 154) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.pets.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 20: {
          if (tag === 160) {
            message.watchHeros.push(reader.int32());

            continue;
          }

          if (tag === 162) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.watchHeros.push(reader.int32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BattlePrepareMsg {
    return {
      battleId: isSet(object.battleId) ? globalThis.String(object.battleId) : "",
      battleType: isSet(object.battleType) ? globalThis.Number(object.battleType) : 0,
      mapTempId: isSet(object.mapTempId) ? globalThis.Number(object.mapTempId) : 0,
      needAnimation: isSet(object.needAnimation) ? globalThis.Boolean(object.needAnimation) : false,
      side: isSet(object.side) ? globalThis.Number(object.side) : 0,
      hasAssault: isSet(object.hasAssault) ? globalThis.Boolean(object.hasAssault) : false,
      useWay: isSet(object.useWay) ? globalThis.Number(object.useWay) : 0,
      attackModel: isSet(object.attackModel) ? globalThis.Number(object.attackModel) : 0,
      reinforceCount: isSet(object.reinforceCount) ? globalThis.Number(object.reinforceCount) : 0,
      currentReinforce: isSet(object.currentReinforce) ? globalThis.Number(object.currentReinforce) : 0,
      battleCapity: isSet(object.battleCapity) ? globalThis.Number(object.battleCapity) : 0,
      countDown: isSet(object.countDown) ? globalThis.Number(object.countDown) : 0,
      damageImprove: isSet(object.damageImprove) ? globalThis.Number(object.damageImprove) : 0,
      soldiers: globalThis.Array.isArray(object?.soldiers) ? object.soldiers.map((e: any) => globalThis.Number(e)) : [],
      heros: globalThis.Array.isArray(object?.heros) ? object.heros.map((e: any) => globalThis.Number(e)) : [],
      soldierTemplated: globalThis.Array.isArray(object?.soldierTemplated)
        ? object.soldierTemplated.map((e: any) => globalThis.Number(e))
        : [],
      coolDown: globalThis.Array.isArray(object?.coolDown) ? object.coolDown.map((e: any) => globalThis.Number(e)) : [],
      currentWave: isSet(object.currentWave) ? globalThis.Number(object.currentWave) : 0,
      pets: globalThis.Array.isArray(object?.pets) ? object.pets.map((e: any) => globalThis.Number(e)) : [],
      watchHeros: globalThis.Array.isArray(object?.watchHeros)
        ? object.watchHeros.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: BattlePrepareMsg): unknown {
    const obj: any = {};
    if (message.battleId !== "") {
      obj.battleId = message.battleId;
    }
    if (message.battleType !== 0) {
      obj.battleType = Math.round(message.battleType);
    }
    if (message.mapTempId !== 0) {
      obj.mapTempId = Math.round(message.mapTempId);
    }
    if (message.needAnimation !== false) {
      obj.needAnimation = message.needAnimation;
    }
    if (message.side !== 0) {
      obj.side = Math.round(message.side);
    }
    if (message.hasAssault !== false) {
      obj.hasAssault = message.hasAssault;
    }
    if (message.useWay !== 0) {
      obj.useWay = Math.round(message.useWay);
    }
    if (message.attackModel !== 0) {
      obj.attackModel = Math.round(message.attackModel);
    }
    if (message.reinforceCount !== 0) {
      obj.reinforceCount = Math.round(message.reinforceCount);
    }
    if (message.currentReinforce !== 0) {
      obj.currentReinforce = Math.round(message.currentReinforce);
    }
    if (message.battleCapity !== 0) {
      obj.battleCapity = Math.round(message.battleCapity);
    }
    if (message.countDown !== 0) {
      obj.countDown = Math.round(message.countDown);
    }
    if (message.damageImprove !== 0) {
      obj.damageImprove = Math.round(message.damageImprove);
    }
    if (message.soldiers?.length) {
      obj.soldiers = message.soldiers.map((e) => Math.round(e));
    }
    if (message.heros?.length) {
      obj.heros = message.heros.map((e) => Math.round(e));
    }
    if (message.soldierTemplated?.length) {
      obj.soldierTemplated = message.soldierTemplated.map((e) => Math.round(e));
    }
    if (message.coolDown?.length) {
      obj.coolDown = message.coolDown.map((e) => Math.round(e));
    }
    if (message.currentWave !== 0) {
      obj.currentWave = Math.round(message.currentWave);
    }
    if (message.pets?.length) {
      obj.pets = message.pets.map((e) => Math.round(e));
    }
    if (message.watchHeros?.length) {
      obj.watchHeros = message.watchHeros.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BattlePrepareMsg>, I>>(base?: I): BattlePrepareMsg {
    return BattlePrepareMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BattlePrepareMsg>, I>>(object: I): BattlePrepareMsg {
    const message = createBaseBattlePrepareMsg();
    message.battleId = object.battleId ?? "";
    message.battleType = object.battleType ?? 0;
    message.mapTempId = object.mapTempId ?? 0;
    message.needAnimation = object.needAnimation ?? false;
    message.side = object.side ?? 0;
    message.hasAssault = object.hasAssault ?? false;
    message.useWay = object.useWay ?? 0;
    message.attackModel = object.attackModel ?? 0;
    message.reinforceCount = object.reinforceCount ?? 0;
    message.currentReinforce = object.currentReinforce ?? 0;
    message.battleCapity = object.battleCapity ?? 0;
    message.countDown = object.countDown ?? 0;
    message.damageImprove = object.damageImprove ?? 0;
    message.soldiers = object.soldiers?.map((e) => e) || [];
    message.heros = object.heros?.map((e) => e) || [];
    message.soldierTemplated = object.soldierTemplated?.map((e) => e) || [];
    message.coolDown = object.coolDown?.map((e) => e) || [];
    message.currentWave = object.currentWave ?? 0;
    message.pets = object.pets?.map((e) => e) || [];
    message.watchHeros = object.watchHeros?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

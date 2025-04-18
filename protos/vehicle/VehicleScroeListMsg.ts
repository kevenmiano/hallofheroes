// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: vehicle/VehicleScroeListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.vehicle";

export interface VehicleScroeListMsg {
  playerId: string;
  playerScroe: string;
  playerExp: string;
  awardPropId: string;
  awardSum: string;
  ladderPropId: string;
  ladderSum: string;
  awardPropIdNew: string;
  awardSumNew: string;
  serverName: string;
  killCount: string;
  order: string;
  nickName: string;
  scoreChangeTime: string;
  pickSkillCount: string;
  enterSeq: string;
}

function createBaseVehicleScroeListMsg(): VehicleScroeListMsg {
  return {
    playerId: "",
    playerScroe: "",
    playerExp: "",
    awardPropId: "",
    awardSum: "",
    ladderPropId: "",
    ladderSum: "",
    awardPropIdNew: "",
    awardSumNew: "",
    serverName: "",
    killCount: "",
    order: "",
    nickName: "",
    scoreChangeTime: "",
    pickSkillCount: "",
    enterSeq: "",
  };
}

export const VehicleScroeListMsg: MessageFns<VehicleScroeListMsg> = {
  encode(message: VehicleScroeListMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.playerId !== "") {
      writer.uint32(10).string(message.playerId);
    }
    if (message.playerScroe !== "") {
      writer.uint32(18).string(message.playerScroe);
    }
    if (message.playerExp !== "") {
      writer.uint32(26).string(message.playerExp);
    }
    if (message.awardPropId !== "") {
      writer.uint32(34).string(message.awardPropId);
    }
    if (message.awardSum !== "") {
      writer.uint32(42).string(message.awardSum);
    }
    if (message.ladderPropId !== "") {
      writer.uint32(50).string(message.ladderPropId);
    }
    if (message.ladderSum !== "") {
      writer.uint32(58).string(message.ladderSum);
    }
    if (message.awardPropIdNew !== "") {
      writer.uint32(66).string(message.awardPropIdNew);
    }
    if (message.awardSumNew !== "") {
      writer.uint32(74).string(message.awardSumNew);
    }
    if (message.serverName !== "") {
      writer.uint32(82).string(message.serverName);
    }
    if (message.killCount !== "") {
      writer.uint32(90).string(message.killCount);
    }
    if (message.order !== "") {
      writer.uint32(98).string(message.order);
    }
    if (message.nickName !== "") {
      writer.uint32(106).string(message.nickName);
    }
    if (message.scoreChangeTime !== "") {
      writer.uint32(114).string(message.scoreChangeTime);
    }
    if (message.pickSkillCount !== "") {
      writer.uint32(122).string(message.pickSkillCount);
    }
    if (message.enterSeq !== "") {
      writer.uint32(130).string(message.enterSeq);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VehicleScroeListMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVehicleScroeListMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.playerId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.playerScroe = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.playerExp = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.awardPropId = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.awardSum = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.ladderPropId = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.ladderSum = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.awardPropIdNew = reader.string();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.awardSumNew = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }

          message.serverName = reader.string();
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }

          message.killCount = reader.string();
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }

          message.order = reader.string();
          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }

          message.scoreChangeTime = reader.string();
          continue;
        }
        case 15: {
          if (tag !== 122) {
            break;
          }

          message.pickSkillCount = reader.string();
          continue;
        }
        case 16: {
          if (tag !== 130) {
            break;
          }

          message.enterSeq = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VehicleScroeListMsg {
    return {
      playerId: isSet(object.playerId) ? globalThis.String(object.playerId) : "",
      playerScroe: isSet(object.playerScroe) ? globalThis.String(object.playerScroe) : "",
      playerExp: isSet(object.playerExp) ? globalThis.String(object.playerExp) : "",
      awardPropId: isSet(object.awardPropId) ? globalThis.String(object.awardPropId) : "",
      awardSum: isSet(object.awardSum) ? globalThis.String(object.awardSum) : "",
      ladderPropId: isSet(object.ladderPropId) ? globalThis.String(object.ladderPropId) : "",
      ladderSum: isSet(object.ladderSum) ? globalThis.String(object.ladderSum) : "",
      awardPropIdNew: isSet(object.awardPropIdNew) ? globalThis.String(object.awardPropIdNew) : "",
      awardSumNew: isSet(object.awardSumNew) ? globalThis.String(object.awardSumNew) : "",
      serverName: isSet(object.serverName) ? globalThis.String(object.serverName) : "",
      killCount: isSet(object.killCount) ? globalThis.String(object.killCount) : "",
      order: isSet(object.order) ? globalThis.String(object.order) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      scoreChangeTime: isSet(object.scoreChangeTime) ? globalThis.String(object.scoreChangeTime) : "",
      pickSkillCount: isSet(object.pickSkillCount) ? globalThis.String(object.pickSkillCount) : "",
      enterSeq: isSet(object.enterSeq) ? globalThis.String(object.enterSeq) : "",
    };
  },

  toJSON(message: VehicleScroeListMsg): unknown {
    const obj: any = {};
    if (message.playerId !== "") {
      obj.playerId = message.playerId;
    }
    if (message.playerScroe !== "") {
      obj.playerScroe = message.playerScroe;
    }
    if (message.playerExp !== "") {
      obj.playerExp = message.playerExp;
    }
    if (message.awardPropId !== "") {
      obj.awardPropId = message.awardPropId;
    }
    if (message.awardSum !== "") {
      obj.awardSum = message.awardSum;
    }
    if (message.ladderPropId !== "") {
      obj.ladderPropId = message.ladderPropId;
    }
    if (message.ladderSum !== "") {
      obj.ladderSum = message.ladderSum;
    }
    if (message.awardPropIdNew !== "") {
      obj.awardPropIdNew = message.awardPropIdNew;
    }
    if (message.awardSumNew !== "") {
      obj.awardSumNew = message.awardSumNew;
    }
    if (message.serverName !== "") {
      obj.serverName = message.serverName;
    }
    if (message.killCount !== "") {
      obj.killCount = message.killCount;
    }
    if (message.order !== "") {
      obj.order = message.order;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.scoreChangeTime !== "") {
      obj.scoreChangeTime = message.scoreChangeTime;
    }
    if (message.pickSkillCount !== "") {
      obj.pickSkillCount = message.pickSkillCount;
    }
    if (message.enterSeq !== "") {
      obj.enterSeq = message.enterSeq;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VehicleScroeListMsg>, I>>(base?: I): VehicleScroeListMsg {
    return VehicleScroeListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VehicleScroeListMsg>, I>>(object: I): VehicleScroeListMsg {
    const message = createBaseVehicleScroeListMsg();
    message.playerId = object.playerId ?? "";
    message.playerScroe = object.playerScroe ?? "";
    message.playerExp = object.playerExp ?? "";
    message.awardPropId = object.awardPropId ?? "";
    message.awardSum = object.awardSum ?? "";
    message.ladderPropId = object.ladderPropId ?? "";
    message.ladderSum = object.ladderSum ?? "";
    message.awardPropIdNew = object.awardPropIdNew ?? "";
    message.awardSumNew = object.awardSumNew ?? "";
    message.serverName = object.serverName ?? "";
    message.killCount = object.killCount ?? "";
    message.order = object.order ?? "";
    message.nickName = object.nickName ?? "";
    message.scoreChangeTime = object.scoreChangeTime ?? "";
    message.pickSkillCount = object.pickSkillCount ?? "";
    message.enterSeq = object.enterSeq ?? "";
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

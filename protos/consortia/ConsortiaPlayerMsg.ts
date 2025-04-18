// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: consortia/ConsortiaPlayerMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.consortia";

export interface ConsortiaPlayerMsg {
  nickName: string;
  sex: number;
  pic: number;
  consortiaId: number;
  consortiaName: string;
  level: number;
  mapName: string;
  fightCapacity: number;
  playernonespeak: boolean;
  refusefriend: boolean;
  right: number;
  vipGrade: number;
  vipFriendCount: number;
  appellid: number;
  frameId: number;
  transGrade: number;
  petId: number;
  petFight: number;
  petName: string;
  petQuality: number;
  petType: number;
  petTempId: number;
  clientLan: number;
  job: number;
}

function createBaseConsortiaPlayerMsg(): ConsortiaPlayerMsg {
  return {
    nickName: "",
    sex: 0,
    pic: 0,
    consortiaId: 0,
    consortiaName: "",
    level: 0,
    mapName: "",
    fightCapacity: 0,
    playernonespeak: false,
    refusefriend: false,
    right: 0,
    vipGrade: 0,
    vipFriendCount: 0,
    appellid: 0,
    frameId: 0,
    transGrade: 0,
    petId: 0,
    petFight: 0,
    petName: "",
    petQuality: 0,
    petType: 0,
    petTempId: 0,
    clientLan: 0,
    job: 0,
  };
}

export const ConsortiaPlayerMsg: MessageFns<ConsortiaPlayerMsg> = {
  encode(message: ConsortiaPlayerMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.nickName !== "") {
      writer.uint32(10).string(message.nickName);
    }
    if (message.sex !== 0) {
      writer.uint32(16).int32(message.sex);
    }
    if (message.pic !== 0) {
      writer.uint32(24).int32(message.pic);
    }
    if (message.consortiaId !== 0) {
      writer.uint32(32).int32(message.consortiaId);
    }
    if (message.consortiaName !== "") {
      writer.uint32(42).string(message.consortiaName);
    }
    if (message.level !== 0) {
      writer.uint32(48).int32(message.level);
    }
    if (message.mapName !== "") {
      writer.uint32(58).string(message.mapName);
    }
    if (message.fightCapacity !== 0) {
      writer.uint32(64).int32(message.fightCapacity);
    }
    if (message.playernonespeak !== false) {
      writer.uint32(72).bool(message.playernonespeak);
    }
    if (message.refusefriend !== false) {
      writer.uint32(80).bool(message.refusefriend);
    }
    if (message.right !== 0) {
      writer.uint32(88).int32(message.right);
    }
    if (message.vipGrade !== 0) {
      writer.uint32(96).int32(message.vipGrade);
    }
    if (message.vipFriendCount !== 0) {
      writer.uint32(104).int32(message.vipFriendCount);
    }
    if (message.appellid !== 0) {
      writer.uint32(112).int32(message.appellid);
    }
    if (message.frameId !== 0) {
      writer.uint32(120).int32(message.frameId);
    }
    if (message.transGrade !== 0) {
      writer.uint32(128).int32(message.transGrade);
    }
    if (message.petId !== 0) {
      writer.uint32(136).int32(message.petId);
    }
    if (message.petFight !== 0) {
      writer.uint32(144).int32(message.petFight);
    }
    if (message.petName !== "") {
      writer.uint32(154).string(message.petName);
    }
    if (message.petQuality !== 0) {
      writer.uint32(160).int32(message.petQuality);
    }
    if (message.petType !== 0) {
      writer.uint32(168).int32(message.petType);
    }
    if (message.petTempId !== 0) {
      writer.uint32(176).int32(message.petTempId);
    }
    if (message.clientLan !== 0) {
      writer.uint32(184).int32(message.clientLan);
    }
    if (message.job !== 0) {
      writer.uint32(192).int32(message.job);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsortiaPlayerMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsortiaPlayerMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.sex = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.pic = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.consortiaId = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.consortiaName = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.level = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.mapName = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.fightCapacity = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.playernonespeak = reader.bool();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.refusefriend = reader.bool();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.right = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 96) {
            break;
          }

          message.vipGrade = reader.int32();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.vipFriendCount = reader.int32();
          continue;
        }
        case 14: {
          if (tag !== 112) {
            break;
          }

          message.appellid = reader.int32();
          continue;
        }
        case 15: {
          if (tag !== 120) {
            break;
          }

          message.frameId = reader.int32();
          continue;
        }
        case 16: {
          if (tag !== 128) {
            break;
          }

          message.transGrade = reader.int32();
          continue;
        }
        case 17: {
          if (tag !== 136) {
            break;
          }

          message.petId = reader.int32();
          continue;
        }
        case 18: {
          if (tag !== 144) {
            break;
          }

          message.petFight = reader.int32();
          continue;
        }
        case 19: {
          if (tag !== 154) {
            break;
          }

          message.petName = reader.string();
          continue;
        }
        case 20: {
          if (tag !== 160) {
            break;
          }

          message.petQuality = reader.int32();
          continue;
        }
        case 21: {
          if (tag !== 168) {
            break;
          }

          message.petType = reader.int32();
          continue;
        }
        case 22: {
          if (tag !== 176) {
            break;
          }

          message.petTempId = reader.int32();
          continue;
        }
        case 23: {
          if (tag !== 184) {
            break;
          }

          message.clientLan = reader.int32();
          continue;
        }
        case 24: {
          if (tag !== 192) {
            break;
          }

          message.job = reader.int32();
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

  fromJSON(object: any): ConsortiaPlayerMsg {
    return {
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      sex: isSet(object.sex) ? globalThis.Number(object.sex) : 0,
      pic: isSet(object.pic) ? globalThis.Number(object.pic) : 0,
      consortiaId: isSet(object.consortiaId) ? globalThis.Number(object.consortiaId) : 0,
      consortiaName: isSet(object.consortiaName) ? globalThis.String(object.consortiaName) : "",
      level: isSet(object.level) ? globalThis.Number(object.level) : 0,
      mapName: isSet(object.mapName) ? globalThis.String(object.mapName) : "",
      fightCapacity: isSet(object.fightCapacity) ? globalThis.Number(object.fightCapacity) : 0,
      playernonespeak: isSet(object.playernonespeak) ? globalThis.Boolean(object.playernonespeak) : false,
      refusefriend: isSet(object.refusefriend) ? globalThis.Boolean(object.refusefriend) : false,
      right: isSet(object.right) ? globalThis.Number(object.right) : 0,
      vipGrade: isSet(object.vipGrade) ? globalThis.Number(object.vipGrade) : 0,
      vipFriendCount: isSet(object.vipFriendCount) ? globalThis.Number(object.vipFriendCount) : 0,
      appellid: isSet(object.appellid) ? globalThis.Number(object.appellid) : 0,
      frameId: isSet(object.frameId) ? globalThis.Number(object.frameId) : 0,
      transGrade: isSet(object.transGrade) ? globalThis.Number(object.transGrade) : 0,
      petId: isSet(object.petId) ? globalThis.Number(object.petId) : 0,
      petFight: isSet(object.petFight) ? globalThis.Number(object.petFight) : 0,
      petName: isSet(object.petName) ? globalThis.String(object.petName) : "",
      petQuality: isSet(object.petQuality) ? globalThis.Number(object.petQuality) : 0,
      petType: isSet(object.petType) ? globalThis.Number(object.petType) : 0,
      petTempId: isSet(object.petTempId) ? globalThis.Number(object.petTempId) : 0,
      clientLan: isSet(object.clientLan) ? globalThis.Number(object.clientLan) : 0,
      job: isSet(object.job) ? globalThis.Number(object.job) : 0,
    };
  },

  toJSON(message: ConsortiaPlayerMsg): unknown {
    const obj: any = {};
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.sex !== 0) {
      obj.sex = Math.round(message.sex);
    }
    if (message.pic !== 0) {
      obj.pic = Math.round(message.pic);
    }
    if (message.consortiaId !== 0) {
      obj.consortiaId = Math.round(message.consortiaId);
    }
    if (message.consortiaName !== "") {
      obj.consortiaName = message.consortiaName;
    }
    if (message.level !== 0) {
      obj.level = Math.round(message.level);
    }
    if (message.mapName !== "") {
      obj.mapName = message.mapName;
    }
    if (message.fightCapacity !== 0) {
      obj.fightCapacity = Math.round(message.fightCapacity);
    }
    if (message.playernonespeak !== false) {
      obj.playernonespeak = message.playernonespeak;
    }
    if (message.refusefriend !== false) {
      obj.refusefriend = message.refusefriend;
    }
    if (message.right !== 0) {
      obj.right = Math.round(message.right);
    }
    if (message.vipGrade !== 0) {
      obj.vipGrade = Math.round(message.vipGrade);
    }
    if (message.vipFriendCount !== 0) {
      obj.vipFriendCount = Math.round(message.vipFriendCount);
    }
    if (message.appellid !== 0) {
      obj.appellid = Math.round(message.appellid);
    }
    if (message.frameId !== 0) {
      obj.frameId = Math.round(message.frameId);
    }
    if (message.transGrade !== 0) {
      obj.transGrade = Math.round(message.transGrade);
    }
    if (message.petId !== 0) {
      obj.petId = Math.round(message.petId);
    }
    if (message.petFight !== 0) {
      obj.petFight = Math.round(message.petFight);
    }
    if (message.petName !== "") {
      obj.petName = message.petName;
    }
    if (message.petQuality !== 0) {
      obj.petQuality = Math.round(message.petQuality);
    }
    if (message.petType !== 0) {
      obj.petType = Math.round(message.petType);
    }
    if (message.petTempId !== 0) {
      obj.petTempId = Math.round(message.petTempId);
    }
    if (message.clientLan !== 0) {
      obj.clientLan = Math.round(message.clientLan);
    }
    if (message.job !== 0) {
      obj.job = Math.round(message.job);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsortiaPlayerMsg>, I>>(base?: I): ConsortiaPlayerMsg {
    return ConsortiaPlayerMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsortiaPlayerMsg>, I>>(object: I): ConsortiaPlayerMsg {
    const message = createBaseConsortiaPlayerMsg();
    message.nickName = object.nickName ?? "";
    message.sex = object.sex ?? 0;
    message.pic = object.pic ?? 0;
    message.consortiaId = object.consortiaId ?? 0;
    message.consortiaName = object.consortiaName ?? "";
    message.level = object.level ?? 0;
    message.mapName = object.mapName ?? "";
    message.fightCapacity = object.fightCapacity ?? 0;
    message.playernonespeak = object.playernonespeak ?? false;
    message.refusefriend = object.refusefriend ?? false;
    message.right = object.right ?? 0;
    message.vipGrade = object.vipGrade ?? 0;
    message.vipFriendCount = object.vipFriendCount ?? 0;
    message.appellid = object.appellid ?? 0;
    message.frameId = object.frameId ?? 0;
    message.transGrade = object.transGrade ?? 0;
    message.petId = object.petId ?? 0;
    message.petFight = object.petFight ?? 0;
    message.petName = object.petName ?? "";
    message.petQuality = object.petQuality ?? 0;
    message.petType = object.petType ?? 0;
    message.petTempId = object.petTempId ?? 0;
    message.clientLan = object.clientLan ?? 0;
    message.job = object.job ?? 0;
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

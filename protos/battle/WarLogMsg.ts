// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: battle/WarLogMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.battle";

export interface WarLogMsg {
  winTeamId: number;
  redUserIds: string;
  blueUserIds: string;
  blueSocre: number;
  redScore: number;
  blueSize: number;
  redSize: number;
  campaignId: number;
  startMillis: string;
}

function createBaseWarLogMsg(): WarLogMsg {
  return {
    winTeamId: 0,
    redUserIds: "",
    blueUserIds: "",
    blueSocre: 0,
    redScore: 0,
    blueSize: 0,
    redSize: 0,
    campaignId: 0,
    startMillis: "",
  };
}

export const WarLogMsg: MessageFns<WarLogMsg> = {
  encode(message: WarLogMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.winTeamId !== 0) {
      writer.uint32(8).int32(message.winTeamId);
    }
    if (message.redUserIds !== "") {
      writer.uint32(18).string(message.redUserIds);
    }
    if (message.blueUserIds !== "") {
      writer.uint32(26).string(message.blueUserIds);
    }
    if (message.blueSocre !== 0) {
      writer.uint32(32).int32(message.blueSocre);
    }
    if (message.redScore !== 0) {
      writer.uint32(40).int32(message.redScore);
    }
    if (message.blueSize !== 0) {
      writer.uint32(48).int32(message.blueSize);
    }
    if (message.redSize !== 0) {
      writer.uint32(56).int32(message.redSize);
    }
    if (message.campaignId !== 0) {
      writer.uint32(64).int32(message.campaignId);
    }
    if (message.startMillis !== "") {
      writer.uint32(74).string(message.startMillis);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): WarLogMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWarLogMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.winTeamId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.redUserIds = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.blueUserIds = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.blueSocre = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.redScore = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.blueSize = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.redSize = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.campaignId = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.startMillis = reader.string();
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

  fromJSON(object: any): WarLogMsg {
    return {
      winTeamId: isSet(object.winTeamId) ? globalThis.Number(object.winTeamId) : 0,
      redUserIds: isSet(object.redUserIds) ? globalThis.String(object.redUserIds) : "",
      blueUserIds: isSet(object.blueUserIds) ? globalThis.String(object.blueUserIds) : "",
      blueSocre: isSet(object.blueSocre) ? globalThis.Number(object.blueSocre) : 0,
      redScore: isSet(object.redScore) ? globalThis.Number(object.redScore) : 0,
      blueSize: isSet(object.blueSize) ? globalThis.Number(object.blueSize) : 0,
      redSize: isSet(object.redSize) ? globalThis.Number(object.redSize) : 0,
      campaignId: isSet(object.campaignId) ? globalThis.Number(object.campaignId) : 0,
      startMillis: isSet(object.startMillis) ? globalThis.String(object.startMillis) : "",
    };
  },

  toJSON(message: WarLogMsg): unknown {
    const obj: any = {};
    if (message.winTeamId !== 0) {
      obj.winTeamId = Math.round(message.winTeamId);
    }
    if (message.redUserIds !== "") {
      obj.redUserIds = message.redUserIds;
    }
    if (message.blueUserIds !== "") {
      obj.blueUserIds = message.blueUserIds;
    }
    if (message.blueSocre !== 0) {
      obj.blueSocre = Math.round(message.blueSocre);
    }
    if (message.redScore !== 0) {
      obj.redScore = Math.round(message.redScore);
    }
    if (message.blueSize !== 0) {
      obj.blueSize = Math.round(message.blueSize);
    }
    if (message.redSize !== 0) {
      obj.redSize = Math.round(message.redSize);
    }
    if (message.campaignId !== 0) {
      obj.campaignId = Math.round(message.campaignId);
    }
    if (message.startMillis !== "") {
      obj.startMillis = message.startMillis;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WarLogMsg>, I>>(base?: I): WarLogMsg {
    return WarLogMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WarLogMsg>, I>>(object: I): WarLogMsg {
    const message = createBaseWarLogMsg();
    message.winTeamId = object.winTeamId ?? 0;
    message.redUserIds = object.redUserIds ?? "";
    message.blueUserIds = object.blueUserIds ?? "";
    message.blueSocre = object.blueSocre ?? 0;
    message.redScore = object.redScore ?? 0;
    message.blueSize = object.blueSize ?? 0;
    message.redSize = object.redSize ?? 0;
    message.campaignId = object.campaignId ?? 0;
    message.startMillis = object.startMillis ?? "";
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

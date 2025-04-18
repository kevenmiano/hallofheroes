// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: guildcampaign/GuildGroupMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.guildcampaign";

export interface GuildGroupMsg {
  consortiaId: number;
  consortiaName: string;
  group1: number;
  group2: number;
  group3: number;
  group4: number;
  result1: number;
  result2: number;
  result3: number;
  result4: number;
  score: number;
  order: number;
  fightPower: number;
}

function createBaseGuildGroupMsg(): GuildGroupMsg {
  return {
    consortiaId: 0,
    consortiaName: "",
    group1: 0,
    group2: 0,
    group3: 0,
    group4: 0,
    result1: 0,
    result2: 0,
    result3: 0,
    result4: 0,
    score: 0,
    order: 0,
    fightPower: 0,
  };
}

export const GuildGroupMsg: MessageFns<GuildGroupMsg> = {
  encode(message: GuildGroupMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.consortiaId !== 0) {
      writer.uint32(8).int32(message.consortiaId);
    }
    if (message.consortiaName !== "") {
      writer.uint32(18).string(message.consortiaName);
    }
    if (message.group1 !== 0) {
      writer.uint32(24).int32(message.group1);
    }
    if (message.group2 !== 0) {
      writer.uint32(32).int32(message.group2);
    }
    if (message.group3 !== 0) {
      writer.uint32(40).int32(message.group3);
    }
    if (message.group4 !== 0) {
      writer.uint32(48).int32(message.group4);
    }
    if (message.result1 !== 0) {
      writer.uint32(56).int32(message.result1);
    }
    if (message.result2 !== 0) {
      writer.uint32(64).int32(message.result2);
    }
    if (message.result3 !== 0) {
      writer.uint32(72).int32(message.result3);
    }
    if (message.result4 !== 0) {
      writer.uint32(80).int32(message.result4);
    }
    if (message.score !== 0) {
      writer.uint32(88).int32(message.score);
    }
    if (message.order !== 0) {
      writer.uint32(96).int32(message.order);
    }
    if (message.fightPower !== 0) {
      writer.uint32(104).int32(message.fightPower);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GuildGroupMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGuildGroupMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.consortiaId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.consortiaName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.group1 = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.group2 = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.group3 = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.group4 = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.result1 = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.result2 = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.result3 = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.result4 = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.score = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 96) {
            break;
          }

          message.order = reader.int32();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.fightPower = reader.int32();
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

  fromJSON(object: any): GuildGroupMsg {
    return {
      consortiaId: isSet(object.consortiaId) ? globalThis.Number(object.consortiaId) : 0,
      consortiaName: isSet(object.consortiaName) ? globalThis.String(object.consortiaName) : "",
      group1: isSet(object.group1) ? globalThis.Number(object.group1) : 0,
      group2: isSet(object.group2) ? globalThis.Number(object.group2) : 0,
      group3: isSet(object.group3) ? globalThis.Number(object.group3) : 0,
      group4: isSet(object.group4) ? globalThis.Number(object.group4) : 0,
      result1: isSet(object.result1) ? globalThis.Number(object.result1) : 0,
      result2: isSet(object.result2) ? globalThis.Number(object.result2) : 0,
      result3: isSet(object.result3) ? globalThis.Number(object.result3) : 0,
      result4: isSet(object.result4) ? globalThis.Number(object.result4) : 0,
      score: isSet(object.score) ? globalThis.Number(object.score) : 0,
      order: isSet(object.order) ? globalThis.Number(object.order) : 0,
      fightPower: isSet(object.fightPower) ? globalThis.Number(object.fightPower) : 0,
    };
  },

  toJSON(message: GuildGroupMsg): unknown {
    const obj: any = {};
    if (message.consortiaId !== 0) {
      obj.consortiaId = Math.round(message.consortiaId);
    }
    if (message.consortiaName !== "") {
      obj.consortiaName = message.consortiaName;
    }
    if (message.group1 !== 0) {
      obj.group1 = Math.round(message.group1);
    }
    if (message.group2 !== 0) {
      obj.group2 = Math.round(message.group2);
    }
    if (message.group3 !== 0) {
      obj.group3 = Math.round(message.group3);
    }
    if (message.group4 !== 0) {
      obj.group4 = Math.round(message.group4);
    }
    if (message.result1 !== 0) {
      obj.result1 = Math.round(message.result1);
    }
    if (message.result2 !== 0) {
      obj.result2 = Math.round(message.result2);
    }
    if (message.result3 !== 0) {
      obj.result3 = Math.round(message.result3);
    }
    if (message.result4 !== 0) {
      obj.result4 = Math.round(message.result4);
    }
    if (message.score !== 0) {
      obj.score = Math.round(message.score);
    }
    if (message.order !== 0) {
      obj.order = Math.round(message.order);
    }
    if (message.fightPower !== 0) {
      obj.fightPower = Math.round(message.fightPower);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GuildGroupMsg>, I>>(base?: I): GuildGroupMsg {
    return GuildGroupMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GuildGroupMsg>, I>>(object: I): GuildGroupMsg {
    const message = createBaseGuildGroupMsg();
    message.consortiaId = object.consortiaId ?? 0;
    message.consortiaName = object.consortiaName ?? "";
    message.group1 = object.group1 ?? 0;
    message.group2 = object.group2 ?? 0;
    message.group3 = object.group3 ?? 0;
    message.group4 = object.group4 ?? 0;
    message.result1 = object.result1 ?? 0;
    message.result2 = object.result2 ?? 0;
    message.result3 = object.result3 ?? 0;
    message.result4 = object.result4 ?? 0;
    message.score = object.score ?? 0;
    message.order = object.order ?? 0;
    message.fightPower = object.fightPower ?? 0;
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

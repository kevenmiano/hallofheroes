// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: extrajob/ExtraJobEquipItemMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.extrajob";

export interface ExtraJobEquipItemMsg {
  equipType: number;
  equipLevel: number;
  strengthenLevel: number;
  join1: number;
  join2: number;
  join3: number;
  join4: number;
}

function createBaseExtraJobEquipItemMsg(): ExtraJobEquipItemMsg {
  return { equipType: 0, equipLevel: 0, strengthenLevel: 0, join1: 0, join2: 0, join3: 0, join4: 0 };
}

export const ExtraJobEquipItemMsg: MessageFns<ExtraJobEquipItemMsg> = {
  encode(message: ExtraJobEquipItemMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.equipType !== 0) {
      writer.uint32(8).int32(message.equipType);
    }
    if (message.equipLevel !== 0) {
      writer.uint32(16).int32(message.equipLevel);
    }
    if (message.strengthenLevel !== 0) {
      writer.uint32(24).int32(message.strengthenLevel);
    }
    if (message.join1 !== 0) {
      writer.uint32(32).int32(message.join1);
    }
    if (message.join2 !== 0) {
      writer.uint32(40).int32(message.join2);
    }
    if (message.join3 !== 0) {
      writer.uint32(48).int32(message.join3);
    }
    if (message.join4 !== 0) {
      writer.uint32(56).int32(message.join4);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ExtraJobEquipItemMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtraJobEquipItemMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.equipType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.equipLevel = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.strengthenLevel = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.join1 = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.join2 = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.join3 = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.join4 = reader.int32();
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

  fromJSON(object: any): ExtraJobEquipItemMsg {
    return {
      equipType: isSet(object.equipType) ? globalThis.Number(object.equipType) : 0,
      equipLevel: isSet(object.equipLevel) ? globalThis.Number(object.equipLevel) : 0,
      strengthenLevel: isSet(object.strengthenLevel) ? globalThis.Number(object.strengthenLevel) : 0,
      join1: isSet(object.join1) ? globalThis.Number(object.join1) : 0,
      join2: isSet(object.join2) ? globalThis.Number(object.join2) : 0,
      join3: isSet(object.join3) ? globalThis.Number(object.join3) : 0,
      join4: isSet(object.join4) ? globalThis.Number(object.join4) : 0,
    };
  },

  toJSON(message: ExtraJobEquipItemMsg): unknown {
    const obj: any = {};
    if (message.equipType !== 0) {
      obj.equipType = Math.round(message.equipType);
    }
    if (message.equipLevel !== 0) {
      obj.equipLevel = Math.round(message.equipLevel);
    }
    if (message.strengthenLevel !== 0) {
      obj.strengthenLevel = Math.round(message.strengthenLevel);
    }
    if (message.join1 !== 0) {
      obj.join1 = Math.round(message.join1);
    }
    if (message.join2 !== 0) {
      obj.join2 = Math.round(message.join2);
    }
    if (message.join3 !== 0) {
      obj.join3 = Math.round(message.join3);
    }
    if (message.join4 !== 0) {
      obj.join4 = Math.round(message.join4);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExtraJobEquipItemMsg>, I>>(base?: I): ExtraJobEquipItemMsg {
    return ExtraJobEquipItemMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExtraJobEquipItemMsg>, I>>(object: I): ExtraJobEquipItemMsg {
    const message = createBaseExtraJobEquipItemMsg();
    message.equipType = object.equipType ?? 0;
    message.equipLevel = object.equipLevel ?? 0;
    message.strengthenLevel = object.strengthenLevel ?? 0;
    message.join1 = object.join1 ?? 0;
    message.join2 = object.join2 ?? 0;
    message.join3 = object.join3 ?? 0;
    message.join4 = object.join4 ?? 0;
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

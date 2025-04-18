// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: consortia/ConsortiaTreasureBoxMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.consortia";

export interface ConsortiaTreasureBoxMsg {
  consortiaId: number;
  chairmanId: number;
  templateId: number;
  count: number;
  playerInfo: number[];
}

function createBaseConsortiaTreasureBoxMsg(): ConsortiaTreasureBoxMsg {
  return { consortiaId: 0, chairmanId: 0, templateId: 0, count: 0, playerInfo: [] };
}

export const ConsortiaTreasureBoxMsg: MessageFns<ConsortiaTreasureBoxMsg> = {
  encode(message: ConsortiaTreasureBoxMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.consortiaId !== 0) {
      writer.uint32(8).int32(message.consortiaId);
    }
    if (message.chairmanId !== 0) {
      writer.uint32(16).int32(message.chairmanId);
    }
    if (message.templateId !== 0) {
      writer.uint32(24).int32(message.templateId);
    }
    if (message.count !== 0) {
      writer.uint32(32).int32(message.count);
    }
    writer.uint32(42).fork();
    for (const v of message.playerInfo) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsortiaTreasureBoxMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsortiaTreasureBoxMsg();
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
          if (tag !== 16) {
            break;
          }

          message.chairmanId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
        case 5: {
          if (tag === 40) {
            message.playerInfo.push(reader.int32());

            continue;
          }

          if (tag === 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.playerInfo.push(reader.int32());
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

  fromJSON(object: any): ConsortiaTreasureBoxMsg {
    return {
      consortiaId: isSet(object.consortiaId) ? globalThis.Number(object.consortiaId) : 0,
      chairmanId: isSet(object.chairmanId) ? globalThis.Number(object.chairmanId) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      playerInfo: globalThis.Array.isArray(object?.playerInfo)
        ? object.playerInfo.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: ConsortiaTreasureBoxMsg): unknown {
    const obj: any = {};
    if (message.consortiaId !== 0) {
      obj.consortiaId = Math.round(message.consortiaId);
    }
    if (message.chairmanId !== 0) {
      obj.chairmanId = Math.round(message.chairmanId);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.playerInfo?.length) {
      obj.playerInfo = message.playerInfo.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsortiaTreasureBoxMsg>, I>>(base?: I): ConsortiaTreasureBoxMsg {
    return ConsortiaTreasureBoxMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsortiaTreasureBoxMsg>, I>>(object: I): ConsortiaTreasureBoxMsg {
    const message = createBaseConsortiaTreasureBoxMsg();
    message.consortiaId = object.consortiaId ?? 0;
    message.chairmanId = object.chairmanId ?? 0;
    message.templateId = object.templateId ?? 0;
    message.count = object.count ?? 0;
    message.playerInfo = object.playerInfo?.map((e) => e) || [];
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

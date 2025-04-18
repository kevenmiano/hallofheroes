// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: reward/RewardDetails.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.reward";

export interface RewardDetails {
  id: number;
  isValid: number;
  quality: number;
}

function createBaseRewardDetails(): RewardDetails {
  return { id: 0, isValid: 0, quality: 0 };
}

export const RewardDetails: MessageFns<RewardDetails> = {
  encode(message: RewardDetails, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.isValid !== 0) {
      writer.uint32(16).int32(message.isValid);
    }
    if (message.quality !== 0) {
      writer.uint32(24).int32(message.quality);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RewardDetails {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRewardDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.isValid = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.quality = reader.int32();
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

  fromJSON(object: any): RewardDetails {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      isValid: isSet(object.isValid) ? globalThis.Number(object.isValid) : 0,
      quality: isSet(object.quality) ? globalThis.Number(object.quality) : 0,
    };
  },

  toJSON(message: RewardDetails): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.isValid !== 0) {
      obj.isValid = Math.round(message.isValid);
    }
    if (message.quality !== 0) {
      obj.quality = Math.round(message.quality);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RewardDetails>, I>>(base?: I): RewardDetails {
    return RewardDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RewardDetails>, I>>(object: I): RewardDetails {
    const message = createBaseRewardDetails();
    message.id = object.id ?? 0;
    message.isValid = object.isValid ?? 0;
    message.quality = object.quality ?? 0;
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

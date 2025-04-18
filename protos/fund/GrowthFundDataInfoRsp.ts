// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: fund/GrowthFundDataInfoRsp.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.fund";

export interface GrowthFundDataInfoRsp {
  fundMsg: number[];
  isPay: number;
  recNum: number;
  isOpen: number;
}

function createBaseGrowthFundDataInfoRsp(): GrowthFundDataInfoRsp {
  return { fundMsg: [], isPay: 0, recNum: 0, isOpen: 0 };
}

export const GrowthFundDataInfoRsp: MessageFns<GrowthFundDataInfoRsp> = {
  encode(message: GrowthFundDataInfoRsp, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.fundMsg) {
      writer.int32(v);
    }
    writer.join();
    if (message.isPay !== 0) {
      writer.uint32(16).int32(message.isPay);
    }
    if (message.recNum !== 0) {
      writer.uint32(24).int32(message.recNum);
    }
    if (message.isOpen !== 0) {
      writer.uint32(32).int32(message.isOpen);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GrowthFundDataInfoRsp {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrowthFundDataInfoRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.fundMsg.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.fundMsg.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.isPay = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.recNum = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.isOpen = reader.int32();
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

  fromJSON(object: any): GrowthFundDataInfoRsp {
    return {
      fundMsg: globalThis.Array.isArray(object?.fundMsg) ? object.fundMsg.map((e: any) => globalThis.Number(e)) : [],
      isPay: isSet(object.isPay) ? globalThis.Number(object.isPay) : 0,
      recNum: isSet(object.recNum) ? globalThis.Number(object.recNum) : 0,
      isOpen: isSet(object.isOpen) ? globalThis.Number(object.isOpen) : 0,
    };
  },

  toJSON(message: GrowthFundDataInfoRsp): unknown {
    const obj: any = {};
    if (message.fundMsg?.length) {
      obj.fundMsg = message.fundMsg.map((e) => Math.round(e));
    }
    if (message.isPay !== 0) {
      obj.isPay = Math.round(message.isPay);
    }
    if (message.recNum !== 0) {
      obj.recNum = Math.round(message.recNum);
    }
    if (message.isOpen !== 0) {
      obj.isOpen = Math.round(message.isOpen);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GrowthFundDataInfoRsp>, I>>(base?: I): GrowthFundDataInfoRsp {
    return GrowthFundDataInfoRsp.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GrowthFundDataInfoRsp>, I>>(object: I): GrowthFundDataInfoRsp {
    const message = createBaseGrowthFundDataInfoRsp();
    message.fundMsg = object.fundMsg?.map((e) => e) || [];
    message.isPay = object.isPay ?? 0;
    message.recNum = object.recNum ?? 0;
    message.isOpen = object.isOpen ?? 0;
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

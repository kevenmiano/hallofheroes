// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/GradePacketRsp.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface GradePacketRsp {
  allPacket: number[];
  receiveSite: number;
  buySite: number;
}

function createBaseGradePacketRsp(): GradePacketRsp {
  return { allPacket: [], receiveSite: 0, buySite: 0 };
}

export const GradePacketRsp: MessageFns<GradePacketRsp> = {
  encode(message: GradePacketRsp, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.allPacket) {
      writer.int32(v);
    }
    writer.join();
    if (message.receiveSite !== 0) {
      writer.uint32(16).int32(message.receiveSite);
    }
    if (message.buySite !== 0) {
      writer.uint32(24).int32(message.buySite);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GradePacketRsp {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGradePacketRsp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.allPacket.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allPacket.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.receiveSite = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.buySite = reader.int32();
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

  fromJSON(object: any): GradePacketRsp {
    return {
      allPacket: globalThis.Array.isArray(object?.allPacket)
        ? object.allPacket.map((e: any) => globalThis.Number(e))
        : [],
      receiveSite: isSet(object.receiveSite) ? globalThis.Number(object.receiveSite) : 0,
      buySite: isSet(object.buySite) ? globalThis.Number(object.buySite) : 0,
    };
  },

  toJSON(message: GradePacketRsp): unknown {
    const obj: any = {};
    if (message.allPacket?.length) {
      obj.allPacket = message.allPacket.map((e) => Math.round(e));
    }
    if (message.receiveSite !== 0) {
      obj.receiveSite = Math.round(message.receiveSite);
    }
    if (message.buySite !== 0) {
      obj.buySite = Math.round(message.buySite);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GradePacketRsp>, I>>(base?: I): GradePacketRsp {
    return GradePacketRsp.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GradePacketRsp>, I>>(object: I): GradePacketRsp {
    const message = createBaseGradePacketRsp();
    message.allPacket = object.allPacket?.map((e) => e) || [];
    message.receiveSite = object.receiveSite ?? 0;
    message.buySite = object.buySite ?? 0;
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

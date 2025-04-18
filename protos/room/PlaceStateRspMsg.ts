// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: room/PlaceStateRspMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.room";

export interface PlaceStateRspMsg {
  placeState: number[];
}

function createBasePlaceStateRspMsg(): PlaceStateRspMsg {
  return { placeState: [] };
}

export const PlaceStateRspMsg: MessageFns<PlaceStateRspMsg> = {
  encode(message: PlaceStateRspMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.placeState) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlaceStateRspMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlaceStateRspMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.placeState.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.placeState.push(reader.int32());
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

  fromJSON(object: any): PlaceStateRspMsg {
    return {
      placeState: globalThis.Array.isArray(object?.placeState)
        ? object.placeState.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: PlaceStateRspMsg): unknown {
    const obj: any = {};
    if (message.placeState?.length) {
      obj.placeState = message.placeState.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlaceStateRspMsg>, I>>(base?: I): PlaceStateRspMsg {
    return PlaceStateRspMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlaceStateRspMsg>, I>>(object: I): PlaceStateRspMsg {
    const message = createBasePlaceStateRspMsg();
    message.placeState = object.placeState?.map((e) => e) || [];
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

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

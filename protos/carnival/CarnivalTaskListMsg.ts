// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: carnival/CarnivalTaskListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.carnival";

export interface CarnivalTaskListMsg {
  tasks: number[];
}

function createBaseCarnivalTaskListMsg(): CarnivalTaskListMsg {
  return { tasks: [] };
}

export const CarnivalTaskListMsg: MessageFns<CarnivalTaskListMsg> = {
  encode(message: CarnivalTaskListMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.tasks) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CarnivalTaskListMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCarnivalTaskListMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.tasks.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.tasks.push(reader.int32());
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

  fromJSON(object: any): CarnivalTaskListMsg {
    return { tasks: globalThis.Array.isArray(object?.tasks) ? object.tasks.map((e: any) => globalThis.Number(e)) : [] };
  },

  toJSON(message: CarnivalTaskListMsg): unknown {
    const obj: any = {};
    if (message.tasks?.length) {
      obj.tasks = message.tasks.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CarnivalTaskListMsg>, I>>(base?: I): CarnivalTaskListMsg {
    return CarnivalTaskListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CarnivalTaskListMsg>, I>>(object: I): CarnivalTaskListMsg {
    const message = createBaseCarnivalTaskListMsg();
    message.tasks = object.tasks?.map((e) => e) || [];
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

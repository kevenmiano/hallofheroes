// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: stackhead/StackHeadGuildUserListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.stackhead";

export interface StackHeadGuildUserListMsg {
  op: number;
  userList: number[];
  seniorGeneralUser: number[];
}

function createBaseStackHeadGuildUserListMsg(): StackHeadGuildUserListMsg {
  return { op: 0, userList: [], seniorGeneralUser: [] };
}

export const StackHeadGuildUserListMsg: MessageFns<StackHeadGuildUserListMsg> = {
  encode(message: StackHeadGuildUserListMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    writer.uint32(18).fork();
    for (const v of message.userList) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(26).fork();
    for (const v of message.seniorGeneralUser) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StackHeadGuildUserListMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStackHeadGuildUserListMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.op = reader.int32();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.userList.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.userList.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag === 24) {
            message.seniorGeneralUser.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.seniorGeneralUser.push(reader.int32());
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

  fromJSON(object: any): StackHeadGuildUserListMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      userList: globalThis.Array.isArray(object?.userList) ? object.userList.map((e: any) => globalThis.Number(e)) : [],
      seniorGeneralUser: globalThis.Array.isArray(object?.seniorGeneralUser)
        ? object.seniorGeneralUser.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: StackHeadGuildUserListMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.userList?.length) {
      obj.userList = message.userList.map((e) => Math.round(e));
    }
    if (message.seniorGeneralUser?.length) {
      obj.seniorGeneralUser = message.seniorGeneralUser.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StackHeadGuildUserListMsg>, I>>(base?: I): StackHeadGuildUserListMsg {
    return StackHeadGuildUserListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StackHeadGuildUserListMsg>, I>>(object: I): StackHeadGuildUserListMsg {
    const message = createBaseStackHeadGuildUserListMsg();
    message.op = object.op ?? 0;
    message.userList = object.userList?.map((e) => e) || [];
    message.seniorGeneralUser = object.seniorGeneralUser?.map((e) => e) || [];
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

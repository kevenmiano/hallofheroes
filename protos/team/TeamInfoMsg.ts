// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: team/TeamInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.team";

export interface TeamInfoMsg {
  teamId: number;
  memberId: number[];
  captainId: number;
  memberDetail: number[];
}

function createBaseTeamInfoMsg(): TeamInfoMsg {
  return { teamId: 0, memberId: [], captainId: 0, memberDetail: [] };
}

export const TeamInfoMsg: MessageFns<TeamInfoMsg> = {
  encode(message: TeamInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.teamId !== 0) {
      writer.uint32(8).int32(message.teamId);
    }
    writer.uint32(18).fork();
    for (const v of message.memberId) {
      writer.int32(v);
    }
    writer.join();
    if (message.captainId !== 0) {
      writer.uint32(24).int32(message.captainId);
    }
    writer.uint32(34).fork();
    for (const v of message.memberDetail) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TeamInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTeamInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.teamId = reader.int32();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.memberId.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.memberId.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.captainId = reader.int32();
          continue;
        }
        case 4: {
          if (tag === 32) {
            message.memberDetail.push(reader.int32());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.memberDetail.push(reader.int32());
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

  fromJSON(object: any): TeamInfoMsg {
    return {
      teamId: isSet(object.teamId) ? globalThis.Number(object.teamId) : 0,
      memberId: globalThis.Array.isArray(object?.memberId) ? object.memberId.map((e: any) => globalThis.Number(e)) : [],
      captainId: isSet(object.captainId) ? globalThis.Number(object.captainId) : 0,
      memberDetail: globalThis.Array.isArray(object?.memberDetail)
        ? object.memberDetail.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: TeamInfoMsg): unknown {
    const obj: any = {};
    if (message.teamId !== 0) {
      obj.teamId = Math.round(message.teamId);
    }
    if (message.memberId?.length) {
      obj.memberId = message.memberId.map((e) => Math.round(e));
    }
    if (message.captainId !== 0) {
      obj.captainId = Math.round(message.captainId);
    }
    if (message.memberDetail?.length) {
      obj.memberDetail = message.memberDetail.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TeamInfoMsg>, I>>(base?: I): TeamInfoMsg {
    return TeamInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TeamInfoMsg>, I>>(object: I): TeamInfoMsg {
    const message = createBaseTeamInfoMsg();
    message.teamId = object.teamId ?? 0;
    message.memberId = object.memberId?.map((e) => e) || [];
    message.captainId = object.captainId ?? 0;
    message.memberDetail = object.memberDetail?.map((e) => e) || [];
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

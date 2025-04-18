// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: stackhead/StackHeadGuildUserMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.stackhead";

export interface StackHeadGuildUserMsg {
  userUid: string;
  nickName: string;
  defenceAlive: boolean;
  defenceDebuffLevel: number;
  fightCapacity: number;
  grade: number;
  transGrade: number;
  changeBranch: number;
  job: number;
  userid: number;
}

function createBaseStackHeadGuildUserMsg(): StackHeadGuildUserMsg {
  return {
    userUid: "",
    nickName: "",
    defenceAlive: false,
    defenceDebuffLevel: 0,
    fightCapacity: 0,
    grade: 0,
    transGrade: 0,
    changeBranch: 0,
    job: 0,
    userid: 0,
  };
}

export const StackHeadGuildUserMsg: MessageFns<StackHeadGuildUserMsg> = {
  encode(message: StackHeadGuildUserMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userUid !== "") {
      writer.uint32(10).string(message.userUid);
    }
    if (message.nickName !== "") {
      writer.uint32(18).string(message.nickName);
    }
    if (message.defenceAlive !== false) {
      writer.uint32(24).bool(message.defenceAlive);
    }
    if (message.defenceDebuffLevel !== 0) {
      writer.uint32(32).int32(message.defenceDebuffLevel);
    }
    if (message.fightCapacity !== 0) {
      writer.uint32(40).int32(message.fightCapacity);
    }
    if (message.grade !== 0) {
      writer.uint32(48).int32(message.grade);
    }
    if (message.transGrade !== 0) {
      writer.uint32(56).int32(message.transGrade);
    }
    if (message.changeBranch !== 0) {
      writer.uint32(64).int32(message.changeBranch);
    }
    if (message.job !== 0) {
      writer.uint32(72).int32(message.job);
    }
    if (message.userid !== 0) {
      writer.uint32(80).int32(message.userid);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StackHeadGuildUserMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStackHeadGuildUserMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userUid = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.defenceAlive = reader.bool();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.defenceDebuffLevel = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.fightCapacity = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.transGrade = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.changeBranch = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.job = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.userid = reader.int32();
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

  fromJSON(object: any): StackHeadGuildUserMsg {
    return {
      userUid: isSet(object.userUid) ? globalThis.String(object.userUid) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      defenceAlive: isSet(object.defenceAlive) ? globalThis.Boolean(object.defenceAlive) : false,
      defenceDebuffLevel: isSet(object.defenceDebuffLevel) ? globalThis.Number(object.defenceDebuffLevel) : 0,
      fightCapacity: isSet(object.fightCapacity) ? globalThis.Number(object.fightCapacity) : 0,
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      transGrade: isSet(object.transGrade) ? globalThis.Number(object.transGrade) : 0,
      changeBranch: isSet(object.changeBranch) ? globalThis.Number(object.changeBranch) : 0,
      job: isSet(object.job) ? globalThis.Number(object.job) : 0,
      userid: isSet(object.userid) ? globalThis.Number(object.userid) : 0,
    };
  },

  toJSON(message: StackHeadGuildUserMsg): unknown {
    const obj: any = {};
    if (message.userUid !== "") {
      obj.userUid = message.userUid;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.defenceAlive !== false) {
      obj.defenceAlive = message.defenceAlive;
    }
    if (message.defenceDebuffLevel !== 0) {
      obj.defenceDebuffLevel = Math.round(message.defenceDebuffLevel);
    }
    if (message.fightCapacity !== 0) {
      obj.fightCapacity = Math.round(message.fightCapacity);
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.transGrade !== 0) {
      obj.transGrade = Math.round(message.transGrade);
    }
    if (message.changeBranch !== 0) {
      obj.changeBranch = Math.round(message.changeBranch);
    }
    if (message.job !== 0) {
      obj.job = Math.round(message.job);
    }
    if (message.userid !== 0) {
      obj.userid = Math.round(message.userid);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StackHeadGuildUserMsg>, I>>(base?: I): StackHeadGuildUserMsg {
    return StackHeadGuildUserMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StackHeadGuildUserMsg>, I>>(object: I): StackHeadGuildUserMsg {
    const message = createBaseStackHeadGuildUserMsg();
    message.userUid = object.userUid ?? "";
    message.nickName = object.nickName ?? "";
    message.defenceAlive = object.defenceAlive ?? false;
    message.defenceDebuffLevel = object.defenceDebuffLevel ?? 0;
    message.fightCapacity = object.fightCapacity ?? 0;
    message.grade = object.grade ?? 0;
    message.transGrade = object.transGrade ?? 0;
    message.changeBranch = object.changeBranch ?? 0;
    message.job = object.job ?? 0;
    message.userid = object.userid ?? 0;
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

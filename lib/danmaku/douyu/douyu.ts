import { LiveDanmaku } from "../../types/danmaku";
import { LiveMessage, LiveMessageColor, LiveMessageType } from "./livemessage";
import { BinaryReader, BinaryWriter } from "./binaryWriter";
import { WebSocketUtils } from '@/lib/danmaku/douyu/webScoket'
enum Endian {
  big,
  little,
}
export default class DouYuDanmaku {
  heartbeatTime = 45 * 1000;
  serverUrl = 'wss://danmuproxy.douyu.com:8503';
  WebScoketUtils: WebSocketUtils | undefined
  onClose?: (msg: string) => {}
  onReady?: Function
  onMessage?: (liveMsg: LiveMessage) => void
  start = (args: any) => {
    this.WebScoketUtils = new WebSocketUtils({
      url: this.serverUrl,
      heartBeatTime: this.heartbeatTime,
      onMessage: (e: number[]) => {
        this.decodeMessage(e);
      },

      onReady: () => {
        this.joinRoom(args);
      },
      onHeartBeat: () => {
        this.heartbeat();
      },
      onReconnect: () => {
        this.onClose?.call(this, ('11111'));
      },
      onClose: (e) => {
        this.onClose?.call(this, "服务器连接失败$e");
      },
    })
    this.WebScoketUtils.connect()
  }
  joinRoom = (roomId: string) => {
    let msg_one = this.serializeDouyu(`type@=loginreq/roomid@=${roomId}/`)
    let msg_two = this.serializeDouyu(`type@=joingroup/rid@=${roomId}/gid@=-9999/`)
    this.WebScoketUtils?.sendMessage(msg_one)
    this.WebScoketUtils?.sendMessage(msg_two)
  }
  heartbeat = () => {
    let data = this.serializeDouyu("type@=mrkl/");
    this.WebScoketUtils?.sendMessage(data)
  }

  stop() {
    this.WebScoketUtils!.onMessage = undefined;
    this.onClose = undefined;
    if (this.WebScoketUtils) {
      this.WebScoketUtils.close();
    }
  }

  decodeMessage = (data: number[]) => {
    try {
      const result = this.deserializeDouyu(data);
      if (result === null) {
        return;
      }
      const jsonData = this.sttToJObject(result);
      const type = jsonData['type'];
      if (type === 'chatmsg') {
        const col = parseInt(jsonData['col']) || 0;
        const liveMsg = new LiveMessage({
          type: LiveMessageType.chat,
          userName: jsonData['nn'],
          message: jsonData['txt'],
          color: this.getColor(col),
        });

        this.onMessage?.(liveMsg);
      }
    } catch (e) {
      console.error(e);
    }
  }
  serializeDouyu = (body: string) => {
    try {
      const clientSendToServer = 689;
      const encrypted = 0;
      const reserved = 0;
      const buffer = new TextEncoder().encode(body);
      const writer = new BinaryWriter([]);
      writer.writeInt(4 + 4 + body.length + 1, 4, Endian.little);
      writer.writeInt(4 + 4 + body.length + 1, 4, Endian.little);
      writer.writeInt(clientSendToServer, 2, Endian.little);
      writer.writeInt(encrypted, 1, Endian.little);
      writer.writeInt(reserved, 1, Endian.little);
      writer.writeBytes(Array.from(buffer));
      writer.writeInt(0, 1, Endian.little);
      return new Uint8Array(writer.buffer);
    } catch (error) {
      console.log(error);
    }

  }
  deserializeDouyu = (buffer: number[]): string | null => {
    try {
      const reader = new BinaryReader(new Uint8Array(buffer));
      let fullMsgLength = reader.readInt32(Endian.little); //fullMsgLength
      reader.readInt32(Endian.little); //fullMsgLength2
      reader.readShort(Endian.little); //packType
      reader.readByte(Endian.little); //encrypted
      reader.readByte(Endian.little); //reserved
      let bodyLength = fullMsgLength - 9;
      let bytes = reader.readBytes(bodyLength);
      reader.readByte(Endian.little);
      return new TextDecoder().decode(bytes);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  sttToJObject = (str: string): any => {
    if (str.includes("//")) {
      let result = [];
      for (let field of str.split("//")) {
        if (field === "") {
          continue;
        }
        result.push(this.sttToJObject(field));
      }
      return result;
    }
    if (str.includes("@=")) {
      const result: any = {};
      for (const field of str.split("/")) {
        if (field.length === 0) {
          continue;
        }
        const tokens = field.split("@=");
        const k = tokens[0];
        const v = this.unscapeSlashAt(tokens[1]);
        result[k] = this.sttToJObject(v);
      }
      return result;
    } else if (str.includes("@A=")) {
      return this.sttToJObject(this.unscapeSlashAt(str));
    } else {
      return this.unscapeSlashAt(str);
    }
  }
  unscapeSlashAt = (str: string): string => {
    return str.replace(/@S/g, "/").replace(/@A/g, "@");
  }
  getColor = (type?: number) => {
    switch (type) {
      case 1:
        return new LiveMessageColor(255, 0, 0);
      case 2:
        return new LiveMessageColor(30, 135, 240);
      case 3:
        return new LiveMessageColor(122, 200, 75);
      case 4:
        return new LiveMessageColor(255, 127, 0);
      case 5:
        return new LiveMessageColor(155, 57, 244);
      case 6:
        return new LiveMessageColor(255, 105, 180);
      default:
        return LiveMessageColor.white;
    }
  }
}

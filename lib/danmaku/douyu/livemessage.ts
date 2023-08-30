enum LiveMessageType {
  /// 聊天
  chat,

  /// 礼物,暂时不支持
  gift,

  /// 在线人数
  online,

  /// 醒目留言
  superChat,
}

class LiveMessage {
  /// 消息类型
  type: LiveMessageType;

  /// 用户名
  userName: string;

  /// 信息
  message: string;

  /// 数据
  /// 单Type=Online时，Data为人气值(long)
  data: any;

  /// 弹幕颜色
  color: LiveMessageColor;

  constructor({
    type,
    userName,
    message,
    data,
    color,
  }: {
    type: LiveMessageType;
    userName: string;
    message: string;
    data?: any;
    color: LiveMessageColor;
  }) {
    this.type = type;
    this.userName = userName;
    this.message = message;
    this.data = data;
    this.color = color;
  }

  toString(): string {
    return JSON.stringify({
      type: this.type.valueOf(),
      userName: this.userName,
      message: this.message,
      data: this.data?.toString(),
      color: this.color.toString(),
    });
  }
}

class LiveMessageColor {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static get white(): LiveMessageColor {
    return new LiveMessageColor(255, 255, 255);
  }

  static numberToColor(intColor: number): LiveMessageColor {
    let obj = intColor.toString(16);

    let color = LiveMessageColor.white;
    if (obj.length == 4) {
      obj = "00" + obj;
    }
    if (obj.length == 6) {
      let R = parseInt(obj.substring(0, 2), 16);
      let G = parseInt(obj.substring(2, 4), 16);
      let B = parseInt(obj.substring(4, 6), 16);

      color = new LiveMessageColor(R, G, B);
    }
    if (obj.length == 8) {
      let R = parseInt(obj.substring(2, 4), 16);
      let G = parseInt(obj.substring(4, 6), 16);
      let B = parseInt(obj.substring(6, 8), 16);
      //let A = parseInt(obj.substring(0,2),16);
      color = new LiveMessageColor(R, G, B);
    }

    return color;
  }

  toString(): string {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0")
    );
  }
}


// class LiveSuperChatMessage {
//   readonly userName: string;
//   readonly face: string;
//   readonly message: string;
//   readonly price: number;
//   readonly startTime: Date;
//   readonly endTime: Date;
//   readonly backgroundColor: string;
//   readonly backgroundBottomColor: string;

//   constructor(
//     public readonly backgroundBottomColor: string,
//     public readonly backgroundColor: string,
//     public readonly endTime: Date,
//     public readonly face: string,
//     public readonly message: string,
//     public readonly price: number,
//     public readonly startTime: Date,
//     public readonly userName: string,
//   ) { }

//   toString(): string {
//     return JSON.stringify({
//       userName: this.userName,
//       face: this.face,
//       message: this.message,
//       price: this.price,
//       startTime: this.startTime,
//       endTime: this.endTime,
//       backgroundColor: this.backgroundColor,
//       backgroundBottomColor: this.backgroundBottomColor,
//     });
//   }
// }

export { LiveMessageType, LiveMessage, LiveMessageColor }
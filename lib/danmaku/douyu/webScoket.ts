enum SocketStatus {
  connected,
  failed,
  closed,
}
type MessageEventListener = (message: any) => void;
type CloseEventListener = (msg: string) => void;

interface WebSocketUtilsConfig {
  url: string;
  backupUrl?: string;
  heartBeatTime: number;
  onMessage?: MessageEventListener;
  onClose?: CloseEventListener;
  onReconnect?: () => void;
  onReady?: () => void;
  onHeartBeat?: () => void;
  headers?: { [key: string]: any };
}

export class WebSocketUtils {
  status = SocketStatus.closed;
  url: string;
  backupUrl?: string;
  heartBeatTime: number;
  onMessage?: MessageEventListener;
  onClose?: CloseEventListener;
  onReconnect?: () => void;
  onReady?: () => void;
  onHeartBeat?: () => void;

  headers?: { [key: string]: any };
  webSocket?: WebSocket;
  heartBeatTimer?: NodeJS.Timer;

  reconnectTime = 0;
  reconnectTimer?: NodeJS.Timer;
  maxReconnectTime = 5;
  streamSubscription?: any;
  constructor(config: WebSocketUtilsConfig) {
    this.url = config.url;
    this.backupUrl = config.backupUrl;
    this.heartBeatTime = config.heartBeatTime;
    this.onMessage = config.onMessage;
    this.onClose = config.onClose;
    this.onReconnect = config.onReconnect;
    this.onReady = config.onReady;
    this.onHeartBeat = config.onHeartBeat;
    this.headers = config.headers;
  }
  connect({ retry = false }: { retry?: boolean } = {}): void {
    this.close();
    try {
      let wsurl = this.url;
      if (this.backupUrl && this.backupUrl.length && retry) {
        wsurl = this.backupUrl;
      }
      this.webSocket = new WebSocket(wsurl);
      this.webSocket.onopen = () => this.ready();

      this.webSocket.onerror = (event) => this.onError(event);
    } catch (e) {
      if (!retry) {
        this.connect({ retry: true });
        return;
      }
      this.onError(e);
    }
  }

  ready(): void {
    this.status = SocketStatus.connected;
    if (this.webSocket) {
      this.webSocket.onmessage = async (event) => {
        const data = await this.decode(event.data)
        this.receiveMessage(data);
      };
      this.webSocket.onclose = () => {
        this.onDone();
      };
    }

    if (this.onReady) {
      this.onReady();
    }

    this.initHeartBeat();
  }

  initHeartBeat(): void {
    this.onHeartBeat!();

    this.heartBeatTimer = setInterval(() => {
      if (this.onHeartBeat) {
        this.onHeartBeat();
      }
    }, this.heartBeatTime);
  }

  receiveMessage(data: any): void {
    this.reconnectTime = 0;
    if (this.onMessage) {
      this.onMessage(data);
    }
  }

  onError(error: any): void {
    console.error(error);
    this.status = SocketStatus.failed;
    if (this.onClose) {
      this.onClose(error.toString());
    }
  }

  onDone(): void {

    if (this.status === SocketStatus.closed) {
      return;
    }

    if (this.onReconnect) {
      this.onReconnect();
    }
    this.reconnect();
  }

  sendMessage(message: any): void {
    if (this.status === SocketStatus.connected) {
      this.webSocket?.send(message);
    }
  }

  close(): void {
    this.status = SocketStatus.closed;
    if (this.streamSubscription) {
      this.streamSubscription.cancel();
      this.streamSubscription = undefined;
    }

    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = undefined;
    }

    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }
  }

  reconnect(): void {
    this.status = SocketStatus.closed;
    if (this.reconnectTime < this.maxReconnectTime) {
      this.reconnectTime++;
      this.reconnectTimer = setInterval(() => {
        this.connect();
      }, 5000);
    } else {
      if (this.onClose) {
        this.onClose("重连超过最大次数，与服务器断开连接");
      }
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = undefined;
      }
      this.close();
      return;
    }
  }

  // 解析blob数据
  decode(blob: Blob) {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.onload = function (e: any) {
        let buffer = new Uint8Array(e.target.result)
        resolve(buffer);
      }
      reader.readAsArrayBuffer(blob);
    });
  }
}
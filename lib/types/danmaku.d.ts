import { LiveMessage } from './live_message';

interface LiveDanmaku {
  onMessage?: (msg: LiveMessage) => void;
  // onClose?: (event: any) => void;
  onReady?: () => void;
  // 心跳时间
  heartbeatTime: number;
  // 发生心跳
  heartbeat: () => void

  // 开始接收信息
  start()

  // 停止接收信息
  stop(): Promise<void>
}
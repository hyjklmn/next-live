import { DouYuLiveRoom } from "./types/apis";

export function liveResult(hasMore: boolean, roomItems: DouYuLiveRoom) {
  return { hasMore, roomItems }
}
import { DouYuAnchorInfo, DouYuLiveRoom, DouYuSearchAnchorResult } from "./types/apis";

export function liveResult(hasMore: boolean, roomItems: DouYuLiveRoom) {
  return { hasMore, roomItems }
}
export function LiveSearchAnchorResult(hasMore: boolean, anchorItems: DouYuSearchAnchorResult) {
  return { hasMore, anchorItems }
}
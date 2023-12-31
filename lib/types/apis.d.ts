type LiveCategory = {
  id: string
  name: string
  children: LiveSubCategory[]
}[]
type LiveSubCategory = {
  pic: string
  id: strin | number
  parentId: string
  name: string
}

type DouYuLiveRoom = {
  cover: string,
  online: string | number,
  roomId: string,
  title: string,
  userName: string,
  avatar?: string
}[]

interface LiveRoomDetail {
  roomId: string
  title: string
  userName: string
  userAvatar: string
  cover: string
  online: string
  introduction: string
  notice: string
  status: string
  danmakuData: any
  data: any
  url: string
}

type DouYuListResult = { ct: any, rl: any, pgcnt: any }
type DouYuSearchRoomResult = {
  pageSize: number,
  online: DouYuLiveRoom,
  total: number,
}

interface DouYuAnchorInfo {
  anchorInfo: {
    rid: string; avatar: string; nickName: string; isLive: string;
  }
}
type DouYuSearchAnchorResult = {
  roomId: string
  avatar: string
  userName: string
  liveStatus: string //1直播,2没直播
}[]


interface LiveResult {
  hasMore: boolean
  roomItems: DouYuLiveRoom
}

interface AnchorResult {
  hasMore: boolean
  anchorItems: DouYuSearchAnchorResult
}
export { LiveCategory, LiveSubCategory, DouYuLiveRoom, DouYuListResult, LiveRoomDetail, DouYuSearchRoomResult, DouYuSearchAnchorResult, DouYuAnchorInfo, LiveResult, AnchorResult }
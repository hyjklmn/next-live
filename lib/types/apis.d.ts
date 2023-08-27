type DouYuLiveCategory = {
  id: string
  name: string
  children: Array[]
}[]
type DouYuSubCategory = {
  pic: string
  id: string
  parentId: string
  name: string
}

type DouYuLiveRoom = {
  cover: string,
  online: string,
  roomId: string,
  title: string,
  userName: string,
}[]



interface DouYuLiveRoomDetail {
  roomId: string
  title: string
  userName: string
  userAvatar: string
  cover: string
  online: string
  introduction: string
  notice: string
  status: string
  danmakuData: string
  data: string
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
interface DouYuSearchAnchorResult {
  roomId: string
  avatar: string
  userName: string
  liveStatus: string //1直播,2没直播
}
export { DouYuLiveCategory, DouYuSubCategory, DouYuLiveRoom, DouYuListResult, DouYuLiveRoomDetail, DouYuSearchRoomResult, DouYuSearchAnchorResult, DouYuAnchorInfo }
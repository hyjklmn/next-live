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
  cover: string
  online: string
  roomId: string
  title: string
  userName: string
  userAvatar: string
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
export { DouYuLiveCategory, DouYuSubCategory, DouYuLiveRoom, DouYuListResult, DouYuLiveRoomDetail, DouYuSearchRoomResult }
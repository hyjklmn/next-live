type DouYuLiveCategory = {
  id: string
  name: string
  children: Array[]
}[]
type DouYuSubCategory = { pic: string; id: string; parentId: string | number; name: string; }[]
type DouYuLiveRoom = {
  cover: string,
  online: string,
  roomId: string,
  title: string,
  userName: string,
}[]
export { DouYuLiveCategory, DouYuSubCategory, DouYuLiveRoom }
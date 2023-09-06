import { liveResult } from "../LiveResult";
import { DouYuLiveRoom } from "../types/apis";
async function getRecommendRooms(page = 1) {
  const result = await fetch(`/hy?m=LiveList&do=getLiveListByPage&tagAll=0&page=${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await result.json()

  const roomItems: DouYuLiveRoom = [];
  data.data.datas.forEach((item: { screenshot: string; introduction: string; roomName: string; profileRoom: string; nick: string; totalCount: string; }) => {
    let cover = item.screenshot
    // if (cover.indexOf('?') === -1) {
    //   cover += "?x-oss-process=style/w338_h190&"
    // }
    let title = item.introduction
    if (title === '') {
      title = item.roomName;
    }
    roomItems.push({
      roomId: item.profileRoom,
      title: title,
      cover: cover,
      userName: item.nick,
      online: item.totalCount,
    })
  })
  const hasMore = data.data.page < data.data.totalPage
  return liveResult(hasMore, roomItems)
}

export { getRecommendRooms }
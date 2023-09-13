import { liveResult } from "../LiveResult";
import { LiveCategory, DouYuLiveRoom, LiveSubCategory } from "../types/apis";

type Data = {
  data: any[];
  msg: string;
  status: number;
  type: number;
  updateTime: number;
};
async function getHyRecommendRooms(page = 1) {
  const result = await fetch(`/hy?m=LiveList&do=getLiveListByPage&tagAll=0&page=${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await result.json()

  const roomItems: DouYuLiveRoom = [];
  data.data.datas.forEach((item: {
    avatar180: string; screenshot: string; introduction: string; roomName: string; profileRoom: string; nick: string; totalCount: string;
  }) => {
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
      avatar: item.avatar180
    })
  })
  const hasMore = data.data.page < data.data.totalPage
  return liveResult(hasMore, roomItems)
}

function getHyCategores(): LiveCategory {

  const LiveCategory: LiveCategory = [
    { id: "1", name: "网游", children: [] },
    { id: "2", name: "单机", children: [] },
    { id: "3", name: "手游", children: [] },
    { id: "8", name: "娱乐", children: [] },
  ];
  // LiveCategory.forEach(async live => {
  //   const item = await getSubCategories(live.id)
  //   live.children = live.children.concat(item)
  // })
  return LiveCategory
}

async function getHySubCategories(id: string) {

  const result = await fetch(`/lhy/liveconfig/game/bussLive?bussType=${id}`)
  if (!result.ok) {
    throw new Error(result.statusText);
  }

  let sub: LiveSubCategory[] = []
  const data: Data = await result.json()
  data.data.forEach(item => {
    const gid = item["gid"]
    sub.push({
      pic: `https://huyaimg.msstatic.com/cdnimage/game/${gid}-MS.jpg`,
      id: gid,
      parentId: id,
      name: item["gameFullName"],
    })
  })
  return sub
}


export { getHyRecommendRooms, getHyCategores, getHySubCategories }
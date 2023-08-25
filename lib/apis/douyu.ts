import { DouYuLiveCategory, DouYuLiveRoom, DouYuSubCategory } from "../types/apis";

function getCategores() {
  const LiveCategory: DouYuLiveCategory = [
    { id: "PCgame", name: "网游竞技", children: [] },
    { id: "djry", name: "单机热游", children: [] },
    { id: "syxx", name: "手游休闲", children: [] },
    { id: "yl", name: "娱乐天地", children: [] },
    { id: "yz", name: "颜值", children: [] },
    { id: "kjwh", name: "科技文化", children: [] },
    { id: "yp", name: "语言互动", children: [] },
  ];
  LiveCategory.forEach(async live => {
    const item = await getSubCategories(live.id)
    live.children = live.children.concat(item)
  })
  return LiveCategory
}

async function getSubCategories(id: string) {
  const result = await fetch(`/dyu/japi/weblist/api/getC2List?shortName=${id}&offset=0&limit=200`)
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  const sub: DouYuSubCategory = []
  const data: { data: { total: number, list: [] }, error: number, message: string } = await result.json()
  data.data.list.forEach(item => {
    sub.push({
      pic: item["squareIconUrlW"],
      id: item["cid2"],
      parentId: id,
      name: item["cname2"],
    })
  })
  return sub
}

async function getCategoryRooms(category: DouYuSubCategory, page?: number,) {
  const result = await fetch(`/dyu/gapi/rkc/directory/mixList/2_1/page=${page}`,)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data }: { data: { ct: any, rl: any, pgcnt: any } } = await result.json()
  let item: any

  data.rl = data.rl.filter((l: { type: number; }) => {
    return l.type == 1
  })
  const roomItem: DouYuLiveRoom = []
  data.rl.forEach((l: { [x: string]: any; }) => {
    roomItem.push({
      cover: l['rs16'],
      online: l['ol'],
      roomId: l['rid'],
      title: l['rn'],
      userName: l['nn'],
    })
  });
  return roomItem
}

export { getSubCategories, getCategores, getCategoryRooms }
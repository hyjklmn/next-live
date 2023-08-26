import { DouYuLiveCategory, DouYuLiveRoom, DouYuSubCategory, DouYuListResult, DouYuSearchRoomResult } from "../types/apis";
import { liveResult } from "../LiveResult";

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
  let sub: DouYuSubCategory[] = []
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

async function getCategoryRooms(subCategory: DouYuSubCategory, page = 1) {
  const result = await fetch(`/dyu/gapi/rkc/directory/mixList/2_${subCategory.id}/page=${page}`,)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data }: { data: DouYuListResult } = await result.json()
  data.rl = data.rl.filter((l: { type: number; }) => {
    return l.type == 1
  })
  const roomItems = joinRooms(data)
  const hasMore = page < data.pgcnt
  return liveResult(hasMore, roomItems)
}

async function getRecommendRooms(page = 1) {
  var result = await fetch(`/dyu/japi/weblist/apinc/allpage/6/${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data }: { data: DouYuListResult } = await result.json()
  const roomItems = joinRooms(data)
  let hasMore = page < data.pgcnt
  generateRandomHexString(32)
  return liveResult(hasMore, roomItems)
}

async function searchRooms(keyword: string, page = 1) {
  const did = generateRandomHexString(32)
  const result = await fetch(`/dyu/japi/search/api/searchShow?kw=${keyword}&page=${page}&pageSize=20`, {})


  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await result.json()
  if (data.error !== 0) {
    console.log(data.msg);
    return
  }
}

function joinRooms(list: DouYuListResult) {
  list.rl = list.rl.filter((l: { type: number; }) => {
    return l.type == 1
  })
  const roomItem: DouYuLiveRoom = []
  list.rl.forEach((l: { [x: string]: any; }) => {
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

function generateRandomHexString(length: number) {
  const hexCharacters = "0123456789abcdef";
  const randomHexArray = Array(length).fill("");
  for (let i = 0; i < length; i++) {
    randomHexArray[i] = hexCharacters[Math.floor(Math.random() * 16)];
  }
  return randomHexArray.join("");
}


export { getCategores, getSubCategories, getCategoryRooms, getRecommendRooms, searchRooms }
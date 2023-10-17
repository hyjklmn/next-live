import { liveResult } from "../LiveResult";
import { DouYuLiveRoom, LiveCategory, LiveSubCategory } from "../types/apis";

const headers: { [key: string]: string } = {
  "Authority": "live.douyin.com",
  "credentials": 'include',
  "withCredentials": "true",
  "Referer": "https://live.douyin.com",
};

async function getRequestHeaders() {
  try {
    if (headers.hasOwnProperty('cookie')) headers
  } catch (error) {

  }
}
async function getDyinCategores() {
  const result = await fetch('/dyin/hot_live')
  const data = await result.text()
  // chat-gpt
  const regexPattern: RegExp = /\{\\"pathname\\":\\"\/hot_live\\",\\"categoryData.*?\]\\n/;
  const matchResult: RegExpMatchArray | null = data.match(regexPattern);
  const renderData: string = matchResult ? matchResult[0] : "";
  const sanitizedData: string = renderData.trim().replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\]\\n/g, '');
  const renderDataJson: any = JSON.parse(sanitizedData);
  const categories: LiveCategory = []


  for (const item of renderDataJson.categoryData) {
    const subs = []
    const id = `${item.partition.id_str},${item.partition.type}`
    for (const subItem of item.sub_partition) {
      subs.push({
        id: `${subItem.partition.id_str},${subItem.partition.type}`,
        parentId: id,
        name: subItem.partition.title ?? "",
        pic: "",
      })
    }
    const category = {
      id: id as string,
      name: item.partition.title ?? "",
      children: subs,
    };
    subs.unshift({
      id: category.id,
      name: category.name,
      parentId: category.id,
      pic: "",
    });
    categories.push(category);
  }
  return categories
}

async function getRecommendRooms(page = 1) {
  const offset = (page - 1) * 20
  const result = await fetch(`/dyin/webcast/web/partition/detail/room/?aid=6383&app_name=douyin_web&live_id=1&device_platform=web&count=20&offset=${offset}&partition=720&partition_type=1`)
  const data = await result.json()
  const hasMore = data.data.data.length >= 20
  const roomItems: DouYuLiveRoom = []
  for (const item of data.data.data) {
    roomItems.push({
      roomId: item.web_rid,
      title: item.room.title,
      cover: item.room.cover.url_list[0],
      userName: item.room.owner.nickname,
      online: item.room.room_view_stats.display_value ?? 0,
      avatar: item.room.owner.avatar_thumb.url_list[0]
    })
  }
  return liveResult(hasMore, roomItems)
}

export { getRequestHeaders, getDyinCategores, getRecommendRooms }
import { LiveCategory, DouYuLiveRoom, LiveSubCategory, DouYuListResult, DouYuSearchRoomResult, DouYuSearchAnchorResult, DouYuAnchorInfo, LiveRoomDetail } from "../types/apis";
import { LiveSearchAnchorResult, liveResult } from "../LiveResult";

async function getBlCategores() {
  const result = await fetch(`/bili/room/v1/Area/getList?need_entrance=1&parent_id=0`);
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  const data = await result.json()
  const categories: LiveCategory = []
  for (let item of data.data) {
    const subs = []
    for (let subItem of item.list) {
      subs.push({
        id: subItem.id,
        name: subItem.name ?? '',
        parentId: subItem.parent_id ?? '',
        pic: subItem.pic + '@100w.png' ?? "" + '@100w.png'
      })
    }
    categories.push({
      id: item.id,
      name: item.name ?? '',
      children: subs
    })
  }
  return categories
}

async function getBlRecommendRooms(page = 1) {
  const result = await fetch(`/bili/xlive/web-interface/v1/second/getListByArea?platform=web&sort=online&page_size=30&page=${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data } = await result.json()
  const roomItems = joinRooms(data.list)
  const hasMore = data.list.length !== 0
  return liveResult(hasMore, roomItems)
}

async function getBlCategoryRooms(pid: LiveSubCategory['parentId'], id: LiveSubCategory['id'], page = 1) {
  const result = await fetch(`/bili/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=${pid}&area_id=${id}&sort=''&page=${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data } = await result.json()
  const hasMore = data.has_more === 1
  const roomItems: DouYuLiveRoom = []
  data.list.forEach((item: any) => {
    roomItems.push({
      roomId: item.roomid,
      title: item.title,
      cover: item.cover + '@400w.jpg',
      userName: item.uname,
      online: item.online ?? 0,
      avatar: item.face
    })
  });
  return liveResult(hasMore, roomItems)
}

async function searchBlRooms(keyword: string, page = 1) {
  const result = await fetch(`/abili/x/web-interface/search/type?context=&search_type=live&cover_type=user_cover&order=&keyword=${keyword}&category_id=&__refresh__=&_extra=&highlight=0&single_column=0&page=${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await result.json()
  const roomItems: DouYuLiveRoom = []

  data.data.result.live_room.forEach((item: {
    uface?: string; title: string; roomid: string; uname: string; cover: string; online: string;
  }) => {
    let title = item.title
    title = title.replace(/<.*?em.*?>/g, "");
    roomItems.push({
      roomId: item.roomid,
      title: title,
      userName: item.uname,
      cover: `https:${item.cover}@400w.jpg`,
      online: item.online ?? 0,
      avatar: `https:${item.uface}@400w.jpg`
    })
  });
  let hasMore = roomItems.length >= 40
  return liveResult(hasMore, roomItems)
}

async function searchBlAnchors(keyword: string, page = 1) {
  const result = await fetch(`/abili/x/web-interface/search/type?context=&search_type=live_user&cover_type=user_cover&order=&keyword=${keyword}&category_id=&__refresh__=&_extra=&highlight=0&single_column=0&page=${page}`)
  const data = await result.json()
  const anchorItems: DouYuSearchAnchorResult[] = []
  data.data.result.forEach((anchor: { uname: string; roomid: string; uface: string; is_live: string; }) => {
    let title = anchor.uname
    title = title.replace(/<.*?em.*?>/g, "");
    anchorItems.push({
      roomId: anchor.roomid,
      avatar: `https://${anchor.uface}@400w.jpg`,
      userName: anchor.uname,
      liveStatus: anchor.is_live
    })
  });
  let hasMore = anchorItems.length >= 40
  return LiveSearchAnchorResult(hasMore, anchorItems)
}

async function getRoomDetail(roomId: string): Promise<LiveRoomDetail> {
  const result = await fetch(`/mdyu/${roomId}/index.pageContext.json`)
  const data = await result.json()
  let roomInfo = data.pageProps.room.roomInfo.roomInfo
  const jsEncResult = await fetch(`/dyu/swf_api/homeH5Enc?rids=${roomId}`)
  let encodeData = await jsEncResult.json()
  let crptext = encodeData.data[`room${roomId}`]
  const args = await getPlayArgs(crptext, roomId)

  let liveRoomDetail: LiveRoomDetail = {
    roomId: roomInfo.rid,
    title: roomInfo.roomName,
    userName: roomInfo.nickname,
    userAvatar: roomInfo.avatar,
    cover: roomInfo.roomSrc,
    online: roomInfo.hn,
    introduction: "",
    notice: roomInfo.notice,
    status: roomInfo.isLive,
    danmakuData: roomInfo.rid,
    url: `https://www.douyu.com/${roomId}`,
    data: args,
  }
  return liveRoomDetail
}

async function getPlayArgs(html: string, rid: string) {
  let h = replaceEval(extractFunction(html))
  let d = { html: h, rid: rid }

  const result = await fetch('/adyu/api/AllLive/DouyuSign', {
    method: 'POST',
    body: JSON.stringify(d),
    headers: {
      'content-type': 'application/json'
    }
  })
  const data = await result.json()
  if (data.code === 0) {
    return data.data
  }
  return ''
}

async function getPlayQualities(roomDetail: LiveRoomDetail) {
  let params = roomDetail.data + "&cdn=&rate=-1&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0"
  const result = await fetch(`/dyu/lapi/live/getH5Play/${roomDetail.roomId}`, {
    method: 'POST',
    body: params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  const data = await result.json()

  let qualities: { quality: string, data: any }[] = []

  let cdns: string[] = []

  for (let item in data.data.cdnsWithName) {
    cdns.push(data.data.cdnsWithName[item].cdn)
  }
  for (let item in data.data.multirates) {
    qualities.push({
      quality: data.data.multirates[item].name,
      data: {
        rate: data.data.multirates[item].rate,
        cdns
      }
    })
  }
  return qualities
}
async function getPlayUrl(roomId: string, args: string, rate: number, cdn: string) {
  args += `&cdn=${cdn}&rate=${rate}`
  const result = await fetch(`/dyu/lapi/live/getH5Play/${roomId}`, {
    method: 'POST',
    body: args,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  const data = await result.json()
  const url = `${data.data.rtmp_url}/${data.data.rtmp_live}`
  return url
}

async function getPlayUrls(roomDetail: LiveRoomDetail, qualities: { quality: string, data: any }[]) {
  const args = roomDetail.data
  const urls: string[] = []
  qualities.forEach((quality: any) => {
    quality.data.cdns.forEach(async (cdn: string) => {
      let url = await getPlayUrl(roomDetail.roomId, args, quality.data.rate, cdn)
      urls.push(url)
    })
  })
  return urls
}

function joinRooms(list: { roomid: string; title: string; uname: string; cover: string; online: string; face: string; }[]) {
  const roomItem: DouYuLiveRoom = []
  list.forEach((l: { roomid: string; title: string; uname: string; cover: string; online: string; face: string; }) => {
    roomItem.push({
      roomId: l.roomid,
      title: l.title,
      userName: l.uname,
      cover: l.cover + '@400w.jpg',
      online: l.online ?? 0,
      avatar: l.face
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
function extractFunction(html: string) {
  const pattern = /(vdwdae325w_64we[\s\S]*function ub98484234[\s\S]*?)function/g;
  const match = pattern.exec(html);
  return match && match[1] || "";
}
function replaceEval(html: string) {
  const pattern = /eval.*?;/g;
  return html.replace(pattern, "strc;");
}

export { getBlCategores, getBlRecommendRooms, getBlCategoryRooms, searchBlRooms, searchBlAnchors }
export { getRoomDetail, getPlayArgs, getPlayQualities, getPlayUrls, getPlayUrl }
import { LiveCategory, DouYuLiveRoom, LiveSubCategory, DouYuListResult, DouYuSearchRoomResult, DouYuSearchAnchorResult, DouYuAnchorInfo, DouYuLiveRoomDetail } from "../types/apis";
import { LiveSearchAnchorResult, liveResult } from "../LiveResult";

function getCategores(): LiveCategory {

  const LiveCategory: LiveCategory = [
    { id: "PCgame", name: "网游竞技", children: [] },
    { id: "djry", name: "单机热游", children: [] },
    { id: "syxx", name: "手游休闲", children: [] },
    { id: "yl", name: "娱乐天地", children: [] },
    { id: "yz", name: "颜值", children: [] },
    { id: "kjwh", name: "科技文化", children: [] },
    { id: "yp", name: "语言互动", children: [] },
  ];
  // LiveCategory.forEach(async live => {
  //   const item = await getSubCategories(live.id)
  //   live.children = live.children.concat(item)
  // })
  return LiveCategory
}

async function getSubCategories(id: string) {
  const result = await fetch(`/dyu/japi/weblist/api/getC2List?shortName=${id}&offset=0&limit=200`)
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  let sub: LiveSubCategory[] = []
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

async function getCategoryRooms(subId: LiveSubCategory['id'], page = 1) {
  const result = await fetch(`/dyu/gapi/rkc/directory/mixList/2_${subId}/page=${page}`,)
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
  const result = await fetch(`/dyu/japi/weblist/apinc/allpage/6/${page}`)
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const { data }: { data: DouYuListResult } = await result.json()
  const roomItems = joinRooms(data)
  let hasMore = page < data.pgcnt
  return liveResult(hasMore, roomItems)
}

async function searchRooms(keyword: string, page = 1) {
  const did = generateRandomHexString(32)
  const result = await fetch(`/dyu/japi/search/api/searchShow?kw=${keyword}&page=${page}&pageSize=20`, {})
  console.log(did);

  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await result.json()
  if (data.error !== 0) {
    return
  }
  const roomItems: DouYuLiveRoom = []
  data.data.relateShow.forEach((l: { [x: string]: any; }) => {
    roomItems.push({
      roomId: l['rid'],
      title: l['roomName'],
      userName: l['nickName'],
      cover: l['roomSrc'],
      online: l['hot'],
    })
  });
  let hasMore = data.data.relateShow.length !== 0
  return liveResult(hasMore, roomItems)
}

async function searchAnchors(keyword: string, page = 1) {
  const result = await fetch(`/dyu/japi/search/api/searchUser?kw=${keyword}&page=${page}&pageSize=20&filterType=1`)
  const data = await result.json()
  if (data.error !== 0) {
    return
  }
  const anchorItems: DouYuSearchAnchorResult[] = []
  data.data.relateUser.forEach((anchor: DouYuAnchorInfo) => {
    anchorItems.push({
      roomId: anchor.anchorInfo.rid,
      avatar: anchor.anchorInfo.avatar,
      userName: anchor.anchorInfo.nickName,
      liveStatus: anchor.anchorInfo.isLive
    })
  });
  let hasMore = data.data.relateUser.length !== 0
  return LiveSearchAnchorResult(hasMore, anchorItems)
}

async function getRoomDetail(roomId: string): Promise<DouYuLiveRoomDetail> {
  const result = await fetch(`/mdyu/${roomId}/index.pageContext.json`)
  const data = await result.json()
  let roomInfo = data.pageProps.room.roomInfo.roomInfo
  const jsEncResult = await fetch(`/dyu/swf_api/homeH5Enc?rids=${roomId}`)
  let encodeData = await jsEncResult.json()
  let crptext = encodeData.data[`room${roomId}`]
  const args = await getPlayArgs(crptext, roomId)

  let liveRoomDetail: DouYuLiveRoomDetail = {
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

async function getPlayQualities(roomDetail: DouYuLiveRoomDetail) {
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

async function getPlayUrls(roomDetail: DouYuLiveRoomDetail, qualities: { quality: string, data: any }[]) {
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

function joinRooms(list: DouYuListResult) {
  list.rl = list.rl.filter((l: { type: number; }) => {
    return l.type == 1
  })
  const roomItem: DouYuLiveRoom = []
  list.rl.forEach((l: { [x: string]: any; }) => {
    roomItem.push({
      roomId: l['rid'],
      title: l['rn'],
      userName: l['nn'],
      cover: l['rs16'],
      online: l['ol'],
      avatar: `https://apic.douyucdn.cn/upload/${l['av']}_small.jpg`
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

export { getCategores, getSubCategories, getCategoryRooms, getRecommendRooms, searchRooms, searchAnchors }
export { getRoomDetail, getPlayArgs, getPlayQualities, getPlayUrls, getPlayUrl }
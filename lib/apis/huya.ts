import { liveResult } from "../LiveResult";
import { LiveCategory, DouYuLiveRoom, LiveSubCategory, DouYuListResult, DouYuLiveRoomDetail } from "../types/apis";

type Data = {
  data: any[];
  msg: string;
  status: number;
  type: number;
  updateTime: number;
};


type HuyaLine = {
  line: string;
  lineType: 'flv' | 'hls';
  flvAntiCode: string;
  hlsAntiCode: string;
  streamName: string;
}

type HuyaBitRate = {
  name: string;
  bitRate: number;
}

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

async function getHyCategoryRoom(id: string, page = 1) {
  const result = await fetch(`/hy?m=LiveList&do=getLiveListByPage&tagAll=0&gameId=${id}&page=${page}`)
  const data = await result.json()
  const roomItem: DouYuLiveRoom = []
  data.data.datas.forEach((item: {
    avatar180: string; profileRoom: string; introduction: string; screenshot: string; nick: string; totalCount: number;
  }) => {
    roomItem.push({
      roomId: item.profileRoom,
      title: item.introduction,
      cover: item.screenshot,
      userName: item.nick,
      online: item.totalCount,
      avatar: item.avatar180
    })
  })
  const hasMore = data.data.page < data.data.totalPage
  return liveResult(hasMore, roomItem)

}
async function getHyRoomDetail(roomId: string) {

  const result = await fetch(`/mhy/${roomId}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
  const data = await result.text()
  const regex = /window\.HNF_GLOBAL_INIT.=.\{(.*?)\}.<\/script>/g;
  const match = regex.exec(data);
  const text = match?.[1];
  const jsonObj = JSON.parse(`{${text}}`);
  let title = jsonObj["roomInfo"]["tLiveInfo"]["sIntroduction"] === '' ? jsonObj["roomInfo"]["tLiveInfo"]["sRoomName"] : '';
  console.log(jsonObj);
  const huyaLines: HuyaLine[] = [];
  const huyaBiterates: HuyaBitRate[] = [];
  //读取可用线路
  const lines = jsonObj["roomInfo"]["tLiveInfo"]["tLiveStreamInfo"]["vStreamInfo"]["value"];
  for (const item of lines) {

    if ((item?.sFlvUrl?.toString() ?? "").length > 0) {
      huyaLines.push({
        line: item.sFlvUrl,
        lineType: 'flv',
        flvAntiCode: item.sFlvAntiCode,
        hlsAntiCode: item.sHlsAntiCode,
        streamName: item.sStreamName,
      });
    }
  }
  //清晰度
  const biterates = jsonObj["roomInfo"]["tLiveInfo"]["tLiveStreamInfo"]["vBitRateInfo"]["value"];
  for (const item of biterates) {
    const name = item.sDisplayName.toString();
    if (name.includes("HDR")) {
      continue;
    }
    huyaBiterates.push({
      bitRate: item.iBitRate,
      name: name,
    });
  }
  const topSid = parseInt(data.match(/lChannelId":([0-9]+)/)?.[1] ?? "0");
  const subSid = parseInt(data.match(/lSubChannelId":([0-9]+)/)?.[1] ?? "0");
  const uid = await getAnonymousUid()
  let liveRoomDetail: DouYuLiveRoomDetail = {
    roomId: jsonObj["roomInfo"]["tLiveInfo"]["lProfileRoom"],
    title: title,
    userName: jsonObj["roomInfo"]["tProfileInfo"]["sNick"],
    userAvatar: jsonObj["roomInfo"]["tProfileInfo"]["sAvatar180"],
    cover: jsonObj["roomInfo"]["tLiveInfo"]["sScreenshot"],
    online: jsonObj["roomInfo"]["tLiveInfo"]["lTotalCount"],
    introduction: jsonObj["roomInfo"]["tLiveInfo"]["sIntroduction"],
    notice: jsonObj["welcomeText"],
    status: jsonObj["roomInfo"]["eLiveStatus"],
    danmakuData: {
      ayyuid: jsonObj["roomInfo"]["tLiveInfo"]["lYyid"] ?? 0,
      topSid: topSid ?? 0,
      subSid: subSid ?? 0,
    },
    url: `https://www.huya.com/${roomId}`,
    data: {
      url: `https:${atob(jsonObj["roomProfile"]["liveLineUrl"].toString())}`,
      lines: huyaLines,
      bitRates: huyaBiterates,
      uid: uid,
    },
  }
  return liveRoomDetail
  // return data
}


async function getAnonymousUid() {
  const body = {
    "appId": 5002,
    "byPass": 3,
    "context": "",
    "version": "2.4",
    "data": {}
  }
  const result = await fetch('/uhy', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await result.json()
  return data.data.uid


}
function getUUid(): string {
  const currentTime = Date.now();
  const randomValue = Math.floor(Math.random() * 4294967295);
  const result = (currentTime % 10000000000 * 1000 + randomValue) % 4294967295;
  return result.toString();
}

export { getHyRecommendRooms, getHyCategores, getHySubCategories, getHyCategoryRoom }
export { getHyRoomDetail }
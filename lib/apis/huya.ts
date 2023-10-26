import { LiveSearchAnchorResult, liveResult } from "../LiveResult";
import { LiveCategory, DouYuLiveRoom, LiveSubCategory, DouYuListResult, LiveRoomDetail, DouYuSearchAnchorResult } from "../types/apis";
const md5 = require('md5');

type Data = {
  data: any[];
  msg: string;
  status: number;
  type: number;
  updateTime: number;
};

enum HuyaLineType {
  flv = "flv",
  hls = "hls",
}


type HuyaLine = {
  line: string;
  lineType: HuyaLineType;
  flvAntiCode: string;
  hlsAntiCode: string;
  streamName: string;
}

type HuyaBitRate = {
  name: string;
  bitRate: number;
}

type LivePlayQuality = {
  data: string[],
  quality: any,
}

async function getHyRecommendRooms(page = 1) {
  const result = await fetch(`/ahy/cache.php?m=LiveList&do=getLiveListByPage&tagAll=0&page=${page}`)
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
  const result = await fetch(`/ahy/cache.php?m=LiveList&do=getLiveListByPage&tagAll=0&gameId=${id}&page=${page}`)
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

async function getHyPlayQualites(detail: LiveRoomDetail) {
  const qualities = [];
  const urlData = detail.data;

  if (urlData.bitRates.length === 0) {
    urlData.bitRates = [
      {
        name: "原画",
        bitRate: 0,
      },
      {
        name: "高清",
        bitRate: 2000,
      },
    ];
  }
  for (const item of urlData.bitRates) {
    const urls: string[] = [];

    for (const line of urlData.lines) {
      let src = line.line;
      src += `/${line.streamName}`;

      if (line.lineType === HuyaLineType.flv) {
        src += ".flv";
      }

      if (line.lineType === HuyaLineType.hls) {
        src += ".m3u8";
      }

      const parms = processAnticode(
        line.lineType === HuyaLineType.flv ? line.flvAntiCode : line.hlsAntiCode,
        urlData.uid,
        line.streamName,
      );
      src += `?${parms}`;

      if (item.bitRate > 0) {
        src += `&ratio=${item.bitRate}`;
      }

      urls.push(src);
    }

    qualities.push({
      data: urls,
      quality: item.name,
    });
  }
  return Promise.resolve(qualities);
}
async function getHyPlayUrls(detail: LiveRoomDetail, quality: LivePlayQuality): Promise<string[]> {
  return quality.data as string[];
}

async function getHyRoomDetail(roomId: string) {

  const result = await fetch(`/mhy/${roomId}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/91.0.4472.69",
    }
  })
  const data = await result.text()
  const regex = /window\.HNF_GLOBAL_INIT.=.\{(.*?)\}.<\/script>/g;
  const match = regex.exec(data);
  const text = match?.[1];
  const jsonObj = JSON.parse(`{${text}}`);
  let title = jsonObj["roomInfo"]["tLiveInfo"]["sIntroduction"] === '' ? jsonObj["roomInfo"]["tLiveInfo"]["sRoomName"] : '';
  const huyaLines: HuyaLine[] = [];
  const huyaBiterates: HuyaBitRate[] = [];
  //读取可用线路
  const lines = jsonObj["roomInfo"]["tLiveInfo"]["tLiveStreamInfo"]["vStreamInfo"]["value"];
  for (const item of lines) {

    if ((item?.sFlvUrl?.toString() ?? "").length > 0) {
      huyaLines.push({
        line: item.sFlvUrl,
        lineType: HuyaLineType.flv,
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
  let liveRoomDetail: LiveRoomDetail = {
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
}

async function searchHyRooms(keyword: string, page = 1) {
  const searchPrams = new URLSearchParams({
    m: "Search",
    do: "getSearchContent",
    q: keyword,
    uid: "0",
    v: "4",
    typ: "-5",
    livestate: "0",
    rows: "20",
    start: ((page - 1) * 20).toString()
  });
  const result = await fetch(`/shy?${searchPrams.toString()}`)
  const data = await result.json()
  const roomItems: DouYuLiveRoom = []
  for (const room of data.response[3].docs) {
    let cover = room.game_screenshot
    if (!cover.includes('?')) {
      cover += '?x-oss-process=style/w338_h190&'
    }
    roomItems.push({
      roomId: room.room_id,
      cover: cover,
      title: room.game_introduction ?? '',
      userName: room.game_nick,
      online: room.game_total_count ?? 0,
      avatar: room.game_imgUrl
    })
  }
  const hasMore = data.response[3].numFound > page * 20
  return liveResult(hasMore, roomItems)
}

async function searchHyAnchors(keyword: string, page = 1) {
  const searchPrams = new URLSearchParams({
    m: "Search",
    do: "getSearchContent",
    q: keyword,
    uid: "0",
    v: "1",
    typ: "-5",
    livestate: "0",
    rows: "20",
    start: ((page - 1) * 20).toString()
  });
  const result = await fetch(`/shy?${searchPrams.toString()}`)
  const data = await result.json()
  const anchorItems: DouYuSearchAnchorResult[] = []
  for (const room of data.response[1].docs) {
    anchorItems.push({
      roomId: room.room_id,
      userName: room.game_nick,
      liveStatus: room.gameLiveOn,
      avatar: room.game_avatarUrl180
    })
  }
  const hasMore = data.response[1].numFound > (page * 20);
  return LiveSearchAnchorResult(hasMore, anchorItems)
}


async function getAnonymousUid() {
  const body = {
    "appId": 5002,
    "byPass": 3,
    "context": "",
    "version": "2.4",
    "data": {}
  }
  const result = await fetch('/uhy/web/anonymousLogin', {
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

function processAnticode(anticode: string, uid: string, streamname: string): string {
  const q: { [key: string]: string } = {};
  const anticodeParams = new URLSearchParams(anticode);
  anticodeParams.forEach((value, key) => {
    q[key] = value;
  });

  q["ver"] = "1";
  q["sv"] = "2110211124";
  q["seqid"] = (parseInt(uid) + Date.now()).toString();
  q["uid"] = uid;
  q["uuid"] = getUUid();

  const ss = md5(`${q["seqid"]}|${q["ctype"]}|${q["t"]}`).toString();
  q["fm"] = decodeURIComponent(atob(q["fm"]))
    .replace("$0", q["uid"])
    .replace("$1", streamname)
    .replace("$2", ss)
    .replace("$3", q["wsTime"]);

  q["wsSecret"] = md5(q["fm"]).toString();

  delete q["fm"];
  if ("txyp" in q) {
    delete q["txyp"];
  }

  const queryParameters = new URLSearchParams(q);

  return queryParameters.toString();
}

export { getHyRecommendRooms, getHyCategores, getHySubCategories, getHyCategoryRoom, searchHyRooms, searchHyAnchors }
export { getHyRoomDetail, getHyPlayQualites, getHyPlayUrls }
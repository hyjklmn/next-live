import axios from 'axios'
import { liveResult } from "../LiveResult";
import { DouYuLiveRoom, LiveCategory, LiveSubCategory } from "../types/apis";

const headers: { [key: string]: string } = {
  "Authority": "live.douyin.com",
  "credentials": 'include',
  "withCredentials": "true",
  "Referer": "https://live.douyin.com",
  'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
};

async function getRequestHeaders() {
  try {
    if (headers.hasOwnProperty('cookie')) headers
    // const result = await fetch('/dyin', { credentials: 'include', headers: headers })
    // console.log(result);
    const data = await axios.get('/dyin', {
      headers: headers
    })
    console.log(data);

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

async function getCategoryRooms(category: LiveSubCategory, page = 1) {
  const ids = category.id.split(',');
  const partitionId = ids[0];
  const partitionType = ids[1];
  const queryParameters = new URLSearchParams({
    "aid": '6383',
    "app_name": "douyin_web",
    "live_id": '1',
    "device_platform": "web",
    "count": '30',
    "offset": ((page - 1) * 30).toString(),
    "partition": partitionId,
    "partition_type": partitionType,
    "req_from": '2'
  })
  const result = await fetch(`/dyin/webcast/web/partition/detail/room/?${queryParameters.toString()}`)
  const data = await result.json()
  const hasMore = data.data.data.length >= 30
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

async function getRecommendRooms(page = 1) {
  const offset = (page - 1) * 20
  const result = await fetch(`/dyin/webcast/web/partition/detail/room/?aid=6383&app_name=douyin_web&live_id=1&device_platform=web&count=20&offset=${offset}&partition=720&partition_type=1`, {
    headers: headers
  })
  if (!result.ok) {
    throw new Error('Failed to fetch data')
  }
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

async function getDyinRoomDetail(roomId: string) {
  const detail = await getRoomWebDetail(roomId)
  const webRid = roomId;
  const realRoomId = detail.roomStore.roomInfo.room.id_str
  const userUniqueId = detail.userStore.odin.user_unique_id
  const queryParameters = new URLSearchParams({
    "aid": "6383",
    "app_name": "douyin_web",
    "live_id": "1",
    "device_platform": "web",
    "enter_from": "web_live",
    "web_rid": webRid,
    "room_id_str": realRoomId,
    "enter_source": "",
    "Room-Enter-User-Login-Ab": "0",
    "is_need_double_stream": "false",
    "cookie_enabled": "true",
    "screen_width": "1980",
    "screen_height": "1080",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Edge",
    "browser_version": "114.0.1823.51"
  })
  const result = await fetch(`/dyin/webcast/room/web/enter/?${queryParameters.toString()}`)
  const data = await result.text()




}

async function getRoomWebDetail(webRid: string) {
  const result = await fetch(`/dyin/${webRid}`, {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Authority": "live.douyin.com",
      "Referer": "https://live.douyin.com",
      "Cookie": `__ac_nonce=${generateRandomString(21)}`,
    }
  })
  const data = await result.text()
  const renderDataMatch = data.match(/\{\\"state\\":\{\\"isLiveModal.*?\]\\n/);
  const renderData = renderDataMatch ? renderDataMatch[0] : '';
  const str = renderData.trim().replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(']\\n', '');
  const renderDataJson = JSON.parse(str);
  return renderDataJson.state
}

async function searchRooms(keyword: string, page = 1) {
  const serverUrl: string = 'https://www.douyin.com/aweme/v1/web/live/search/';
  const queryParams: URLSearchParams = new URLSearchParams({
    device_platform: 'webapp',
    aid: '6383',
    channel: 'channel_pc_web',
    search_channel: 'aweme_live',
    keyword: keyword,
    search_source: 'switch_tab',
    query_correct_type: '1',
    is_filter_search: '0',
    from_group_id: '',
    offset: ((page - 1) * 30).toString(),
    count: '30',
    pc_client_type: '1',
    version_code: '170400',
    version_name: '17.4.0',
    cookie_enabled: 'true',
    screen_width: '1980',
    screen_height: '1080',
    browser_language: 'zh-CN',
    browser_platform: 'Win32',
    browser_name: 'Edge',
    browser_version: '114.0.1823.58',
    browser_online: 'true',
    engine_name: 'Blink',
    engine_version: '114.0.0.0',
    os_name: 'Windows',
    os_version: '10',
    cpu_core_num: '12',
    device_memory: '8',
    platform: 'PC',
    downlink: '4.7',
    effective_type: '4g',
    round_trip_time: '100',
    webid: '7247041636524377637'
  });
  const uri: string = `${serverUrl}?${queryParams.toString()}`;
  const resultUrl = await signUrl(uri)
  const fetchUrl = resultUrl.url.replace('https://www.douyin.com', '/wdyin')
  const result = await fetch(fetchUrl, {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Authority": "live.douyin.com",
      "Referer": "https://www.douyin.com/",
      "Cookie": `__ac_nonce=${generateRandomString(21)}`,
    }
  })
  const data = await result.json()
  if (data.data.length === 0) {
    console.log('暂无信息');
    return
  }
  const roomItems: DouYuLiveRoom = []
  for (const item of data.data) {
    const itemData = JSON.parse(item.lives.rawdata)
    roomItems.push({
      roomId: itemData.owner.web_rid,
      title: itemData.title,
      cover: itemData.cover.url_list[0],
      userName: itemData.owner.nickname,
      online: itemData.stats.total_user ?? 0,
    })
  }
  const hasMore = roomItems.length >= 10
  return liveResult(hasMore, roomItems)
}


async function signUrl(url: string) {
  try {
    const body = {
      "url": url,
      "userAgent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51"
    }
    const result = await fetch('/dysign', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await result.json()
    return data.data
  } catch (error) {
    console.error(error);
    return url
  }
}

function generateRandomString(length: number): string {
  const values: number[] = Array.from({ length }, () => Math.floor(Math.random() * 16));
  const randomString: string = values.map((value) => value.toString(16)).join('');
  return randomString;
}

export { getRequestHeaders, getDyinCategores, getRecommendRooms, getCategoryRooms }
export { getDyinRoomDetail, searchRooms, }
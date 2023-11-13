import { liveResult } from "../LiveResult";
import { DouYuLiveRoom, LiveCategory, LiveRoomDetail, LiveSubCategory } from "../types/apis";

const headers: { [key: string]: string } = {
  "Authority": "live.douyin.com",
  "credentials": 'include',
  "withCredentials": "true",
  "Referer": "https://live.douyin.com",
  'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
};
const defaultImg = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjY0IDEzLjQzM3YtMS4zMWMtLjQ1Ni0uMDU1LS45MTEtLjA5MS0xLjM4NS0uMDkxLTUuNjQ3IDAtMTAuMjU2IDQuNTg3LTEwLjI1NiAxMC4yNSAwIDMuNDU5IDEuNzMgNi41MzYgNC4zNzIgOC4zOTNhMTAuMTc3IDEwLjE3NyAwIDAgMS0yLjc1LTYuOTczYy4wMTgtNS41OSA0LjQ4LTEwLjE0MSAxMC4wMTgtMTAuMjY5WiIgZmlsbD0iIzAwRkFGMCIvPjxwYXRoIGQ9Ik0xMS44NzcgMjguMzQ1YTQuNjc1IDQuNjc1IDAgMCAwIDQuNjYzLTQuNDk3VjEuNTQ1aDQuMDhhNy4yMjYgNy4yMjYgMCAwIDEtLjEyNy0xLjQyaC01LjU3NHYyMi4zMDNhNC42NzUgNC42NzUgMCAwIDEtNC42NjQgNC40OTdjLS43ODMgMC0xLjUzLS4yLTIuMTY3LS41NDdhNC42NDQgNC42NDQgMCAwIDAgMy43ODkgMS45NjdaTTI4LjI1MSA5LjExOVY3Ljg4YTcuNjgzIDcuNjgzIDAgMCAxLTQuMjI2LTEuMjU3IDcuOTE2IDcuOTE2IDAgMCAwIDQuMjI2IDIuNDk1WiIgZmlsbD0iIzAwRkFGMCIvPjxwYXRoIGQ9Ik0yNC4wNDUgNi42MjZhNy43MjEgNy43MjEgMCAwIDEtMS45MTMtNS4wOGgtMS40OTRhNy44MzYgNy44MzYgMCAwIDAgMy40MDcgNS4wOFpNMTAuMjU1IDE3LjU4NWE0LjY3OSA0LjY3OSAwIDAgMC00LjY4MiA0LjY3OWMwIDEuODAyIDEuMDIgMy4zNSAyLjUxNCA0LjEzM2E0LjcwNyA0LjcwNyAwIDAgMS0uODkyLTIuNzMxIDQuNjc5IDQuNjc5IDAgMCAxIDQuNjgxLTQuNjhjLjQ3NCAwIC45NDguMDczIDEuMzg1LjIxOXYtNS42OGMtLjQ1Ni0uMDU1LS45MTEtLjA5MS0xLjM4NS0uMDkxaC0uMjM2djQuMzdhNC4zMjMgNC4zMjMgMCAwIDAtMS4zODUtLjIyWiIgZmlsbD0iI0ZFMkM1NSIvPjxwYXRoIGQ9Ik0yOC4yNTIgOS4xMTl2NC4zMzNjLTIuODk2IDAtNS41NTYtLjkyOS03Ljc0Mi0yLjQ5NHYxMS4zMDZjMCA1LjY0NC00LjU5IDEwLjI1LTEwLjI1NSAxMC4yNS0yLjE4NiAwLTQuMjA4LS42OTItNS44NjYtMS44NTcgMS44NzYgMi4wMDMgNC41MzYgMy4yNzcgNy41MDUgMy4yNzcgNS42NDcgMCAxMC4yNTYtNC41ODggMTAuMjU2LTEwLjI1VjEyLjM3OGExMy4yNjkgMTMuMjY5IDAgMCAwIDcuNzQyIDIuNDk0VjkuMzAxYTkuNjE2IDkuNjE2IDAgMCAxLTEuNjQtLjE4MloiIGZpbGw9IiNGRTJDNTUiLz48cGF0aCBkPSJNMjAuNTEgMjIuMjY0VjEwLjk1OGExMy4yNjggMTMuMjY4IDAgMCAwIDcuNzQxIDIuNDk0VjkuMTJhNy44NSA3Ljg1IDAgMCAxLTQuMjI2LTIuNDk0IDcuNjYgNy42NiAwIDAgMS0zLjM4OC01LjA4aC00LjA4djIyLjMwM2E0LjY3NSA0LjY3NSAwIDAgMS00LjY2NCA0LjQ5NyA0LjYyNSA0LjYyNSAwIDAgMS0zLjc4OS0xLjk0OCA0LjY3OCA0LjY3OCAwIDAgMS0yLjUxNC00LjEzMyA0LjY3OSA0LjY3OSAwIDAgMSA0LjY4Mi00LjY3OWMuNDczIDAgLjk0Ny4wNzMgMS4zODQuMjE4di00LjM3Yy01LjUzOC4xMjgtMTAgNC42OC0xMCAxMC4yMzMgMCAyLjY5NCAxLjAzOCA1LjE1MiAyLjc1IDYuOTczYTEwLjIxMSAxMC4yMTEgMCAwIDAgNS44NjYgMS44NTdjNS42MjkuMDE4IDEwLjIzNy00LjU4OCAxMC4yMzctMTAuMjMyWiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=="

async function getRequestHeaders() {
  const data = await signUrl('https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=7142091187963399427&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333')
  document.cookie = 'ttwid' + '=' + data.ttwid;
}

async function getDyinCategores() {
  const result = await fetch('/dyin/hot_live')
  const data = await result.text()
  // chat-gpt
  const regexPattern: RegExp = /\{\\"pathname\\":\\"\/hot_live\\",\\"categoryData.*?\]\\n/;
  const matchResult: RegExpMatchArray | null = data.match(regexPattern);
  const renderData: string = matchResult ? matchResult[0] : "";
  const sanitizedData = renderData.trim().replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\]\\n/g, '');
  const renderDataJson = JSON.parse(sanitizedData);
  const categories: LiveCategory = []
  for (const item of renderDataJson.categoryData) {
    const subs = []
    const id = `${item.partition.id_str},${item.partition.type}`
    for (const subItem of item.sub_partition) {
      subs.push({
        id: `${subItem.partition.id_str},${subItem.partition.type}`,
        parentId: id,
        name: subItem.partition.title ?? "",
        pic: defaultImg,
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
      pic: defaultImg,
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
  getRequestHeaders()
  const result = await fetch(`/dyin/webcast/room/web/enter/?${queryParameters.toString()}`)
  const data = await result.json()
  const roomInfo = data.data.data[0]
  const userInfo = data.data.user
  const roomStatus = roomInfo.status
  const liveRoomDetail: LiveRoomDetail = {
    roomId: webRid,
    title: roomInfo.title,
    cover: roomStatus === 2 ? roomInfo.cover.url_list[0] : '',
    userName: userInfo.nickname,
    userAvatar: userInfo.avatar_thumb.url_list[0],
    online: roomStatus === 2 ? roomInfo.room_view_stats.display_value : 0,
    status: roomStatus,
    url: `https://live.douyin.com/${webRid}`,
    introduction: roomInfo.title,
    notice: "",
    data: roomInfo.stream_url,
    danmakuData: {}
  }
  return liveRoomDetail
}

async function getRoomWebDetail(webRid: string) {
  const result = await fetch(`/dyin/${webRid}`, {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Authority": "live.douyin.com",
      "Referer": "https://live.douyin.com",
      "Cookie": `__ac_nonce=${generateRandomString(21)}`,
      "withCredentials": "true",
      "credentials": "include",
    }
  })
  const data = await result.text()
  const renderDataMatch = data.match(/\{\\"state\\":\{\\"isLiveModal.*?\]\\n/);
  const renderData = renderDataMatch ? renderDataMatch[0] : '';

  const str = renderData.trim().replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(']\\n', '');
  const renderDataJson = JSON.parse(str);
  return renderDataJson.state
}

async function searchDouyinRooms(keyword: string, page = 1) {
  const serverUrl: string = "https://www.douyin.com/aweme/v1/web/live/search/";
  const uri = new URL(serverUrl);
  uri.protocol = "https";
  uri.port = "443";
  uri.search = new URLSearchParams({
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "search_channel": "aweme_live",
    "keyword": keyword,
    "search_source": "switch_tab",
    "query_correct_type": "1",
    "is_filter_search": "0",
    "from_group_id": "",
    "offset": ((page - 1) * 10).toString(),
    "count": "10",
    "pc_client_type": "1",
    "version_code": "170400",
    "version_name": "17.4.0",
    "cookie_enabled": "true",
    "screen_width": "1980",
    "screen_height": "1080",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Edge",
    "browser_version": "114.0.1823.58",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "114.0.0.0",
    "os_name": "Windows",
    "os_version": "10",
    "cpu_core_num": "12",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "4.7",
    "effective_type": "4g",
    "round_trip_time": "100",
    "webid": "7247041636524377637",
  }).toString();

  let requestUrl = await signUrl(uri.toString());
  const fetchUrl = requestUrl.url.replace('https://www.douyin.com', '/wdyin')

  document.cookie = `__ac_nonce=${generateRandomString(21)}`
  const result = await fetch(fetchUrl, {
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Authority": "live.douyin.com",
      "Referer": "https://www.douyin.com/",
    }
  })
  const data = await result.json()
  const roomItems: DouYuLiveRoom = []
  for (const item of data.data) {
    const itemData = JSON.parse(item.lives.rawdata)
    roomItems.push({
      roomId: itemData.owner.web_rid,
      title: itemData.title,
      cover: itemData.cover.url_list[0],
      userName: itemData.owner.nickname,
      online: itemData.stats.total_user ?? 0,
      avatar: itemData.owner.avatar_thumb.url_list[0]
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

export { getDyinCategores, getRecommendRooms, getCategoryRooms }
export { getDyinRoomDetail, searchDouyinRooms, }
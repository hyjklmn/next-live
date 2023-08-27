  Future<LiveRoomDetail> getRoomDetail({required String roomId}) async {
    var result = await HttpClient.instance.getJson(
        "https://m.douyu.com/$roomId/index.pageContext.json",
        queryParameters: {},
        header: {
          'referer': 'https://m.douyu.com/$roomId',
          'user-agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0',
        });
    var roomInfo = result["pageProps"]["room"]["roomInfo"]["roomInfo"];

    var jsEncResult = await HttpClient.instance.getText(
        "https://www.douyu.com/swf_api/homeH5Enc?rids=$roomId",
        queryParameters: {},
        header: {
          'referer': 'https://www.douyu.com/$roomId',
          'user-agent':
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43"
        });
    var crptext = json.decode(jsEncResult)["data"]["room$roomId"].toString();

    return LiveRoomDetail(
      cover: roomInfo["roomSrc"].toString(),
      online: parseHotNum(roomInfo["hn"].toString()),
      roomId: roomInfo["rid"].toString(),
      title: roomInfo["roomName"].toString(),
      userName: roomInfo["nickname"].toString(),
      userAvatar: roomInfo["avatar"].toString(),
      introduction: "",
      notice: roomInfo["notice"].toString(),
      status: roomInfo["isLive"] == 1,
      danmakuData: roomInfo["rid"].toString(),
      data: await getPlayArgs(crptext, roomInfo["rid"].toString()),
      url: "https://www.douyu.com/$roomId",
    );
  }



    Future<String> getPlayUrl(
      String roomId, String args, int rate, String cdn) async {
    args += "&cdn=$cdn&rate=$rate";
    var result = await HttpClient.instance.postJson(
      "https://www.douyu.com/lapi/live/getH5Play/$roomId",
      data: args,
      header: {
        'referer': 'https://www.douyu.com/$roomId',
        'user-agent':
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43"
      },
      formUrlEncoded: true,
    );

    return "${result["data"]["rtmp_url"]}/${HtmlUnescape().convert(result["data"]["rtmp_live"].toString())}";
  }


    Future<List<String>> getPlayUrls(
      {required LiveRoomDetail detail,
      required LivePlayQuality quality}) async {
    var args = detail.data.toString();
    var data = quality.data as DouyuPlayData;

    List<String> urls = [];
    for (var item in data.cdns) {
      var url = await getPlayUrl(detail.roomId, args, data.rate, item);
      if (url.isNotEmpty) {
        urls.add(url);
      }
    }
    return urls;
  }


    Future<List<LivePlayQuality>> getPlayQualites(
      {required LiveRoomDetail detail}) async {
    var data = detail.data.toString();
    data += "&cdn=&rate=-1&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";
    List<LivePlayQuality> qualities = [];
    var result = await HttpClient.instance.postJson(
      "https://www.douyu.com/lapi/live/getH5Play/${detail.roomId}",
      data: data,
      formUrlEncoded: true,
    );

    var cdns = <String>[];
    for (var item in result["data"]["cdnsWithName"]) {
      cdns.add(item["cdn"].toString());
    }
    for (var item in result["data"]["multirates"]) {
      qualities.add(LivePlayQuality(
        quality: item["name"].toString(),
        data: DouyuPlayData(item["rate"], cdns),
      ));
    }
    return qualities;
  }


  Future<bool> getLiveStatus({required String roomId}) async {
    var detail = await getRoomDetail(roomId: roomId);
    return detail.status;
  }

  Future<String> getPlayArgs(String html, String rid) async {
    //取加密的js
    html = RegExp(
                r"(vdwdae325w_64we[\s\S]*function ub98484234[\s\S]*?)function",
                multiLine: true)
            .firstMatch(html)
            ?.group(1) ??
        "";
    html = html.replaceAll(RegExp(r"eval.*?;}"), "strc;}");

    var result = await HttpClient.instance.postJson(
        "http://alive.nsapps.cn/api/AllLive/DouyuSign",
        data: {"html": html, "rid": rid});

    if (result["code"] == 0) {
      return result["data"].toString();
    }
    return "";
  }
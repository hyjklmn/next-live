'use client'
import React, { useEffect, useState, useRef } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import Artplayer from './player';
import { getRoomDetail, searchRooms } from '@/lib/apis/douyu';
import DouYuDanmaku from '@/lib/danmaku/douyu/douyu';

// new DouYuDanmaku().start('5324055')
function LivePlayer() {
  const a = useRef() as any
  useEffect(() => {
    const DOUYUDANMU = new DouYuDanmaku()
    DOUYUDANMU.start('5324055')
    DOUYUDANMU.onMessage = (msg) => {
      console.log(msg);

      if (a.current) {
        a.current.plugins.artplayerPluginDanmuku.emit({
          text: msg.message,
          color: msg.color.toString(),
          border: false,
        });

      }
    }
  }, [])
  const [recommendList, setRecommendList] = useState<any>([])
  const douyu = new DouYuDanmaku
  console.log(douyu.getColor(1));

  useEffect(() => {
    getRoomDetail('5324055').then(res => {
      console.log(res.ab);
      setRecommendList((recommendList: any) => {
        return res.ab
      })

    })
    searchRooms('大硕')
  }, [])

  function flvFunc(video: HTMLMediaElement, url: any, art: { flv: flvjs.Player; on: (arg0: string, arg1: () => void) => void; notice: { show: string; }; }) {
    console.log(video);

    if (flvjs.isSupported()) {
      if (art.flv) art.flv.destroy();
      const flv = flvjs.createPlayer({ type: 'flv', url });
      flv.attachMediaElement(video);
      flv.load();
      art.flv = flv;
      art.on('destroy', () => flv.destroy());
    } else {
      art.notice.show = 'Unsupported playback format: flv';
    }
  }
  // function playM3u8(video, url, art) {
  //   console.log(video);

  //   if (Hls.isSupported()) {
  //     if (art.hls) art.hls.destroy();
  //     const hls = new Hls();
  //     hls.loadSource(url);
  //     hls.attachMedia(video);
  //     art.hls = hls;
  //     art.on('destroy', () => hls.destroy());
  //   } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //     video.src = url;
  //   } else {
  //     art.notice.show = 'Unsupported playback format: m3u8';
  //   }
  // }
  return (
    <div className='w-full h-full'>
      <Artplayer
        option={{
          url: "https://huos3a.douyucdn2.cn/live/5324055rDTWzzYRA_900.flv?wsAuth=cb0c5863045227d0213e39407527dfa8&token=web-h5-0-5324055-8d9aa97d7a69b17f2ac1f2fcd3f952ce47029a86f29f2d94&logo=0&expire=0&did=10000000000000000000000000001501&pt=2&st=0&sid=361337475&origin=tct&mix=0&isp=",
          customType: {
            flv: flvFunc,
          },
          type: 'flv',
          isLive: true,
          plugins: [
            artplayerPluginDanmuku({
              danmuku: [
                {
                  text: '111', // 弹幕文本
                  time: 1, // 发送时间，单位秒
                  color: '#fff', // 弹幕局部颜色
                  border: false, // 是否显示描边
                  mode: 0, // 弹幕模式: 0表示滚动, 1静止
                },
                {
                  text: '222',
                  time: 2,
                  color: 'red',
                  border: true,
                  mode: 0,
                },
                {
                  text: '333',
                  time: 3,
                  color: 'green',
                  border: false,
                  mode: 1,
                },
              ],
            })
          ]
        }}
        getInstance={(art: any) => a.current = art}
      />
    </div>
  );
}

export default LivePlayer;
'use client'
import { useEffect, useState, useRef } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import Artplayer from './player';

import { useSearchParams } from 'next/navigation';
import { getPlayQualites, getPlayUrls, getRoomDetail } from '@/lib/apis/douyu';
import { DouYuLiveRoomDetail } from '@/lib/types/apis';

// new DouYuDanmaku().start('5324055')
export default function LivePlayer() {

  const a = useRef() as any
  const query = useSearchParams()
  const rid = query.get('rid') as string
  const [roomDetail, setRoomDetail] = useState<DouYuLiveRoomDetail>()
  const [qualities, setQualities] = useState<{
    quality: string;
    data: any;
  }[]>()
  const [urls, setUrls] = useState<string[]>([])

  async function rd() {
    const details = await getRoomDetail(rid)
    const quality = await getPlayQualites(details)
    // const cdns = await getPlayUrls(details, quality)


    setRoomDetail(details)
    // setQualities(quality)
    // setUrls(cdns)
    // console.log(urls);
    // console.log(cdns);


  }

  useEffect(() => {
    rd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rid])

  // useEffect(() => {
  //   const DOUYUDANMU = new DouYuDanmaku()
  //   DOUYUDANMU.start('5324055')
  //   DOUYUDANMU.onMessage = (msg) => {
  //     console.log(msg);

  //     if (a.current) {
  //       a.current.plugins.artplayerPluginDanmuku.emit({
  //         text: msg.message,
  //         color: msg.color.toString(),
  //         border: false,
  //       });

  //     }
  //   }
  // }, [])
  // const [recommendList, setRecommendList] = useState<any>([])
  // const douyu = new DouYuDanmaku
  // useEffect(() => {

  // }, [])

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
      {urls?.map((r, i) => {
        return <li key={i}>{r}</li>
      })}
      {roomDetail?.userName}
      {/* <Artplayer
        option={{
          url: '',
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
      /> */}
    </div>
  );
}


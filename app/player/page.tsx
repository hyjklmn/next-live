'use client'
import React, { useEffect, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import Artplayer from './player';
import { getRoomDetail, searchRooms } from '@/lib/apis/douyu';

function LivePlayer() {
  const [recommendList, setRecommendList] = useState<any>([])

  useEffect(() => {
    getRoomDetail('1863767').then(res => {
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
          url: "https://stream-heilongjiang-ct-112-102-64-228.edgesrv.com:8443/live/1863767rkpl2_900p.flv?wsAuth=ce96cf4121d32e2acdcbad27674dcfa5&token=web-h5-0-1863767-7b520f6fe0a2b18d8e1844d8a6cf9c696b99ccb62ac99ba7&logo=0&expire=0&did=10000000000000000000000000001501&pt=2&st=0&sid=332376375&vhost=play2&origin=tct&mix=0&isp=scdncthelj",
          customType: {
            flv: flvFunc,
          },

          type: 'flv',
          isLive: true
        }}
        getInstance
      />
    </div>
  );
}

export default LivePlayer;
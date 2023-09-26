'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Artplayer from './player';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import Option from 'artplayer/types/option';
import DouYuDanmaku from '@/lib/danmaku/douyu';
import HuYaDanmaku from "@/lib/danmaku/huya";


import { getPlayQualities, getPlayUrls, getRoomDetail } from '@/lib/apis/douyu';
import { LiveRoomDetail } from '@/lib/types/apis';
import { getHyRoomDetail, getHyPlayQualites, getHyPlayUrls } from '@/lib/apis/huya';
function App() {
  const query = useSearchParams()
  const rid = query.get('rid') as string
  const platform = query.get('plat')
  const artRef = useRef<Artplayer>()
  const douyuDM = new DouYuDanmaku()
  const [roomDetail, setRoomDetail] = useState<LiveRoomDetail>()
  const [options, setOptions] = useState<Option>()
  const hy = useRef() as any
  async function initDouyu() {
    const details = await getRoomDetail(rid)
    const quality = await getPlayQualities(details)
    const cdns = await getPlayUrls(details, quality)
    setTimeout(() => {
      setRoomDetail(details)
      let arr: { url: string, html: string, default?: boolean }[] = []
      if (cdns.length <= 3) {
        for (let i = 0; i < cdns.length; i++) {
          arr.push({
            url: cdns[i],
            html: ''
          })
        }
      } else {
        for (let i = 0; i < cdns.length; i += 3) {
          arr.push({
            url: cdns[i],
            html: ''
          })
        }
      }
      // for (let k = 0; k < quality.length; k++) {
      //   arr[k]['html'] = quality[k].quality
      // }
      // arr[0]['default'] = true
      setOptions({
        container: '',
        url: arr[0].url,
        autoplay: true,
        quality: arr,
        isLive: true,
        type: 'flv',
        customType: {
          flv: flvFunc,
        },
        fullscreen: true,
        plugins: [
          artplayerPluginDanmuku({
            danmuku: [],
            speed: 10,
            synchronousPlayback: true
          })
        ]
      })
      // 弹幕
      douyuDM.start(rid)
      douyuDM.onMessage = (msg) => {
        if (artRef.current) {
          artRef.current.plugins.artplayerPluginDanmuku.emit({
            text: msg.message,
            color: msg.color.toString(),
            border: false,
          });
        }
      }
    }, 500);
  }

  async function initHuya() {
    const details = await getHyRoomDetail(rid)
    const quality = await getHyPlayQualites(details)

    setOptions({
      container: '',
      url: quality[0].data[0],
      autoplay: true,
      // quality: quality,
      isLive: true,
      type: 'flv',
      customType: {
        flv: flvFunc,
      },
      fullscreen: true,
      plugins: [
        artplayerPluginDanmuku({
          danmuku: [],
          speed: 10,
          synchronousPlayback: true
        })
      ]
    })

    hy.current.addListener('message', (msg: { data: any; color: any; }) => {
      if (artRef.current) {
        artRef.current.plugins.artplayerPluginDanmuku.emit({
          text: msg.data,
          border: false,
          color: msg.color
        });
      }
    })
  }

  async function flvFunc(video: HTMLMediaElement, url: string, art: any) {
    const flvjs = (await import('flv.js')).default
    if (flvjs.isSupported()) {
      if (art.flv) art.flv.destroy();
      const flv = flvjs.createPlayer({
        type: 'flv',
        url,
      },
        {
          enableStashBuffer: false,
          stashInitialSize: 128,
          autoCleanupSourceBuffer: true,
          fixAudioTimestampGap: true
        });
      flv.attachMediaElement(video);
      flv.load();
      art.flv = flv;
      art.on('destroy', () => flv.destroy());
    } else {
      art.notice.show = 'Unsupported playback format: flv';
    }
  }
  useEffect(() => {
    if (platform === 'huya') {
      hy.current = new HuYaDanmaku(rid)
      initHuya()
    }
    if (platform === 'douyu') {
      initDouyu()
    }

    return () => {
      // douyuDM.onMessage = undefined
      // douyuDM.stop()
      if (hy.current) {
        hy.current.exit()
        hy.current.removeAllListeners()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-full h-full'>
      {options ? <Artplayer option={options} getInstance={(art: any) => artRef.current = art} /> : <>Loading</>}
    </div>
  );
}

export default App;
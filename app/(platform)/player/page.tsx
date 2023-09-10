'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { DouYuLiveRoomDetail } from '@/lib/types/apis';
import { getPlayQualities, getPlayUrls, getRoomDetail } from '@/lib/apis/douyu';
import DouYuDanmaku from '@/lib/danmaku/douyu/douyu';

import Artplayer from 'artplayer';
// import flvjs from 'flv.js';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
export default function Page() {
  const query = useSearchParams()
  const rid = query.get('rid') as string
  const [roomDetail, setRoomDetail] = useState<DouYuLiveRoomDetail>()
  const [qualities, setQualities] = useState<{ quality: string; data: any; }[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const artRef = useRef<any>()
  const douyuDM = new DouYuDanmaku()
  useEffect(() => {
    (async () => {
      const flvjs = (await import('flv.js')).default
      const details = await getRoomDetail(rid)
      const quality = await getPlayQualities(details)
      const cdns = await getPlayUrls(details, quality)
      function flvFunc(video: HTMLMediaElement, url: string, art: any) {
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
      setTimeout(() => {
        setRoomDetail(details)
        let arr: { url: string, html: string, default?: boolean }[] = []
        // setQualities(preState => [...preState, ...quality])
        // setUrls(preState => [...preState, ...cdns])
        for (let i = 0; i < cdns.length; i += 3) {
          arr.push({
            url: cdns[i],
            html: ''
          })
        }
        for (let k = 0; k < quality.length; k++) {
          arr[k]['html'] = quality[k].quality
        }
        arr[0]['default'] = true
        const options = {
          container: '.artplayer-app',
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
            })
          ]
        }
        // const art = new Artplayer(options)
        artRef.current = new Artplayer(options)

        artRef.current.on('ready', () => {
          setTimeout(() => {
            artRef.current.quality = arr;
          }, 3000);
        })
        artRef.current.on('error', () => {
          setTimeout(() => {
            artRef.current.quality = arr;
          }, 3000);
        });
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
    })()


    return () => {
      if (artRef.current && artRef.current.destroy) {
        artRef.current.destroy();
        douyuDM.stop()
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='artplayer-app w-full h-full'></div>
  )
}

// import React, { useEffect, useRef, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// import Artplayer from './player';
// import flvjs from 'flv.js';
// import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'


// import { getPlayQualities, getPlayUrls, getRoomDetail } from '@/lib/apis/douyu';
// import { DouYuLiveRoomDetail } from '@/lib/types/apis';
// import DouYuDanmaku from '@/lib/danmaku/douyu/douyu';
// import Option from 'artplayer/types/option';

// function App() {
//   const query = useSearchParams()
//   const rid = query.get('rid') as string
//   const artRef = useRef<Artplayer>()
//   const douyuDM = new DouYuDanmaku()
//   const [roomDetail, setRoomDetail] = useState<DouYuLiveRoomDetail>()
//   //   const [qualities, setQualities] = useState<{ quality: string; data: any; }[]>([])
//   //   const [urls, setUrls] = useState<string[]>([])
//   const [options, setOptions] = useState<Option>()
//   useEffect(() => {
//     (async () => {
//       const details = await getRoomDetail(rid)
//       const quality = await getPlayQualities(details)
//       const cdns = await getPlayUrls(details, quality)
//       setTimeout(() => {
//         setRoomDetail(details)
//         let arr: { url: string, html: string, default?: boolean }[] = []
//         // setQualities(preState => [...preState, ...quality])
//         // setUrls(preState => [...preState, ...cdns])
//         for (let i = 0; i < cdns.length; i += 3) {
//           arr.push({
//             url: cdns[i],
//             html: ''
//           })
//         }
//         for (let k = 0; k < quality.length; k++) {
//           arr[k]['html'] = quality[k].quality
//         }
//         arr[0]['default'] = true
//         setOptions({
//           container: '',
//           url: arr[0].url,
//           autoplay: true,
//           quality: arr,
//           isLive: true,
//           type: 'flv',
//           customType: {
//             flv: flvFunc,
//           },
//           fullscreen: true,
//           plugins: [
//             artplayerPluginDanmuku({
//               danmuku: [],
//               speed: 10,
//             })
//           ]
//         })
//       }, 500);
//       // 弹幕
//       douyuDM.start(rid)
//       douyuDM.onMessage = (msg) => {
//         if (artRef.current) {
//           artRef.current.plugins.artplayerPluginDanmuku.emit({
//             text: msg.message,
//             color: msg.color.toString(),
//             border: false,
//           });

//         }
//       }
//     })()
//     return () => {
//       douyuDM.onMessage = undefined
//       douyuDM.stop()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <div className='w-full h-full'>
//       {options?.url ? <Artplayer option={options} getInstance={(art: any) => artRef.current = art} /> : null}
//     </div>
//   );
// }

// export default App;
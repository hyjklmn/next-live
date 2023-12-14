'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { searchRooms, searchAnchors } from '@/lib/apis/douyu'
import { searchBlRooms, searchBlAnchors } from '@/lib/apis/bilibili'
import { searchHyAnchors, searchHyRooms } from '@/lib/apis/huya'
import { searchDouyinRooms } from '@/lib/apis/douyin'
import { AnchorResult, LiveResult } from '@/lib/types/apis'
import Loading from '@/components/loading'
import RoomCard from '@/components/RoomCard'
import Image, { ImageLoaderProps } from 'next/image'
import { useToast } from "@/hooks/useToast"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword')
  const type = searchParams.get('type')
  const platform = searchParams.get('platform')
  const { showToast } = useToast();
  const [roomList, setRoomList] = useState<LiveResult>({
    hasMore: false,
    roomItems: []
  })
  const [anchorList, setAnchorList] = useState<AnchorResult>({
    hasMore: false,
    anchorItems: []
  })
  async function douyuSearch() {
    if (type === '房间') {
      const data = await searchRooms(keyword!)
      if (typeof data === 'string') {
        showToast({
          type: 'error',
          content: data
        })
        return
      }
      setRoomList(data)
    } else {
      const data = await searchAnchors(keyword!)
      setAnchorList(data)
    }
  }
  async function huyaSearch() {
    if (type === '房间') {
      const data = await searchHyRooms(keyword!)
      setRoomList(data)
    } else {
      const data = await searchHyAnchors(keyword!)
      setAnchorList(data)
    }
  }
  async function biliSearch() {
    if (type === '房间') {
      const data = await searchBlRooms(keyword!)
      setRoomList(data)
    } else {
      const data = await searchBlAnchors(keyword!)
      setAnchorList(data)
    }
  }
  async function douyinSearch() {
    if (type === '房间') {
      const data = await searchDouyinRooms(keyword!)
      if (data.roomItems.length === 0) {
        showToast({
          type: 'error',
          content: '暂无内容,稍后重试'
        })
        return
      }
      setRoomList(data)
    } else {
      showToast({
        type: 'default',
        content: '抖音暂不支持搜索主播，请直接搜索直播间'
      });
    }
  }
  useEffect(() => {

    if (platform === '1') {
      douyuSearch()
    }
    if (platform === '2') {
      huyaSearch()
    }
    if (platform === '3') {
      biliSearch()
    }
    if (platform === '4') {
      douyinSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, keyword])
  return (
    <div>
      {
        type === '房间' && roomList.roomItems ? roomList.roomItems.length === 0 ? <Loading /> :
          <RoomCard list={roomList.roomItems} /> : anchorList.anchorItems.length === 0 ? <Loading /> :
          <AnchorCard list={anchorList.anchorItems} />
      }
    </div >
  )
}


function AnchorCard(props: any) {
  const router = useRouter()

  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }
  function toPlayer(rid: string) {
    const regex = /\/([^/]+)\/?/g;
    router.push(`/player/?rid=${rid}&plat=hy`)
  }
  return (
    <div className='relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
      {
        props.list.map((anchor: any) => {
          return (
            <div key={anchor.roomId} className="flex flex-col items-center border px-2 py-6 transition-colors duration-200 transform cursor-pointer group hover:bg-blue-600 rounded-xl" onClick={() => toPlayer(anchor.roomId)}>
              <Image className="object-cover w-28 h-28 rounded-full ring-4 ring-gray-300"
                loader={imageLoader} src={anchor.avatar}
                priority
                width={0}
                height={0}
                alt={anchor.userName} />
              <p className="mt-4 text-base font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white">{anchor.userName}</p>
              <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">房间号:{anchor.roomId}</p>
              {
                anchor.liveStatus ? <LiveStatusBadge text='直播中' /> : ''
              }
            </div>
          )
        })
      }
    </div>
  )
}

function LiveStatusBadge({ text }: { text: string }) {
  return (
    <span className={`absolute right-3 top-3 inline-block p-1 text-xs rounded bg-red-500`}>
      {text}
    </span>
  )
}
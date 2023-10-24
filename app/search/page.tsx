'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { searchRooms, searchAnchors } from '@/lib/apis/douyu'
import { searchBlRooms, searchBlAnchors } from '@/lib/apis/bilibili'
import { searchHyAnchors, searchHyRooms } from '@/lib/apis/huya'
import { LiveResult } from '@/lib/types/apis'
import Loading from '@/components/loading'
import RoomCard from '@/components/RoomCard'
export default function SearchPage() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword')
  const type = searchParams.get('type')
  const platform = searchParams.get('platform')

  const [roomList, setRoomList] = useState<LiveResult>({
    hasMore: false,
    roomItems: []
  })
  async function douyuSearch() {
    if (type === '房间') {
      const data = await searchRooms(keyword!)
      // setRoomList(data)
    } else {
      console.log('wip');
    }
  }
  async function huyaSearch() {
    if (type === '房间') {
      const data = await searchHyRooms(keyword!)
      setRoomList(data)
    } else {
      const data = await searchHyAnchors(keyword!)
    }
  }
  async function biliSearch() {
    if (type === '房间') {
      const data = await searchBlRooms(keyword!)
      console.log(data);

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
    if (platform === '4') { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, keyword])
  return (
    <div>
      {
        roomList.roomItems.length === 0 ? <Loading /> :
          <RoomCard list={roomList.roomItems} />
      }
    </div>
  )
}

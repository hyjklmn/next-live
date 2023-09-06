'use client'
import React, { useEffect, useState } from 'react'
import { getRecommendRooms } from '@/lib/apis/huya'
import { LiveResult } from '@/lib/types/apis'
import RoomCard from '@/components/RoomCard'
export default function Page() {
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  useEffect(() => {
    (async function () {
      const data = await getRecommendRooms()
      setRecommend(data)
    })()
  }, [])
  return (
    <div>
      <RoomCard list={recommend.roomItems} />
    </ div>
  )
}

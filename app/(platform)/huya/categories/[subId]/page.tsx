'use client'
import React, { useEffect, useState } from 'react'
import { getHyCategoryRoom } from '@/lib/apis/huya'
import { LiveResult } from '@/lib/types/apis'
import RoomCard from '@/components/RoomCard'
type Params = {
  subId: string
}

export default function CategoryRoomPage({ params }: { params: Params }) {
  const [roomData, setRoomData] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  async function categoryRooms() {
    const data = await getHyCategoryRoom(params.subId)
    setRoomData(data)
  }
  useEffect(() => {
    categoryRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <RoomCard list={roomData.roomItems} />
    </div>
  )
}

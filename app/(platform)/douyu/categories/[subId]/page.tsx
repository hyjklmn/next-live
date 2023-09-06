'use client'
import React, { useEffect, useState } from 'react'
import { getCategoryRooms, searchAnchors } from '@/lib/apis/douyu'
import RoomCard from '@/components/RoomCard'
import { LiveResult } from '@/lib/types/apis'

type Params = {
  subId: string
}
export default function CategoryRoomPage({ params }: { params: Params }) {
  const [roomData, setRoomData] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  async function categoryRooms() {
    const data = await getCategoryRooms(params.subId)
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

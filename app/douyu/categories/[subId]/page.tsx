'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCategoryRooms, searchAnchors } from '@/lib/apis/douyu'
import RoomCard from '@/components/RoomCard'
import { LiveResult } from '@/lib/types/apis'
export default function CategoryRoomPage() {
  const params = useParams()
  const subId = params.subId as string
  const [roomData, setRoomData] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  async function categoryRooms() {
    const data = await getCategoryRooms(subId)
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

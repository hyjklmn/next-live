'use client'
import React, { useEffect, useState } from 'react'
import { LiveResult } from '@/lib/types/apis'
import RoomCard from '@/components/RoomCard'
import { useRouter } from 'next/navigation'
import { getBlCategoryRooms, getBlRoomDetail, getBlPlayQualities } from '@/lib/apis/bilibili'
type Params = {
  ids: string[]
}

export default function CategoryRoomPage({ params }: { params: Params }) {
  const router = useRouter()
  const pid = params.ids[0]
  const id = params.ids[1]
  const [roomData, setRoomData] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  async function categoryRooms() {
    const data = await getBlCategoryRooms(pid, id)
    setRoomData(data)

    let a = await getBlRoomDetail('22908869')
    console.log(a);

    getBlPlayQualities(a)


  }
  useEffect(() => {
    categoryRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (params.ids.length < 2) {
    router.back()
    return
  }

  return (
    <div>
      <meta name='referrer' content='no-referrer' />
      <RoomCard list={roomData.roomItems} />
    </div>
  )
}

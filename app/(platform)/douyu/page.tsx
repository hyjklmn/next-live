"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import { getRecommendRooms } from '@/lib/apis/douyu'
import { LiveResult } from '@/lib/types/apis'

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
      <Link href='/douyu/categories'>斗鱼 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      <RoomCard list={recommend.roomItems} />
    </div>
  )
}

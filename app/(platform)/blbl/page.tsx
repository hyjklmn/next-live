"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import { getBlRecommendRooms } from '@/lib/apis/bilibili'
import { LiveResult } from '@/lib/types/apis'

export default function Page() {
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  useEffect(() => {
    (async function () {
      const data = await getBlRecommendRooms()
      setRecommend(data)
    })()
  }, [])
  return (
    <div>
      <meta name='referrer' content='no-referrer' />
      <Link href='/blbl/categories'>哔哩哔哩 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      <RoomCard list={recommend.roomItems} />
    </div>
  )
}

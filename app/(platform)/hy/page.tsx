'use client'
import React, { useEffect, useState } from 'react'
import { getHyRecommendRooms } from '@/lib/apis/huya'
import { LiveResult } from '@/lib/types/apis'
import RoomCard from '@/components/RoomCard'
import Link from 'next/link'
import Loading from '@/components/loading'

export default function Page() {
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })

  useEffect(() => {
    (async function () {
      const data = await getHyRecommendRooms()
      setRecommend(data)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Link href='/hy/categories'>虎牙 categories</Link>
      {
        recommend.roomItems.length !== 0 ? <RoomCard list={recommend.roomItems} /> : <Loading />
      }
    </ div>
  )
}

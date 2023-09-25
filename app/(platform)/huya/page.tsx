'use client'
import React, { useEffect, useState } from 'react'
import { getHyRecommendRooms } from '@/lib/apis/huya'
import { LiveResult } from '@/lib/types/apis'
import RoomCard from '@/components/RoomCard'
import Link from 'next/link'

export default function Page() {
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })

  useEffect(() => {
    (async function () {
      const data = await getHyRecommendRooms()
      setRecommend(data)
      // hy.addListener('message', (msg) => {
      //   console.log(msg);
      // })
    })()
    // return () => {
    //   hy.exit()
    //   hy.removeAllListeners()
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Link href='/huya/categories'>虎牙 categories</Link>
      <RoomCard list={recommend.roomItems} />
    </ div>
  )
}

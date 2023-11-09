'use client'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import Loading from '@/components/loading'
import { getRecommendRooms } from '@/lib/apis/douyin'
import { LiveResult } from '@/lib/types/apis'
import { useEffect, useState } from 'react'
export default function DouYinPage() {
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
      <Link href='/douyin/categories'>抖音 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      {
        recommend.roomItems.length !== 0 ? <RoomCard list={recommend.roomItems} /> : <Loading />
      }
    </div>
  )
}

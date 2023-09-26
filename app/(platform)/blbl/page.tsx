"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
// import { getBlCategores } from '@/lib/apis/bilibili'
import { LiveResult } from '@/lib/types/apis'

export default function Page() {
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: true,
    roomItems: []
  })
  useEffect(() => {


  }, [])
  return (
    <div>
      <Link href='/blbl/categories'>哔哩哔哩 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      {/* <RoomCard list={recommend.roomItems} /> */}
    </div>
  )
}

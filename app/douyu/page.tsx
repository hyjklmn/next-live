"use client"
import React, { useEffect, useState } from 'react'
import RoomCard from '@/components/RoomCard'
import { getSubCategories, getCategores, getCategoryRooms, getRecommendRooms, searchRooms } from '@/lib/apis/douyu'
export default function Page() {

  useEffect(() => {
    const data = getCategores()
    searchRooms('大硕')
  }, [])

  const [recommendList, setRecommendList] = useState<any>([])
  async function asd() {
    const res = await fetch('/api/live/getRecommend?page=1&size=20')
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    const data = await res.json()
    setRecommendList((recommendList: any) => {
      return data.data
    })
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 place-items-center">
        {<RoomCard list={recommendList} />}
      </div>
    </>
  )
}
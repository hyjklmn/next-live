'use client'
import { useParams } from 'next/navigation'
import { getCategoryRooms } from '@/lib/apis/douyu'
import React, { useEffect } from 'react'


export default function CategoryRoomPage() {
  const params = useParams()
  const subId = params.subId as string
  async function categoryRooms() {
    const data = await getCategoryRooms(subId)
  }
  useEffect(() => {
    categoryRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>{subId}</div>
  )
}

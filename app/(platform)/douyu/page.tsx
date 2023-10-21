"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import { getRecommendRooms } from '@/lib/apis/douyu'
import { LiveResult } from '@/lib/types/apis'
import Loading from '@/components/loading'
export default function Page() {
  const loadMoreRef = useRef(null)
  const currentPage = useRef(1)
  const loadingRef = useRef(false)
  const [recommend, setRecommend] = useState<LiveResult>({
    hasMore: false,
    roomItems: []
  })

  async function getData(page = 1) {
    if (loadingRef.current) {
      return
    }

    loadingRef.current = true
    const data = await getRecommendRooms(page)
    if (!data.hasMore) {
      setRecommend(prev => {
        return {
          hasMore: false,
          roomItems: [...prev.roomItems, ...data.roomItems]
        }
      })
      return
    }
    setRecommend(prev => {
      return {
        hasMore: data.hasMore,
        roomItems: [...prev.roomItems, ...data.roomItems]
      }
    })
    loadingRef.current = false
    currentPage.current = page + 1

  }
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let div = loadMoreRef.current
    if (div) {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          getData(currentPage.current)
        }
      })
      observer.observe(div)
      return () => {
        if (observer && div) {
          observer.unobserve(div)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div>
      <Link href='/douyu/categories'>斗鱼 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      {
        recommend.roomItems.length === 0 ? <Loading /> :
          <RoomCard list={recommend.roomItems} />
      }
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  )
}
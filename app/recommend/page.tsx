"use client"
import Image, { ImageLoaderProps } from 'next/image'
import React, { useEffect, useState } from 'react'
import RoomCard from '@/components/RoomCard'

export default function Page() {
  useEffect(() => {
    asd()
  }, [])
  const [recommendList, setRecommendList] = useState<any>([])
  async function asd() {
    const res = await fetch('/api/live/getRecommend?page=1&size=20')
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    const data = await res.json()
    setRecommendList((recommendList: any) => [...data.data])
  }

  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 place-items-center">
      {
        recommendList.map((recommend: any, index: number) => {
          return (
            //   <div className="card w-96 bg-base-100 shadow-xl" key={index}>
            //     <figure>
            //       <Image src={recommend.roomPic} loader={imageLoader} unoptimized width={100} height={50} alt="111" className='w-auto h-auto' />
            //     </figure>
            //     <div className="card-body flex-row items-center justify-between ">
            //       <h2 className="card-title">{recommend.categoryName}</h2>
            //       <p>{recommend.roomName + index}</p>
            //       {/* <div className="card-actions justify-end">
            //   <button className="btn btn-primary">Buy Now</button>
            // </div> */}
            //     </div>
            //   </div>
            <RoomCard key={index} />
          )
        })
      }

    </div>
  )
}

import React from 'react'
import Image from 'next/image'

export default function RoomCard() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        {/* <Image src={recommend.roomPic} loader={imageLoader} unoptimized width={100} height={50} alt="111" className='w-auto h-auto' /> */}
        <Image src="@/public/next.svg" alt='123' width={20} height={20} />
        1
      </figure>
      <div className="card-body flex-row items-center justify-between ">
        <h2 className="card-title">name</h2>
        <p>name</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}

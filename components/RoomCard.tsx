import React from 'react'
import Image, { ImageLoaderProps } from 'next/image'

export default function RoomCard(props: { list: Array<Object>, }) {
  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }

  return (
    <>
      {
        props.list.map((room: any, index) => {
          return (
            <div className="card w-80 h-64 bg-base-100 shadow hover:shadow-xl mb-3 transition-shadow" key={index}>
              <figure className='relative h-40'>
                <Image src={room.roomPic} loader={imageLoader} unoptimized width={100} height={40} alt="111" className='w-full h-full object-cover' />
                <span className='absolute bottom-0 left-0'>
                  <div className="badge badge-ghost">{room.categoryName}</div>
                </span>
                <span className='absolute bottom-0 right-0'>
                  <div className="badge badge-ghost">{room.online}</div>
                </span>
              </figure>
              <div className="card-body w-full flex-col items-left justify-between p-2">
                <div className="card-title text-lg text-ellipsis">
                  <span>{room.roomName}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="avatar flex items-center gap-2">
                    <div className="w-10 rounded-full">
                      <Image src={room.ownerHeadPic} loader={imageLoader} unoptimized width={10} height={10} alt='a' />
                    </div>
                    <span>{room.ownerName}</span>
                  </div>
                  <p>{room.platForm}</p>
                </div>
                {/* <div className="card-actions justify-end">
                  <button className="btn btn-primary">Buy Now</button>
                </div> */}
              </div>
            </div>


          )
        })}
    </>
  )
}

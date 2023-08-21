import React from 'react'
import Image, { ImageLoaderProps } from 'next/image'
import { platFormNameConvert, onlineConvert } from '@/composables/Platforms'

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
                <span className='absolute bottom-0 right-0'>
                  <div className="badge mr-1 pl-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16"><path fill="currentColor" d="M5.016 16c-1.066-2.219-.498-3.49.321-4.688c.897-1.312 1.129-2.61 1.129-2.61s.706.917.423 2.352c1.246-1.387 1.482-3.598 1.293-4.445c2.817 1.969 4.021 6.232 2.399 9.392c8.631-4.883 2.147-12.19 1.018-13.013c.376.823.448 2.216-.313 2.893C9.999 1.002 6.818.002 6.818.002c.376 2.516-1.364 5.268-3.042 7.324c-.059-1.003-.122-1.696-.649-2.656c-.118 1.823-1.511 3.309-1.889 5.135c-.511 2.473.383 4.284 3.777 6.197z" /></svg>
                    <span className='ml-1'>
                      {onlineConvert(room.online)}
                    </span>
                  </div>
                </span>
              </figure>
              <div className="card-body w-full flex-col items-left justify-between p-2">
                <div className="card-title justify-between  text-base">
                  <span className='w-2/3 truncate' title={room.roomName}>{room.roomName}</span>
                  <div className="text-sm font-thin">
                    {room.categoryName}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="avatar flex items-center gap-2">
                    <div className="w-8 rounded-full">
                      <Image src={room.ownerHeadPic} loader={imageLoader} unoptimized width={10} height={10} alt='a' />
                    </div>
                    <span>{room.ownerName}</span>
                  </div>
                  <p className='flex-1 text-right'>{platFormNameConvert(room.platForm)}</p>
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

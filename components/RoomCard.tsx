import React from 'react'
import { useRouter } from 'next/navigation'
import Image, { ImageLoaderProps } from 'next/image'
import { Flame } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { onlineConvert } from '@/lib/Platforms'

function AnchorAvatar(props: any) {
  return (
    <span className='flex items-center gap-2 mt-2'>
      <Avatar className='w-10 h-10'>
        <AvatarImage src={props.avatar} alt={props.userName} />
        <AvatarFallback>{props.userName.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span className='flex flex-col'>
        <span className='text-primary text-lg'>{props.title}</span>
        <span>{props.userName}</span>
      </span>
    </span>
  )
}


export default function RoomCard(props: { list: Array<Object>, }) {
  const router = useRouter()
  const imageLoader = ({ src, width }: ImageLoaderProps) => {
    return `${src}?w=${width}`
  }

  function toPlayer(rid: string) {
    router.push(`/player/?rid=${rid}`)
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
      {/* <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-[150px] w-full" />
        <div className="flex flex-col w-full space-y-2">
          <Skeleton className="w-full h-[30px]" />
          <div className='flex items-center justify-between'>
            <Skeleton className="w-[35px] h-[35px] rounded-full" />
            <Skeleton className="w-[85%] h-[30px]" />
          </div>
        </div>
      </div> */}
      {
        props.list.map((room: any, index) => {
          return (
            <Card className='overflow-hidden cursor-pointer' onClick={() => toPlayer(room.roomId)} key={index}>
              <CardHeader className='p-0 pb-2'>
                <CardTitle>
                  <figure className='relative h-[150px]'>
                    <Image loader={imageLoader} src={room.cover}
                      priority
                      width='0'
                      height='0'
                      className="min-w-full h-full"
                      alt={room.userName} />
                    <div className='flex items-center absolute bottom-0 right-0 p-[2px] text-sm rounded font-medium bg-secondary/80'>
                      <Flame size={16} /> {onlineConvert(room.online)}
                    </div>
                  </figure>
                </CardTitle>
                <CardDescription className='p-1 px-2 truncate select-none text-base' title={room.title}>
                  <AnchorAvatar {...room} />
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
    </div>
  )
}

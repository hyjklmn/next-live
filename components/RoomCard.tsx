import React from 'react'
import { useRouter } from 'next/navigation'
import Image, { ImageLoaderProps } from 'next/image'
import { Flame } from 'lucide-react'

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
      <Avatar className='w-8 h-8'>
        <AvatarImage src={props.avatar} alt={props.userName} />
        <AvatarFallback>{props.userName.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span>{props.userName}</span>
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
      {
        props.list.map((room: any, index) => {
          return (
            <Card key={index} className='overflow-hidden cursor-pointer' onClick={() => toPlayer(room.roomId)}>
              <CardHeader className='p-0 pb-2'>
                <CardTitle>
                  <figure className='relative h-[150px]'>
                    <Image loader={imageLoader} src={room.cover}
                      priority
                      width='0'
                      height='0'
                      className="min-w-full h-full"
                      alt={room.userName} />
                    <div className='flex items-center absolute bottom-0 right-0 text-sm text-secondary rounded font-medium bg-primary/75'>
                      <Flame size={16} /> {onlineConvert(room.online)}
                    </div>
                  </figure>
                </CardTitle>
                <CardDescription className='p-1 px-2 truncate select-none text-base' title={room.title}>
                  <span className='text-primary text-lg'>{room.title}</span>
                  <AnchorAvatar {...room} />

                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
    </div>
  )
}

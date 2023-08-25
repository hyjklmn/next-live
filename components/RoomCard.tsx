import React from 'react'
import Image, { ImageLoaderProps } from 'next/image'
import { platFormNameConvert, onlineConvert } from '@/lib/Platforms'
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

function AnchorAvatar(props: any) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='w-8 h-8'>
        <AvatarImage src={props.ownerHeadPic} alt={props.ownerName} />
        <AvatarFallback>{props.ownerName.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span>{props.ownerName}</span>
    </div>
  )
}


export default function RoomCard(props: { list: Array<Object>, }) {
  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }
  return (
    <>
      {
        props.list.map((room: any, index) => {
          return (
            <Card key={index}>
              <CardHeader className='p-0'>
                <CardTitle>
                  <figure className='min-h-[180px]'>
                    <Image loader={imageLoader} src={room.roomPic}
                      priority
                      unoptimized
                      width="0"
                      height="0"
                      className="w-80 h-auto" alt={room.ownerName}></Image>
                  </figure>
                </CardTitle>
                <CardDescription className='p-1 px-2'>{room.roomName}</CardDescription>
              </CardHeader>
              <CardContent className='p-1 px-2'>
                <AnchorAvatar {...room} />
              </CardContent>
              <CardFooter className='p-1 px-2 flex justify-between'>
                <p>{platFormNameConvert(room.platForm)}</p>
                <p>{onlineConvert(room.online)}</p>
              </CardFooter>
            </Card>
          )
        })}
    </>
  )
}

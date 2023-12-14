// import React from 'react'
// export default function Roomdetail(roomdetail: any) {
//   return (
//     <div>
//       Avator
//       <div>{roomdetail.introduction}</div>
//       <div>{roomdetail.notice}</div>
//     </div>
//   )
// }

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/HCEU4DbQmVg
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LiveRoomDetail } from "@/lib/types/apis"

export default function Component(props: any) {
  const { roomdetail }: { roomdetail: LiveRoomDetail } = props
  return (
    <div>
      <title>
        {roomdetail.title ? roomdetail.title : roomdetail.introduction}
      </title>
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage alt={roomdetail.userName} src={roomdetail.userAvatar} />
              <AvatarFallback>{roomdetail.userName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">{roomdetail.userName}</div>
              <div className="inline rounded bg-blue-500 text-white text-xs text-center">
                {roomdetail.online}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-gray-500">{roomdetail.notice ? roomdetail.notice : roomdetail.introduction}</p>
          <Button
            className="mt-2 py-2 px-4 rounded-lg text-sm font-medium flex-end"
            variant="outline"
          >
            <Link className="no-underline" href={roomdetail.url} target="_blank">
              跳转
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

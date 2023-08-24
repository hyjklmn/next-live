import React from 'react'
import Image, { ImageLoaderProps } from 'next/image'
import { platFormNameConvert, onlineConvert } from '@/composables/Platforms'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          )
        })}
    </>
  )
}

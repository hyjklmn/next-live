'use client'
import { useEffect, useState, useRef } from 'react';
import Image, { ImageLoaderProps } from 'next/image'
import { usePathname } from 'next/navigation';
import { getBlCategores } from '@/lib/apis/bilibili'
import { LiveCategory, LiveSubCategory } from '@/lib/types/apis';
import Link from 'next/link';
import Loading from '@/components/loading';

export default function Categories() {
  const pathName = usePathname()
  const [category, setCategory] = useState<LiveCategory>([])

  const [subCategory, setSubCategory] = useState<LiveSubCategory[]>([])
  const currentCate = useRef('2')
  function changeCate(cate: string) {
    currentCate.current = cate
    category.map(c => {
      return c.id === cate ? setSubCategory(c.children) : [];
    })
  }

  useEffect(() => {
    getBlCategores().then(res => {
      setCategory(res)
      setSubCategory(res[0].children)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }

  return (
    <>
      <meta name='referrer' content='no-referrer' />
      {
        category.length === 0 ? <Loading /> : (
          <>
            <div className="flex justify-center sticky top-1 left-0 my-2 text-sm md:text-base font-medium m-auto z-10">
              <nav className="flex items-center space-x-3 md:space-x-6 p-2 border-2 rounded-full bg-background">
                {
                  category.map(cate => {
                    return <span onClick={() => changeCate(cate.id)} key={cate.id} className={`${currentCate.current == cate.id ? 'text-lime-500' : ''} cursor-pointer transition-colors hover:text-lime-500 text-foreground/60`}>{cate.name}</span>
                  })
                }
              </nav>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4'>
              {
                subCategory.map(sub => {
                  return (
                    <Link href={`${pathName}/${sub.parentId}/${sub.id}`} key={sub.id} className='border text-center rounded-lg p-3  hover:scale-105 hover:border-gray-600 hover:shadow-sm transition-all'>
                      <figure className='min-h-[100px]'>
                        <Image loader={imageLoader} src={sub.pic}
                          priority
                          unoptimized
                          width="0"
                          height="0"
                          className="w-full h-auto" alt={sub.name}></Image>
                      </figure>
                      <span>
                        {sub.name}
                      </span>
                    </Link>)
                })
              }
            </div>
          </>
        )
      }
    </>
  )
}

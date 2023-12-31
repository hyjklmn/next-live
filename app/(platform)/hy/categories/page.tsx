'use client'
import { useEffect, useState, useRef } from 'react';
import Image, { ImageLoaderProps } from 'next/image'
import { usePathname } from 'next/navigation';
import { getHyCategores, getHySubCategories } from '@/lib/apis/huya'
import { LiveCategory, LiveSubCategory } from '@/lib/types/apis';
import Link from 'next/link';
import Loading from '@/components/loading';
import CategoryNav from '../../category-nav';


export default function Categories() {
  const pathName = usePathname()
  const [category, setCategory] = useState<LiveCategory>([])
  const categores = getHyCategores()
  const [subCategory, setSubCategory] = useState<LiveSubCategory[]>([])
  const currentCate = useRef('1')
  function changeCate(cate: string) {
    currentCate.current = cate
    category.map(c => {
      return c.id === cate ? setSubCategory(c.children) : [];
    })
  }

  useEffect(() => {
    categores.forEach(async cate => {
      let subs: LiveSubCategory[] = await getHySubCategories(cate.id)
      if (subs.length != 0) {
        cate.children = subs
        setCategory([...categores])
        cate.id === currentCate.current ? setSubCategory(subs) : []
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imageLoader = ({ src }: ImageLoaderProps) => {
    return `${src}`
  }

  return (
    <>
      {
        category.length === 0 ? <Loading /> :
          <>
            <CategoryNav category={category} func={changeCate} />
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4'>
              {
                subCategory.map(sub => {
                  return (
                    <Link href={`${pathName}/${sub.id}`} key={sub.id} className='border text-center rounded-lg p-3  hover:scale-105 hover:border-gray-600 hover:shadow-sm transition-all'>
                      <figure className='min-h-[100px]'>
                        <Image loader={imageLoader}
                          src={sub.pic}
                          priority
                          unoptimized
                          width="0"
                          height="0"
                          className="w-full max-h-[110px] object-cover"
                          alt={sub.name}></Image>
                      </figure>
                      <div title={sub.name} className='relative -bottom-2 truncate'>
                        {sub.name}
                      </div>
                    </Link>)
                })
              }
            </div>
          </>
      }
    </>
  )
}

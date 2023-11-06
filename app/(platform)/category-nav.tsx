import React, { useRef } from 'react'
import { LiveCategory } from '@/lib/types/apis'

export default function CategoryNav({ category, func }: { category: LiveCategory, func: (cate: string) => void }) {
  const currentCate = useRef(category[0]?.id)
  function changeCate(cate: string) {
    currentCate.current = cate
    func(cate)
  }
  return (
    <div className="flex justify-center sticky top-1 left-0 my-2 text-sm md:text-base font-medium m-auto z-10">
      <nav className="flex items-center space-x-3 md:space-x-6 p-2 border-2 rounded-xl backdrop-blur">
        {
          category.map(cate => {
            return <span onClick={() => changeCate(cate.id)} key={cate.id} className={`${currentCate.current == cate.id ? 'text-lime-500' : ''} cursor-pointer transition-colors hover:text-lime-500 text-foreground/60`}>{cate.name}</span>
          })
        }
      </nav>
    </div>
  )
}

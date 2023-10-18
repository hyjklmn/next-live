'use client'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import Loading from '@/components/loading'
export default function DouYinPage() {
  // const [recommend, setRecommend] = useState<LiveResult>({
  //   hasMore: true,
  //   roomItems: []
  // })
  // useEffect(() => {
  //   (async function () {
  //     const data = await getRecommendRooms()
  //     setRecommend(data)
  //   })()
  // }, [])
  return (
    <div>
      <Link href='/douyu/categories'>抖音 categories</Link>
      <p className='text-center text-lg'>推荐</p>
      {/* <RoomCard list={recommend.roomItems} /> */}
      <Loading />
    </div>
  )
}

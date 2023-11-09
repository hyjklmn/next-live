import { useRef } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NavLinks } from "@/lib/NavLinks"
import { useToast } from "@/hooks/useToast"

export default function Search() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const platform = searchParams.get('platform')

  const platFormVal = useRef("")
  const typeVal = useRef("")
  const searchVal = useRef("")
  const router = useRouter()
  function searchBlur(event: React.FocusEvent<HTMLInputElement>) {
    searchVal.current = event.target.value
  }
  const { showToast, hideToast } = useToast();
  function searchClick() {
    if (searchVal.current === '' && platFormVal.current === '' && typeVal.current === '') {
      showToast({
        content: '填写完整内容',
        type: 'error'
      })
      return
    }
    if (typeVal.current === '主播' && platFormVal.current === '4') {
      showToast({
        content: '暂不支持抖音主播搜索',
        type: 'error'
      })
      return
    }
    router.push(`/search?keyword=${searchVal.current}&type=${typeVal.current}&platform=${platFormVal.current}`)
  }
  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={(value) => { platFormVal.current = value }}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="平台" />
        </SelectTrigger>
        <SelectContent>
          {
            NavLinks.map((link) => (
              <SelectItem key={link.key} value={link.key.toString()}>{link.title}</SelectItem>)
            )
          }
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => { typeVal.current = value }}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="房间">房间</SelectItem>
          <SelectItem value="主播">主播</SelectItem>
        </SelectContent>
      </Select>
      <Input type="text" placeholder="Search..." className="w-[200px]" onBlur={searchBlur} />
      <Button size="icon" variant="outline" className="rounded-full shrink-0" onClick={searchClick}>
        <MagnifyingGlassIcon />
      </Button>
    </div>
  )
}

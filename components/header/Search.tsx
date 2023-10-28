import { useRef } from "react"
import { useRouter, useSearchParams } from 'next/navigation'

// import MessageAlert from '@/components/AlertMessage'
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
import { useToast } from "../AlertMessage"

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
  const { addToast } = useToast();
  function searchClick() {
    if (searchVal.current === '' && platFormVal.current === '' && typeVal.current === '') {
      console.log(1);

      addToast('请填写搜索条件', 'warning')
      return
    }
    router.push(`/search?keyword=${searchVal.current}&type=${typeVal.current}&platform=${platFormVal.current}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={platform ?? ''} onValueChange={(value) => { platFormVal.current = value }}>
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
      <Select value={type ?? ''} onValueChange={(value) => { typeVal.current = value }}>
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

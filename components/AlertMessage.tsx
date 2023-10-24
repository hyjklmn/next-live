import React from 'react'
import { AlertCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
export default function MessageAlert() {
  const aletBox = React.useRef<HTMLDivElement>(null)
  function hiddenAlert() {
    aletBox.current?.classList.add('hidden')
  }
  return (
    <div ref={aletBox} className='group w-[150px] relative top-5 left-[50%] translate-x-[-50%]'>
      <Alert variant="destructive">
        <AlertDescription className='flex gap-2 items-center'>
          <AlertCircle className="h-4 w-4" />
          填写完整
        </AlertDescription>
      </Alert>
      <XCircle className="h-4 w-4 hidden cursor-pointer absolute right-1 top-1 text-destructive group-hover:block" onClick={hiddenAlert} />
    </div>
  )
}
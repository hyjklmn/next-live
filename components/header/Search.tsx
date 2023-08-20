import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
// import React from 'react'
export default function Search() {
  return (
    <div className='flex gap-1 mr-2'>
      <input type="text" placeholder="Type here" className="input input-sm input-bordered focus:outline-0" />
      <button className='btn btn-circle btn-sm border'><MagnifyingGlassIcon /></button>
    </div>
  )
}

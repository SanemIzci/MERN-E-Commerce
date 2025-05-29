import React from 'react'

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className=" flex animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  )
}

export default Loading
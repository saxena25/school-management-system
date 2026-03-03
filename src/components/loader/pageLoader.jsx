import React from 'react'

function pageLoader() {
  return (
    <div className="flex-1 w-full h-full">
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    </div>
  )
}

export default pageLoader
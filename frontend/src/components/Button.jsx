import React from 'react'

function Button({name, onClick, size = 'medium'}) {
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  } 
  
  return (
    <button
      onClick={onClick}
      className={`bg-black text-white rounded-md font-medium
        hover:bg-white hover:text-black transition duration-300
        ${sizeClasses[size]}
        border border-black`}
    >
      {name}
    </button>
  )
}

export default Button
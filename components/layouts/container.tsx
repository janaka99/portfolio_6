import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Container({className,children}:{className?:string,children:ReactNode}) {
  return (
    <div className={twMerge('max-w-[1540px] mx-auto px-5 md:px-10', className)}>
      {children}
    </div>
  )
}

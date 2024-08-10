import React from 'react'
import Image from 'next/image'

const Logo = () => {
    return (
        <Image
        height={80}
        width={130}
        alt='logo'
        className='max-h-[50px] object-cover overflow-hidden'
        src={'/eduela.svg'}
        />
    )
}

export default Logo
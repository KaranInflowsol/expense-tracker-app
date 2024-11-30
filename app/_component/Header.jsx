import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function Header() {
    return (
        <div className='p-5 flex justify-between border shadow-sm'>
            <Image src={'./logo.svg'}
                alt='log'
                height={100}
                width={160} />
            <Button className="bg-red-600">Get Started</Button>
        </div>
    )
}

export default Header
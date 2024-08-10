import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
    return (
        <div>
            <p>I am a secured page</p>
            <UserButton
            afterSignOutUrl='/'
            />
        </div>
    )
}

export default Home
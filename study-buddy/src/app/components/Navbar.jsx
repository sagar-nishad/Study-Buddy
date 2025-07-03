
import Link from 'next/link'
import React from 'react'
import { UserAuth } from '../context/AuthContext'

function Navbar() {

    const { user, googleSignIn, logOut } = UserAuth();

    const handleSignIn = async () => {
        try {
            await googleSignIn();
            console.log(user);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-20 w-full border-b-2 flex items-center justify-between p-2'>

            <ul className='flex'>
                <li className='p-2 cursor-pointer'>
                    <Link href="/">Home</Link>
                </li>
                <li className='p-2 cursor-pointer'>
                    <Link href="/notes">Notes</Link>
                </li>
                <li className='p-2 cursor-pointer'>
                    <Link href="/saved">Saved</Link>
                </li>
                <li className='p-2 cursor-pointer'>
                    <Link href="/posts">Your Post</Link>
                </li>
                <li className='p-2 cursor-pointer'>
                    <Link href="/testing2">testing</Link>
                </li>
            </ul>


        { user ?   <button onClick={handleSignOut}>Log Out</button>:<p></p>}

        </div>
    )
}

export default Navbar
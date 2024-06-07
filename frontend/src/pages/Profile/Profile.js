import React from 'react'
import '../Page.css'
import { useUserAuth } from "../../context/UserAuthContext"
import MainPage from './MainPage/MainPage'

function Profile() {

    const { user } = useUserAuth();
    return (
        <div className='profilePage'>
            <MainPage user={user} />
        </div>
    )
}

export default Profile
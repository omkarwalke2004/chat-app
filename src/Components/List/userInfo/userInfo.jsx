import React from 'react'
import "./userInfo.css"
import { useUserStore } from '../../../libs/userStore';

const UserInfo = () => {
  const {currentUser,isLoading,fetchuserInfo} = useUserStore();

  return (
    <div className='userInfo'>
        <div className="users">
<img src={currentUser.avtar || "./avatar.png"} alt="" />
<h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />

        </div>
      
    </div>
  )
}

export default UserInfo
